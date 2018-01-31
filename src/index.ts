import * as figlet from 'figlet';
import binance from './exchanges/binance';
import kucoin from './exchanges/kucoin';
import gdax from './exchanges/gdax';

binance.init();
kucoin.init();
gdax.init();

figlet('Crookie', (_, data) => {
  console.log(data);
  console.log(' -----------------------------------');
  console.log('   Monitoring new cryptocurrencies  ');
  console.log(' -----------------------------------');
});
