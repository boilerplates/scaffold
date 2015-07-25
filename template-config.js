'use strict';

var path = require('path');
var extend = require('extend-shallow');

/**
 * This will be published as a lib
 */

module.exports = function (app) {
  return function templateConfig(config) {
    config = config || {};

    var options = extend({}, config, config.options);
    delete options.templates;

    var cwd = config.base || 'templates' || process.cwd();
    var templates = config.templates || {};

    for (var key in templates) {
      if (templates.hasOwnProperty(key)) {
        var settings = templates[key];
        var opts = extend({}, options, settings.options);

        opts.cwd = opts.cwd || settings.base || key;
        opts.cwd = path.resolve(cwd, opts.cwd);
        app.create(key, opts);
        app[key](settings.patterns, opts);
      }
    }
  };
};
