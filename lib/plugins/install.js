'use strict';

var utils = require('../utils');

module.exports = function (app) {
  app.mixin('install', function (dependency, cb) {
    if (typeof dependency === 'function') {
      cb = dependency;
      dependency = null;
    }
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
      app.scaffolds.addDependency(scaffolds.get('name'), dependency);
      cb(null, scaffolds);
    });
  });
};
