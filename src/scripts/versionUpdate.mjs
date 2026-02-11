import path from 'path';
import fs from 'fs';

const appRoot = process.cwd();
const packageJsonPath = path.resolve(appRoot, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

const NAME = packageJson.name;
const VERSION = packageJson.version;

const content = `export const NAME = '${NAME}';
export const VERSION = '${VERSION}';`;

const versionPath = path.resolve(appRoot, 'src', 'version.ts');
fs.writeFileSync(versionPath, content);
