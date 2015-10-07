'use strict';

var utils = require('../utils');

var props = [
  'name',
  'description',
  'version',
  'homepage',
  'repository',
  'author',
  'license',
];

module.exports = function (app) {
  app.mixin('init', function (defaults) {
    if (this.initialized) {
      return this;
    }
    defaults = defaults || utils.pick(utils.pkg, props);

    var scaffolds = app.Scaffolds();
    scaffolds.load(defaults);

    this.define('scaffolds', scaffolds);
    this.define('initialized', true);
  });
};
