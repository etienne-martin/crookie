import * as isEmpty from 'lodash/isEmpty';
import * as redis from 'redis';
import config from './config';
import binance from './exchanges/binance';
import { compareArrays } from './helpers';

function createRedisClient(): redis.RedisClient {
  const redisOptions: redis.ClientOpts = {
    host: config.get('redisUrl'),
    port: 6379,
    connect_timeout: 1000
  };

  return redis.createClient(redisOptions);
}

async function getLatestData(client: redis.RedisClient): Promise<any> {
  return new Promise((resolve, reject) => {
    client.get('binance', (err, res) => {
      if (err) reject(err);
      const data = isEmpty(res) ? null : JSON.parse(res);
      resolve(data);
    });
  });
}

function getData(latestData: any): Promise<any> {
  return binance.fetchData(latestData);
}

function saveData(client: redis.RedisClient, data: any): Promise<void> {
  return new Promise((resolve, reject) => {
    client.set('binance', JSON.stringify(data), (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// @ts-ignore
exports.handler = async (event, context, callback) => {
  let client: redis.RedisClient;

  try {
    client = createRedisClient();

    client.on('error', (err) => {
      callback(null, 'Redis client error: ' + err.message);
      client.quit();
    });

    const latestData: any = await getLatestData(client);
    const data: any = await getData(latestData);
    const diff: string[] = compareArrays(latestData, data, 'symbol');
    let outputMessage = 'No changes';

    if (!isEmpty(diff)) {
      await saveData(client, data);
      outputMessage = 'new crypto on binance: ' + JSON.stringify(diff);
    }

    client.quit();
    callback(null, outputMessage);
  } catch (err) {
    callback(null, err.message);
    if (client) client.quit();
  }
};
