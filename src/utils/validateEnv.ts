import { REQUIRED_ENVS } from '../consts';
import logger from './logger';

function validateEnvs() {
  const missingEnvs = [];

  for (const env of REQUIRED_ENVS) {
    if (!process.env[env]) {
      missingEnvs.push(env);
    }
  }
  if (missingEnvs.length > 0) {
    logger.error(`missing envs: ` + missingEnvs.join(','));
    throw new Error(`missing envs: ${missingEnvs.join(',')}`);
  }
}

export default validateEnvs;
