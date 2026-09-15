import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  publicSiteUrl: (process.env.PUBLIC_SITE_URL ?? 'https://ruouvanxuan.com').replace(
    /\/$/,
    '',
  ),
}));
