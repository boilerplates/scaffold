#!/usr/bin/env node

/**
 * Ensure the cli is executed with node generators for
 * versions of node < 4.0.0.
 *
 * Inspired by duo.js
 * https://github.com/duojs/duo/blob/master/bin/duo
 */

var spawn = require('spawn-commands');
var path = require('path');
var args = process.argv.slice(2);

args.unshift(path.resolve(__dirname, '_cli.js'));

if (!require('has-generators')) {
  args.unshift('--harmony-generators');
}

spawn({cmd: process.execPath, args: args}, function (err) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  process.exit(0);
});
