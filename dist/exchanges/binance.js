"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const get = require("lodash/get");
const includes = require("lodash/includes");
const isEmpty = require("lodash/isEmpty");
const helpers_1 = require("../helpers");
const API_URL = 'https://api.binance.com/api/v1/ticker/allPrices';
const EXCHANGE = 'Binance';
const INTERVAL = 10000;
function handleData(newData, latestData) {
    const diffs = helpers_1.compareArrays(latestData, newData, 'symbol');
    const mergedDiffs = [];
    if (!get(newData, '[0].symbol'))
        throw new Error(`An error occurred while fetching data from ${EXCHANGE}.`);
    // Skip if nothing changed
    if (isEmpty(diffs))
        return;
    // Remove duplicates from the diff.
    for (let diff of diffs) {
        diff = diff.replace(new RegExp('BTC' + '$'), '');
        diff = diff.replace(new RegExp('ETH' + '$'), '');
        diff = diff.replace(new RegExp('BNB' + '$'), '');
        if (!includes(mergedDiffs, diff))
            mergedDiffs.push(diff);
    }
    return mergedDiffs;
}
// Send the slack notification
function sendResponse(diffs) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (isEmpty(diffs)) {
            console.log(`Nothing changed on ${EXCHANGE}.`);
            return;
        }
        const message = helpers_1.constructMessage(diffs, EXCHANGE, (currency) => {
            return 'https://www.binance.com/tradeDetail.html?symbol=' + currency + '_BTC';
        });
        yield helpers_1.sendSlackMessage(message);
        console.log(`Slack notification sent successfully for ${EXCHANGE}:`, diffs);
    });
}
function fetchData(latestData) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const data = yield helpers_1.fetchJSON(API_URL);
        if (!latestData)
            return latestData = data;
        const diffs = handleData(data, latestData);
        yield sendResponse(diffs);
        return data;
    });
}
function init() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            let latestData = yield fetchData(null);
            setInterval(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                latestData = yield fetchData(latestData);
            }), INTERVAL);
        }
        catch (err) {
            console.error(err);
        }
    });
}
exports.default = {
    init
};
//# sourceMappingURL=binance.js.map