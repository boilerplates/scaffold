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
    var cmds = ['add', 'remove', 'list'];
    // add
    // remove
    // list
    if (!config.args || !config.args.length) {
      subcommandWarning(cmds);
      return commands.emit('end');
    }
    var subcommand = config.args.shift();
    if (cmds.indexOf(subcommand) === -1) {
      subcommandWarning(cmds);
      return commands.emit('end');
    }

    load(app);
    if (subcommand === 'list') {
      var count = 0;
      utils.reduce(app.scaffolds.get('targets'), function (acc, target, key) {
        console.log(utils.gray(key));
        count++;
      }, []);
      if (count === 0) {
        console.log('No targets found.');
      }
      return commands.emit('end');
    }

    if (!config.args.length) {
      console.log(utils.red('Warning:'), utils.gray('target ' + subcommand), 'expects a `name`.');
      return commands.emit('end');
    }

    var name = config.args.shift();

    if (subcommand === 'remove') {
      if (typeof app.scaffolds.cache.targets[name] === 'undefined') {
        console.log(utils.gray(name), 'not found in', utils.gray('manifest.json'));
        return commands.emit('end');
      }

      delete app.scaffolds.cache.targets[name];
      return save(app, function (err) {
        if (err) return commands.emit('error', err);
        console.log(utils.gray(name), 'removed from', utils.gray('manifest.json'));
        commands.emit('end');
      })();
    }

    var target = {};
    target.src = config.files || config.f || config.src || config.args.shift();
    target.dest = config.dest || config.d || config.args.shift() || ''
    target.cwd = config.cwd || ''
    target.expand = config.expand || config.x || false;
    target.flatten = config.flatten || false;

    if (target.cwd && target.cwd.length === 1 && target.cwd === '.') {
      target.cwd = process.cwd();
    }

    app.scaffolds.addTarget(name, target);
    save(app, function (err) {
      if (err) return commands.emit('error', err);
      console.log(utils.gray(name), 'added to', utils.gray('manifest.json'));
      commands.emit('end');
    })();
  },

  add: function (config, app) {
    config.args.unshift('add');
    return commands.target(config, app);
  },

  remove: function (config, app) {
    config.args.unshift('remove');
    return commands.target(config, app);
  }
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

function subcommandWarning (cmds) {
  function wrap (cmd, i) {
    var str = utils.gray('`' + cmd + '`');
    if (i === 0) str += ',';
    if (i === cmds.length - 1) str = 'or ' + str;
    return str;
  }
  console.log(utils.red('Warning:'), 'expected a subcommand like', cmds.map(wrap).join(' '));
}

function tryRequire() {
  try {
    return require(path.join(process.cwd(), 'manifest.json'));
  } catch (err) {
    return null;
  }
}

module.exports = Emitter(commands);
