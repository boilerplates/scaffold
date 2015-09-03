/*!
 * scaffold <https://github.com/jonschlinkert/scaffold>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var util = require('util');
var forIn = require('for-in');
var define = require('define-property');
var toPath = require('to-object-path');
var delegate = require('delegate-properties');
var Task = require('expand-task');
var Base = require('base-methods');
var utils = require('./lib/utils');

/**
 * Create an instance of `Scaffold` with the given `options`.
 *
 * @param {Object} `options`
 * @api public
 */

function Scaffold(options) {
  if (!(this instanceof Scaffold)) {
    return new Scaffold(options);
  }
  Base.call(this);
  this.config = {};
}
Base.extend(Scaffold);

/**
 * Prototype methods
 */

delegate(Scaffold.prototype, {
  constructor: Scaffold,

  /**
   * Register a scaffold with the given `name` and optional `config`
   * object.
   *
   * ```js
   * scaffold.register('webapp', ...);
   * ```
   *
   * @param  {String} `name`
   * @param  {Object} `config`
   * @return {Object}
   * @api public
   */

  register: function (name, scaffold) {
    var config = this.expand(name, scaffold);

    forIn(config.targets, function (val, key) {
      this.config[key] = val;
    }, this);

    return this;
  },

  expand: function (key, scaffold) {
    if (typeof key === 'object') {
      return new Task(this.setDefaults(key));
    }
    var config = {};
    config[key] = this.setDefaults(scaffold);
    return this.expand(config);
  },

  generate: function (name, data) {
    generate(name, data);
    return this;
  },

  setDefaults: function (scaffold) {
    scaffold.options = merge({expand: true}, scaffold.options);
    return scaffold;
  },

  option: function (key, value) {
    this.set(toPath('options', key), value);
    return this;
  },

  setItem: function (key, value) {
    this.set(toPath('config', key), value);
    return this;
  }
});

/**
 * Expose `Scaffold`.
 */

module.exports = Scaffold;
