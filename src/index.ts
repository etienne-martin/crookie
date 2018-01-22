import * as figlet from 'figlet';
import binance from './exchanges/binance';

binance.init();

figlet('Crookie', (_, data) => {
  console.log(data);
  console.log(' -----------------------------------');
  console.log('   Monitoring new cryptocurrencies  ');
  console.log(' -----------------------------------');
});
