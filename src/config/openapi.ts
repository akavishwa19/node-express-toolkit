import swaggerUi from 'swagger-ui-express';
import express from 'express';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

const router = express.Router();

const cwd = process.cwd();
const openApiPath = path.join(cwd, '/docs/openapi.yaml');
const doc = yaml.load(
  fs.readFileSync(openApiPath, 'utf8')
) as swaggerUi.JsonObject;

router.use('/', swaggerUi.serve, swaggerUi.setup(doc));

export default router;
