/*!
 * scaffold <https://github.com/jonschlinkert/scaffold>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var utils = require('./utils');
var util = require('expand-utils');
var use = require('use');

/**
 * Create a new Scaffold with the given `options`
 *
 * ```js
 * var scaffold = new Scaffold({cwd: 'src'});
 * scaffold.addTargets({
 *   site: {src: ['*.hbs']},
 *   blog: {src: ['*.md']}
 * });
 * ```
 * @param {Object} `options`
 * @api public
 */

function Scaffold(options) {
  if (!(this instanceof Scaffold)) {
    return new Scaffold(options);
  }

  util.is(this, 'scaffold');
  use(this);

  this.options = options || {};
  if (utils.isScaffold(options) || util.isTask(options)) {
    this.options = {};
    this.addTargets(options);
    return this;
  }
}

/**
 * Add targets to the scaffold, while also normalizing src-dest mappings and
 * expanding glob patterns in each target.
 *
 * ```js
 * scaffold.addTargets({
 *   site: {src: '*.hbs', dest: 'templates/'},
 *   docs: {src: '*.md', dest: 'content/'}
 * });
 * ```
 * @param {Object} `scaffold` Scaffold object with targets, `options`, or arbitrary properties.
 * @return {Object}
 * @api public
 */

Scaffold.prototype.addTargets = function(scaffold) {
  for (var key in scaffold) {
    if (scaffold.hasOwnProperty(key)) {
      var val = scaffold[key];
      if (util.isTarget(val)) {
        this.addTarget(key, val);
      } else {
        this[key] = val;
      }
    }
  }
};

/**
 * Add a single target to the scaffold, while also normalizing src-dest mappings and
 * expanding glob patterns in the target.
 *
 * ```js
 * scaffold.addTarget('foo', {
 *   src: '*.hbs',
 *   dest: 'templates/'
 * });
 * ```
 * @param {String} `name`
 * @param {Object} `config`
 * @return {Object}
 * @api public
 */

Scaffold.prototype.addTarget = function(name, config) {
  if (typeof name !== 'string') {
    throw new TypeError('expected name to be a string');
  }

  var target = new utils.Target(this.options);
  utils.define(target, '_name', name);

  util.run(this, 'target', target);
  target.addFiles(config);
  target.options = config.options;

  this[name] = target;
  return target;
};

/**
 * Expose `Scaffold`
 */

module.exports = Scaffold;
