/*!
 * scaffold <https://github.com/jonschlinkert/scaffold>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var Target = require('expand-target');
var merge = require('mixin-deep');

/**
 * Create a new Scaffold with the given `name` and `config`.
 *
 * ```js
 * var component = new Scaffold('component', {
 *   src: ['~/templates/*.js']
 * });
 * ```
 * @param {String} `name` The name of the scaffold.
 * @param {Object} `config` The scaffold's configuration object.
 * @api public
 */

function Scaffold(config, options) {
  if (!(this instanceof Scaffold)) {
    return new Scaffold(config, options);
  }

  config = this.init(config, options);

  var scaffold = new Target('scaffold', config);
  for (var key in scaffold) {
    if (scaffold.hasOwnProperty(key) && key !== 'name') {
      this[key] = scaffold[key];
    }
  }
}

/**
 * Set default values on targets.
 */

Scaffold.prototype.init = function(config, options) {
  if (typeof config === 'undefined') {
    throw new TypeError('expected config to be an object.');
  }
  if (typeof config === 'string' || Array.isArray(config)) {
    config = { src: config };
  }
  if (typeof options === 'object') {
    config.options = merge({}, options, config.options);
  }
  if (!hasAny(config, ['src', 'dest', 'files'])) {
    throw new Error('scaffolds should have a src, dest or files property.');
  }
  return config;
};

/**
 * Return `true` if an object has any of the given keys.
 *
 * @param {Object} `obj`
 * @param {Array} `keys`
 * @return {Boolean}
 */

function hasAny(obj, keys) {
  for (var key in obj) {
    if (keys.indexOf(key) > -1) return true;
  }
  return false;
}

/**
 * Expose `Scaffold`
 */

module.exports = Scaffold;
