const env = process.env.NODE_ENV || 'development';
const isProduction = env.toLowerCase() === 'production';
const isDev = env.toLowerCase() === 'development';
const isTest = env.toLowerCase() === 'test';
const site = isProduction
  ? 'https://gassess.lenconda.top'
  : 'http://localhost:5000';
const api = isProduction
  ? 'https://ga_api.lenconda.top'
  : 'http://localhost:3001';

const config = {
  env: env,
  isProduction,
  isDev,
  isTest,
  api,
  site,
  productName: 'Gassess',
};

export default config;
