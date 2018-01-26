import * as isEmpty from 'lodash/isEmpty';
import * as map from 'lodash/map';
import * as reduce from 'lodash/reduce';
import * as redis from 'redis';
import config from './config';
import binance from './exchanges/binance';

interface ITarget {
  name: string;
  fetch: (latestData: any[]) => Promise<any[]>;
}

interface IData {
  name: string;
  data: any[];
}

const KEY: string = 'exchanges';
const targets: ITarget[] = [
  { name: 'binance', fetch: binance.fetchData }
];

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
    client.get(KEY, (err, res) => {
      if (err) reject(err);
      const data: any = isEmpty(res) ? null : JSON.parse(res);
      resolve(data);
    });
  });
}

async function getData(latestData: any): Promise<any> {
  // TODO: Add a setTimeout to cancel a request if any exchanges isn't responding
  // So we can get results from other responding exchanges and only skip the exchanges that are unresponsive
  // TODO: Handle exchange fetch errors
  const promises: Array<Promise<IData>> = map(targets, async (target: ITarget) => {
    const data: any[] = await target.fetch(latestData[target.name]);
    return {
      name: target.name,
      data
    };
  });

  const exchangesData: IData[] = await Promise.all(promises);
  return reduce(exchangesData, (res, item) => {
    res[item.name] = item.data;
    return res;
  }, {});
}

function saveData(client: redis.RedisClient, key: string, data: any): Promise<void> {
  return new Promise((resolve, reject) => {
    client.set(key, JSON.stringify(data), (err) => {
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
    await saveData(client, KEY, data);

    client.quit();
    callback(null, 'Done.');
  } catch (err) {
    callback(null, err.message);
    if (client) client.quit();
  }
};
