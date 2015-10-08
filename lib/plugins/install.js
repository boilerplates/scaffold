'use strict';

var utils = require('../utils');

module.exports = function (app) {
  app.mixin('install', function (dependency, options, cb) {
    if (typeof dependency === 'function') {
      cb = dependency;
      options = {};
      dependency = null;
    }
    if (typeof options === 'function') {
      cb = options;
      options = {};
    }
    options = options || {};
    app.init();

    if (!dependency) {
      return app.resolve(app.scaffolds.get('dependencies'), cb);
    }

    app.resolve(dependency, function (err, scaffolds) {
      if (err) return cb(err);
      if (!scaffolds) {
        app.log(utils.red('Warning:'), 'Cannot install', utils.gray(dependency));
        return cb();
      }
      if (options.save === true) {
        app.scaffolds.addDependency(scaffolds.get('name'), dependency);
      }
      cb(null, scaffolds);
    });
  });
};
