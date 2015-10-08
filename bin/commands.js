'use strict';

var Emitter = require('component-emitter');
var writeFile = require('write');
var path = require('path');

var utils = require('../lib/utils');

var commands = {
  help: function (config, app) {
    console.log('help:');
    console.log(' * init');
    console.log(' * install');
    console.log(' * update');
    console.log(' * uninstall');
    console.log(' * list');
    console.log(' * target');
    console.log('TODO: fill out these help messages');

    commands.emit('end');
  },

  init: function (config, app) {
    load(app);
    save(app, function (err) {
      if (err) return commands.emit('error', err);
      commands.emit('end', 'init');
    })();
  },

  install: function (config, app) {
    install(config, app, function (err) {
      if (err) return commands.emit('error', err);
      commands.emit('end', 'install');
    });
  },

  update: function (config, app) {
    install(config, app, function (err) {
      if (err) return commands.emit('error', err);
      commands.emit('end', 'update');
    });
  },

  uninstall: function (config, app) {
    console.log('uninstall', config);
    commands.emit('end', 'uninstall');
  },

  list: function (config, app) {
    load(app);
    var deps = utils.reduce(app.scaffolds.get('dependencies'), function (acc, dep) {
      acc.push(dep);
      return acc;
    }, []);

    utils.reduce(app.store.data, function (acc, dep, key) {
      var color = deps.indexOf(key) === -1 ? 'gray' : 'green';
      console.log(utils[color](key + ' ' + dep.version));
    }, []);
    commands.emit('end');
  },

  target: function (config, app) {
    console.log('target', config);
    commands.emit('end', 'target');
  },
};

function install (config, app, cb) {
  config = config || {};
  load(app);

  if (typeof config.save === 'string') {
    config.args.unshift(config.save);
    config.save = true;
  }

  if (config.args && config.args.length) {
    var opts = {};
    if (config.save === true) {
      opts.save = true;
    }
    return utils.async.each(config.args, function (dep, next) {
      app.install(dep, opts, next);
    }, save(app, cb));
  }
  app.install(save(app, cb));
}

function save (app, cb) {
  return function (err) {
    if (err) return cb(err);
    writeFile('manifest.json', JSON.stringify(app.scaffolds, null, 2), cb);
  };
}

function load (app) {
  var scaffolds = app.Scaffolds();
  var manifest = tryRequire();
  if (manifest) {
    scaffolds.load(manifest);
    app.init(scaffolds.toJSON());
  } else {
    app.init();
  }
}

function tryRequire() {
  try {
    return require(path.join(process.cwd(), 'manifest.json'));
  } catch (err) {
    return null;
  }
}

module.exports = Emitter(commands);
