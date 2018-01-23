import isNull from 'lodash/isNull';
import * as redis from 'redis';
import config from './config';
import binance from './exchanges/binance';

// @ts-ignore
exports.handler = async (event, context, callback) => {
  const redisOptions: redis.ClientOpts = {
    host: config.get('redisUrl'),
    port: 6379
  };

  const client: redis.RedisClient = redis.createClient(redisOptions);

  client.on('error', console.error);

  client.get('binance', async (err, res) => {
    if (err) return callback(null, err.message);
    const latestData = isNull(res) ? null : JSON.parse(res);
    const data: any = await binance.fetchData(latestData);
    client.set('binance', JSON.stringify(data), () => {
      client.quit();
      callback(null, 'Binance runned successfully');
    });
  });

  // response.statusCode = 200;
  // response.body = { charge, chargeObject, err };
  // context.succeed(response);
};
