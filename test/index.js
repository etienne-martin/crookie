import * as assert from 'assert';
import get from 'lodash/get';
import lambda from '../dist/lambda';

describe('Retrieving exchanges data', () => {
  let data;

  before((done) => {
    lambda((err, res) => {
      data = res;
      done();
    });
  });

  describe('Binance', () => {
    it('should return data', () => {
      assert.notEqual(get(data, 'binance', []).length, 0);
    })
  });
});

// test each directory with modifications
// test normal run each directories data length
