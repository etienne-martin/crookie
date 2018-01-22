import * as dotenv from 'dotenv';
import * as get from 'lodash/get';
import * as isEmpty from 'lodash/isEmpty';

const config: any = {};

setConfig();

if (isEmpty(config.webhookUrl)) {
  dotenv.config();
  setConfig();
}

if (isEmpty(config.webhookUrl)) {
  console.error('Your slack webhook url could not be found in config.js');
  process.exit();
}

function setConfig() {
  config.webhookUrl = process.env.SLACK_WEBHOOK_URL;
}

function getConfig(key?: string): string | any {
  if (key) return get(config, key);
  return config;
}

export default {
  get: getConfig
};
