/*!
 * scaffold <https://github.com/jonschlinkert/scaffold>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var use = require('use');
var util = require('expand-utils');
var utils = require('./utils');

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
  if (Scaffold.isScaffold(options)) {
    this.options = {};
    this.addTargets(options);
    return this;
  }
}

/**
 * Static method, returns `true` if the given value is an
 * instance of `Scaffold` or appears to be a valid `scaffold`
 * configuration object.
 *
 * ```js
 * Scaffold.isScaffold({});
 * //=> false
 *
 * var blog = new Scaffold({
 *   post: {
 *     src: 'content/post.md',
 *     dest: 'src/posts/'
 *   }
 * });
 * Scaffold.isScaffold(blog);
 * //=> true
 * ```
 * @static
 * @param {Object} `val` The value to check
 * @return {Boolean}
 * @api public
 */

Scaffold.isScaffold = function(val) {
  return util.isTask(val) || utils.isScaffold(val);
};

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
  util.run(this, 'scaffold', scaffold);
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
  return this;
};

/**
 * Add a single target to the scaffold, while also normalizing src-dest mappings and
 * expanding glob patterns in the target.
 *
 * ```js
 * scaffold.addTarget('foo', {
 *   src: 'templates/*.hbs',
 *   dest: 'site'
 * });
 *
 * // other configurations are possible
 * scaffold.addTarget('foo', {
 *   options: {cwd: 'templates'}
 *   files: [
 *     {src: '*.hbs', dest: 'site'},
 *     {src: '*.md', dest: 'site'}
 *   ]
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
  target.options = utils.extend({}, config.options, target.options);

  this[name] = target;
  return target;
};

/**
 * Expose `Scaffold`
 */

module.exports = Scaffold;
