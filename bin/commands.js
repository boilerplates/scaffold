'use strict';

var Emitter = require('component-emitter');
var writeFile = require('write');
var path = require('path');

var utils = require('../lib/utils');
var App = require('../');
var app = new App();

function save (cb) {
  return function (err) {
    if (err) return cb(err);
    writeFile('manifest.json', JSON.stringify(app.scaffolds, null, 2), cb);
  };
}

function load () {
  var scaffolds = app.Scaffolds();
  scaffolds.load(require(path.join(process.cwd(), 'manifest.json')));
  app.init(scaffolds.toJSON());
}

var commands = {
  init: function (config) {
    app.init();
    save(function (err) {
      if (err) return commands.emit('error', err);
      commands.emit('end', 'init');
    })();
  },

  install: function (config) {
    config = config || {};
    load();

    if (config.args && config.args.length) {
      return utils.async.each(config.args, function (dep, next) {
        app.install(dep, next);
      }, save(function (err) {
        if (err) return commands.emit('error', err);
        commands.emit('end', 'install');
      }));
    }

    app.install(save(function (err) {
      if (err) return commands.emit('error', err);
      commands.emit('end', 'install');
    }));
  },

  update: function (config) {
    console.log('update', config);
    commands.emit('end', 'update');
  },

  uninstall: function (config) {
    console.log('uninstall', config);
    commands.emit('end', 'uninstall');
  },

  list: function (config) {
    console.log('list', config);
    commands.emit('end', 'list');
  },

  target: function (config) {
    console.log('target', config);
    commands.emit('end', 'target');
  },
};

module.exports = Emitter(commands);
