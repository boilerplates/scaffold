/*!
 * scaffold <https://github.com/jonschlinkert/scaffold>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var Base = require('base');
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

  Base.call(this);
  this.use(utils.plugins());
  this.is('Scaffold');

  Scaffold.emit('create', this);
  this.on('target', Scaffold.emit.bind(Scaffold, 'target'));
  this.on('files', Scaffold.emit.bind(Scaffold, 'files'));

  this.options = options || {};
  this.targets = {};

  if (Scaffold.isScaffold(options)) {
    this.options = {};
    this.addTargets(options);
    return this;
  }
}

/**
 * Inherit `Base`
 */

Base.extend(Scaffold);

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
 * @param {Object} `targets` Object of targets, `options`, or arbitrary properties.
 * @return {Object}
 * @api public
 */

Scaffold.prototype.addTargets = function(targets) {
  if (!utils.isObject(targets)) {
    throw new TypeError('expected an object');
  }

  for (var key in targets) {
    if (targets.hasOwnProperty(key)) {
      var val = targets[key];

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

  var Target = this.get('Target');
  var target = new Target(this.options);

  target.on('files', this.emit.bind(this, 'files'));
  utils.define(target, 'name', name);
  utils.define(target, 'key', name);

  target.options = utils.extend({}, config.options, target.options);
  this.emit('target', target);
  this.run(target);

  target.addFiles(config);
  this.targets[name] = target;
  return target;
};

/**
 * Get or set the `Target` constructor to use for creating new targets.
 */

Object.defineProperty(Scaffold.prototype, 'Target', {
  configurable: true,
  set: function(Target) {
    utils.define(this, '_Target', Target);
  },
  get: function() {
    return this._Target || this.options.Target || utils.Target;
  }
});

/**
 * Expose `Scaffold`
 */

module.exports = Scaffold;
