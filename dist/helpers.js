"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const get = require("lodash/get");
const isEmpty = require("lodash/isEmpty");
const rp = require("request-promise");
const config_1 = require("./config");
if (isEmpty(config_1.default.webhookUrl)) {
    console.error('Your slack webhook url could not be found in config.js');
    process.exit();
}
function fetchJSON(uri) {
    const options = { uri, json: true };
    return rp(options);
}
exports.fetchJSON = fetchJSON;
function compareArrays(arr1, arr2, key) {
    const diff = [];
    for (const index in arr2) {
        const value1 = get(arr1[index], key);
        const value2 = get(arr2[index], key);
        if (value1 !== value2 && value2)
            diff.push(value2);
    }
    return removeDuplicatesFromArray(diff);
}
exports.compareArrays = compareArrays;
function compareObject(obj1, obj2) {
    const diff = [];
    for (const property in obj2) {
        if (obj1.hasOwnProperty(property) === false) {
            diff.push(property);
        }
    }
    return removeDuplicatesFromArray(diff);
}
exports.compareObject = compareObject;
function sendSlackMessage(message) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const options = {
            method: 'POST',
            uri: config_1.default.webhookUrl,
            body: { text: message },
            json: true
        };
        try {
            const response = yield rp(options);
            return response === 'ok';
        }
        catch (err) {
            console.error(err);
        }
    });
}
exports.sendSlackMessage = sendSlackMessage;
function randomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
}
exports.randomItem = randomItem;
function removeDuplicatesFromArray(array) {
    return array.filter((item, pos) => {
        return array.indexOf(item) === pos;
    });
}
exports.removeDuplicatesFromArray = removeDuplicatesFromArray;
function constructMessage(diffs, exchange, urlConstructor) {
    const messages = [];
    const exclamations = [
        'Yay!',
        'Yeah!',
        'Hurrah!',
        'Wee!',
        'Whoa!',
        'Yee-haw!',
        'Woot woot!'
    ];
    // Add the title
    if (diffs.length === 1) {
        messages.push('>*' + randomItem(exclamations) + ' There\'s a new crypto recruit on ' + exchange + '*');
    }
    else {
        messages.push('>*' + randomItem(exclamations) + ' There are new crypto recruits on ' + exchange + '*');
    }
    // Add a line for each new currencies
    for (const diff of diffs) {
        messages.push('>`' + diff.toUpperCase() + '`: ' + urlConstructor(diff));
    }
    return messages.join('\n');
}
exports.constructMessage = constructMessage;
//# sourceMappingURL=helpers.js.map