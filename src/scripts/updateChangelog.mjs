import path from 'path';
import fs from 'fs';
import simpleGit from 'simple-git';

const appRoot = process.cwd();

const options = {
  baseDir: appRoot,
  binary: 'git',
  maxConcurrentProcesses: 6,
  trimmed: true
};
const git = simpleGit(options);

async function switchToMain() {
  const currentBranch = await git.branchLocal();
  if (currentBranch.current !== 'main') {
    await git.checkout('main');
  }
}

async function getLatestTags() {
  const tags = await git.tags({ '--sort': '-v:refname' });
  if (!tags) {
    throw new Error('Tags not found');
  }

  return {
    latest: tags.latest,
    secondLatest: tags.all.length >= 2 ? tags.all[1] : null
  };
}

async function getLogs(range) {
  let logs = [];
  if (!range.secondLatest) {
    const firstCommit = await git.firstCommit();
    logs = await git.log({
      from: firstCommit,
      to: range.latest
    });
  } else {
    logs = await git.log({
      from: range.secondLatest,
      to: range.latest
    });
  }

  const length = logs.all.length;

  let releaseDate = null;

  const data = logs.all.map((logs, index) => {
    if (index === length - 1) {
      releaseDate = logs.date;
    }
    return logs.message;
  });

  return {
    logs: data,
    releaseDate: releaseDate
  };
}

async function writeChangelog() {
  await switchToMain();
  const tags = await getLatestTags();
  const { logs, releaseDate } = await getLogs(tags);
  const groupedLogs = groupByConvention(logs);
  const content = writeContent(tags.latest, releaseDate, groupedLogs);
  const writePath = path.resolve(appRoot, 'CHANGELOG.MD');
  fs.appendFileSync(writePath, content);
}

function groupByConvention(logs) {
  const conventionGroups = {
    feat: [],
    refactor: [],
    chore: [],
    fix: [],
    update: [],
    test: []
  };

  for (const log of logs) {
    const type = log.split(':')[0].split('(')[0];
    if (conventionGroups[type]) {
      conventionGroups[type].push(log);
    }
  }

  return conventionGroups;
}

function writeContent(tag, date, groups) {
  const formattedDate = date.split('T')[0];

  let content = `
---
### [${tag}] - ${formattedDate}
---
`;

  for (const [title, items] of Object.entries(groups)) {
    if (!items || items.length === 0) continue;

    content += `\n### ${title.toUpperCase()}\n`;
    content += items.map((item) => `- ${item.split(':')[1]}`).join('\n');
    content += '\n';
  }

  return content;
}

writeChangelog().catch((err) => {
  throw err;
});
