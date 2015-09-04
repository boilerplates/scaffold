/*!
 * scaffold <https://github.com/jonschlinkert/scaffold>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var Base = require('base-methods');
var toPath = require('to-object-path');
var Target = require('expand-target');
var merge = require('mixin-deep');

/**
 * Create an instance of Scaffold with the
 * given `options`
 *
 * ```js
 * var scaffold = new Scaffold();
 * ```
 * @param {Object} `options`
 * @api public
 */

function Scaffold(options) {
  if (!(this instanceof Scaffold)) {
    return new Scaffold(options);
  }
  Base.call(this);
  this.options = options || {};
  this.targets = {};
}
Base.extend(Scaffold);

/**
 * Register a scaffold "target" with the given `name`. A
 * target is a semantically-grouped configuration of
 * files and directories.
 *
 * ```js
 * scaffold.register('webapp', ...);
 * ```
 *
 * @param  {String} `name` The name of the config target.
 * @param  {Object} `config`
 * @return {Object}
 * @api public
 */

Scaffold.prototype.register = function(name, config, options) {
  this.targets[name] = new Target(name, this.defaults(config, options));
  return this;
};

/**
 * Set or get an option to be used as a default value
 * when registering scaffold targets. Pass a key-value
 * pair or an object to set a value, or the key of
 * the value to get.
 *
 * ```js
 * scaffold.option('cwd', 'templates/');
 * ``
 * @param {String|Object|Array} `key`
 * @param {any} `value`
 * @return {Object} Returns the instance of `Scaffold` for chaining
 * @api public
 */

Scaffold.prototype.option = function(key, value) {
  if (typeof key === 'string') {
    key = toPath('options', key);
    if (arguments.length === 1) {
      return this.get(key, value);
    }
  } else {
    this.visit('option', key);
    return this;
  }
  this.set(key, value);
  return this;
};

/**
 * Set default values on targets.
 */

Scaffold.prototype.init = function(config, options) {
  if (typeof config === 'string' || Array.isArray(config)) {
    config = { src: config };
  }
  if (typeof options === 'object') {
    config.options = options;
  }
  config.options = merge({expand: true}, this.options, config.options);
  return config;
};

/**
 * Expose `Scaffold`
 */

module.exports = Scaffold;
