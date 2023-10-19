import {Request, Response} from 'express';
import dotenv from 'dotenv';

dotenv.config();

const envs = ['MONGO_URI', 'PORT', 'JWT_SECRET'] as const;
const missingEnvs: string[] = [];

export const envValues = envs.reduce<Record<(typeof envs)[number], string>>(
  (acc, env) => {
    const processEnv = process.env[env];

    if (processEnv !== undefined) {
      acc[env] = processEnv;
    } else {
      missingEnvs.push(env);
    }

    return acc;
  },
  {} as never
);

if (missingEnvs.length > 0) {
  throw new Error(`Missing environment variables: ${missingEnvs.join(', ')}`);
}

export const checkRequestBodyKeys = (
  body: Request['body'],
  requiredKeys: string[]
) => {
  const missingKeys = requiredKeys.filter(key => !(key in body));
  return missingKeys;
};

export const missingKeysError = (res: Response, keys: string[]) => {
  return res.status(400).json({
    message: `Request body is missing the following field${
      keys.length > 1 ? 's' : ''
    }: ${keys.map(key => `'${key}'`).join(', ')}`,
  });
};

export const serverError = (res: Response, error?: unknown) => {
  if (error) {
    console.error(error);
  }
  return res.status(500).json({message: 'Server error'});
};
