/* eslint-disable no-nested-ternary */
const parse = (str) => {
  if (typeof str !== 'string') throw new Error('Not a string');
  if (str.match(/[^IVXLCDM]/)) throw new Error('Unknown roman numeral');
  const repeated5 = str.match(/[VLD]{2,}/);
  if (repeated5) {
    const message = repeated5[0].includes('V') ? 'V (5)'
      : repeated5[0].includes('L') ? 'L (50)' : 'D (500)';

    throw new Error(`Invalid repetition of number starting with 5: ${message}`);
  }

  const repeated1 = str.match(/(?:I){4,}|(?:X){4,}|(?:C){4,}|(?:M){4,}/);
  if (repeated1) {
    const message = repeated1[0].includes('I') ? 'I'
      : repeated1[0].includes('X') ? 'X'
        : repeated1[0].includes('C') ? 'C' : 'M';

    throw new Error(`Too many repetitions of roman numeral ${message}`);
  }

  const invalidSub = str.match(/(?:VX)|(?:LC)|(?:DM)/);
  if (invalidSub) {
    const message = invalidSub[0].includes('V') ? 'V'
      : invalidSub[0].includes('L') ? 'L' : 'D';
    throw new Error(`Invalid substraction prefix ${message}`);
  }

  const regexFilter = /^(M{0,3})(C(?:D|M)|D?C{0,3})(X(?:L|C)|L?X{0,3})(I(?:V|X)|V?I{0,3})$/s;

  const filteredRomans = regexFilter.exec(str);
  if (!filteredRomans) throw new Error('Invalid order');

  const thousands = filteredRomans[1] ? 1000 * filteredRomans[1].length : 0;
  const hundreds = filteredRomans[2].split('').reduce((acc, el) => {
    switch (el) {
      case 'C':
        return acc + 1;
      case 'D':
        return acc > 0 && acc < 5
          ? 5 - acc : acc + 5;
      case 'M':
        return 10 - acc;
      default:
        return 0;
    }
  }, 0) * 100;
  const tens = filteredRomans[3].split('').reduce((acc, el) => {
    switch (el) {
      case 'X':
        return acc + 1;
      case 'L':
        return acc > 0 && acc < 5
          ? 5 - acc : acc + 5;
      case 'C':
        return 10 - acc;
      default:
        return 0;
    }
  }, 0) * 10;
  const units = filteredRomans[4].split('').reduce((acc, el) => {
    switch (el) {
      case 'I':
        return acc + 1;
      case 'V':
        return acc > 0 && acc < 5
          ? 5 - acc : acc + 5;
      case 'X':
        return 10 - acc;
      default:
        return 0;
    }
  }, 0);
  return thousands + hundreds + tens + units;
};

const stringify = (num) => {
  if (typeof num !== 'number') throw new Error('Not a number');
  if (num > 3999 || num <= 0) throw new Error('out of range');
  const thousands = 'M'.repeat(parseInt(num / 1000, 10));

  const preHundreds = parseInt((num % 1000) / 100, 10);
  let hundreds;

  if (preHundreds === 9) {
    hundreds = 'CM';
  } else if (preHundreds >= 5) {
    const C = preHundreds % 5;
    hundreds = `D${'C'.repeat(C)}`;
  } else if (preHundreds > 3) {
    const C = preHundreds % 3;
    hundreds = `${'C'.repeat(C)}D`;
  } else {
    hundreds = `${'C'.repeat(preHundreds)}`;
  }
  const preTens = parseInt((num % 100) / 10, 10);
  let tens;
  if (preTens === 9) {
    tens = 'XC';
  } else if (preTens >= 5) {
    const X = preTens % 5;
    tens = `L${'X'.repeat(X)}`;
  } else if (preTens > 3) {
    const X = preTens % 3;
    tens = `${'X'.repeat(X)}L`;
  } else {
    tens = `${'X'.repeat(preTens)}`;
  }
  const preUnits = parseInt(num % 10, 10);
  let units;
  if (preUnits === 9) {
    units = 'IX';
  } else if (preUnits >= 5) {
    const I = preUnits % 5;
    units = `V${'I'.repeat(I)}`;
  } else if (preUnits > 3) {
    const I = preUnits % 3;
    units = `${'I'.repeat(I)}V`;
  } else {
    units = `${'I'.repeat(preUnits)}`;
  }
  return thousands + hundreds + tens + units;
};

module.exports = {
  parse,
  stringify,
};
