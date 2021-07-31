#!/usr/bin/env node
/* eslint-disable no-unused-expressions */
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { parse, stringify } = require('..');

yargs(hideBin(process.argv))
  .command('parse [roman]', 'parse roman numeral to number', (yrg) => yrg
    .positional('roman', {
      describe: 'roman numeral',
    }), (argv) => {
    try {
      console.log(parse(argv.roman));
    } catch (error) {
      console.log(error.message);
    }
  })
  .command('stringify [number]', 'transform number to roman numeral', (yrg) => yrg
    .positional('number', {
      describe: 'number to transform',
    }), (argv) => {
    try {
      if (argv.number.match(/\d/)) console.log(stringify(parseInt(argv.number, 10)));
      else console.log(stringify(argv.number));
    } catch (error) {
      console.log(error.message);
    }
  })
  .argv;
