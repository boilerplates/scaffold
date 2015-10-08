'use strict';

var Emitter = require('component-emitter');
var writeFile = require('write');
var path = require('path');

var utils = require('../lib/utils');

function save (app, cb) {
  return function (err) {
    if (err) return cb(err);
    writeFile('manifest.json', JSON.stringify(app.scaffolds, null, 2), cb);
  };
}

function load (app) {
  var scaffolds = app.Scaffolds();
  scaffolds.load(require(path.join(process.cwd(), 'manifest.json')));
  app.init(scaffolds.toJSON());
}

var commands = {
  init: function (config, app) {
    app.init();
    save(app, function (err) {
      if (err) return commands.emit('error', err);
      commands.emit('end', 'init');
    })();
  },

  install: function (config, app) {
    config = config || {};
    load(app);

    if (config.args && config.args.length) {
      var opts = {};
      if (config.save === true) {
        opts.save = true;
      }
      return utils.async.each(config.args, function (dep, next) {
        app.install(dep, opts, next);
      }, save(app, function (err) {
        if (err) return commands.emit('error', err);
        commands.emit('end', 'install');
      }));
    }

    app.install(save(app, function (err) {
      if (err) return commands.emit('error', err);
      commands.emit('end', 'install');
    }));
  },

  update: function (config, app) {
    console.log('update', config);
    commands.emit('end', 'update');
  },

  uninstall: function (config, app) {
    console.log('uninstall', config);
    commands.emit('end', 'uninstall');
  },

  list: function (config, app) {
    console.log('list', config);
    commands.emit('end', 'list');
  },

  target: function (config, app) {
    console.log('target', config);
    commands.emit('end', 'target');
  },
};

module.exports = Emitter(commands);
