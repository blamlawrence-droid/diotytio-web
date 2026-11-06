import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseDepositAmount, isValidDepositAmount } from '../src/depositAmount.js';

test('formatted deposits retain their full amount at confirmation', () => {
  for (const amount of [3000, 7000, 15000, 25000, 45000, 75000, 1000000]) {
    for (const separator of [' ', '\u00a0', '\u202f']) {
      const formatted = amount.toLocaleString('fr-FR').replace(/\s/g, separator);
      assert.equal(parseDepositAmount(formatted), amount);
      assert.equal(isValidDepositAmount(parseDepositAmount(formatted)), true);
    }
    assert.equal(parseDepositAmount(String(amount)), amount);
  }
});

test('invalid or out-of-range amounts cannot reach final confirmation', () => {
  for (const input of ['', ' ', 'NaN', 'abc3000', '3000.5', '-3000', '2999', '1000001']) {
    assert.equal(isValidDepositAmount(parseDepositAmount(input)), false);
  }
  for (const input of [undefined, null, NaN, Infinity, 3, 3000.5, '3000']) {
    assert.equal(isValidDepositAmount(input), false);
  }
});
