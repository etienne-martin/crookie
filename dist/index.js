"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const figlet = require("figlet");
const binance_js_1 = require("./exchanges/binance.js");
binance_js_1.default.init();
figlet('Crookie', (_, data) => {
    console.log(data);
    console.log(' -----------------------------------');
    console.log('   Monitoring new cryptocurrencies  ');
    console.log(' -----------------------------------');
});
//# sourceMappingURL=index.js.map