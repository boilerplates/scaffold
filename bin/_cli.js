#!/usr/bin/env node

'use strict';

var minimist = require('minimist');
var args = minimist(process.argv.slice(2));

var MapConfig = require('map-config');
var commands = require('./commands');
var utils = require('../lib/utils');
var App = require('../');
var app = new App();


var config = {};
if (args._ && args._.length === 0) {
  config.help = utils.omit(args, '_');
} else {
  var cmd = args._.shift();
  config[cmd] = utils.omit(args, '_');
  config[cmd].args = args._;
}

commands.on('error', function (err) {
  console.log(utils.red('Error:'), err.message);
  process.exit(1);
});

commands.on('end', function (cmd) {
  if (cmd) {
    console.log(cmd, utils.gray('finished'));
  }
  process.exit(0);
});

var mapper = new MapConfig(commands, app);
mapper.process(config);
