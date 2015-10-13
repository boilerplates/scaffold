/*!
 * scaffolds <https://github.com/doowb/scaffolds>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var Base = require('base-methods').namespace('cache');
var plugin = require('base-plugins');
var option = require('base-options');

var Scaffold = require('./scaffold');

var utils = require('./utils');

/**
 * Create a new scaffolds instance.
 *
 * ```js
 * var scaffolds = new Scaffolds();
 * ```
 *
 * @param {Object} `cache` initial cache to use
 * @param {Object} `options` Options to put on the instance.
 * @api public
 */

function Scaffolds (cache, options) {
  if (!(this instanceof Scaffolds)) {
    return new Scaffolds(cache, options);
  }
  Base.call(this);
  this.options = options || {};
  this.use(option);
  this.use(plugin);

  this.define('cache', cache || {});

  utils.defaultProperties(this);
  this.set('config', {});
  this.set('isMetadata', true);
}

Base.extend(Scaffolds);

/**
 * Add a dependency to the manifest.
 *
 * ```js
 * scaffolds.addDependency('foo', 'doowb/foo');
 * ```
 *
 * @param {String} `key` Name of the dependency to add.
 * @param {String} `val` Location of the dependency to add (github repo, url);
 * @api public
 */

Scaffolds.prototype.addDependency = function(key, val) {
  if (typeof key === 'object') {
    return this.visit('addDependency', key);
  }
  return this.set('dependencies.' + key, val);
};

/**
 * Add a has of dependencies to the manifest.
 *
 * ```js
 * scaffolds.addDependencies({
 *   'foo': 'doowb/foo',
 *   'bar': 'doowb/bar'
 * });
 * ```
 *
 * @param {Object} `deps` Object hash of dependencies to add.
 * @api public
 */

Scaffolds.prototype.addDependencies = function(deps) {
  return this.visit('addDependency', deps);
};

/**
 * Add a new target configuration to the manifest.
 * The configuration will be expanded using [scaffold][]
 *
 * ```js
 * scaffolds.addTarget('app', {src: '*.js'});
 * ```
 *
 * @param {String} `key` Name of the target to add.
 * @param {Object} `config` Object describing the configuration of the target.
 * @api public
 */

Scaffolds.prototype.addTarget = function(key, config) {
  if (typeof key === 'object') {
    return this.visit('addTarget', key);
  }
  var scaffold = new Scaffold(config);
  scaffold.key = scaffold.key || key;
  this.cache.targets[key] = scaffold;
  this.plugins.forEach(function (fn) {
    fn.call(this, scaffold, this.options);
  }.bind(this));
  return this;
};

/**
 * Add an object hash of targets to the manifest.
 *
 * ```js
 * scaffolds.addTargets({
 *   app: {src: '*.js'},
 *   tests: {src: 'tests/*.js'},
 *   docs: {src: 'docs/*.md'}
 * });
 * ```
 *
 * @param {Object} `config` Object hash of target configurations to add.
 * @api public
 */

Scaffolds.prototype.addTargets = function(config) {
  return this.visit('addTarget', config);
};

/**
 * Get a target scaffold by name.
 *
 * ```js
 * var scaffold = scaffolds.get('specs');
 * ```
 *
 * @param  {String} `name` Name of the target scaffold to get.
 * @return {Object} scaffold instance
 * @api public
 */

Scaffolds.prototype.target = function(name) {
  return this.cache.targets[name];
};

/**
 * Return the actual manifest object to be used
 * when writing out to a json file.
 *
 * ```js
 * fs.writeFileSync('manifest.json', JSON.stringify(scaffolds, null, 2));
 * ```
 *
 * @return {Object} Object representation of the manifest.
 * @api public
 */

Scaffolds.prototype.toJSON = function() {
  return this.cache;
};

/**
 * Normalizes a manifest object by passing the manifest through
 * a list of transforms.
 *
 * ```js
 * scaffolds.normalize(require('./manifest.json'));
 * ```
 *
 * @param  {Object} `manifest` Object representing a manifest to normalize.
 * @return {Object} normalized manifest object
 * @api public
 */

Scaffolds.prototype.normalize = function(manifest) {
  return utils.transforms.call(this, manifest);
};

/**
 * Load a manifest object onto the scaffolds cache.
 *
 * ```js
 * scaffolds.load(require('./manifest.json'));
 * ```
 *
 * @param  {Object} `manifest` Object representing a manifest to load onto the cache.
 * @api public
 */

Scaffolds.prototype.load = function(manifest) {
  utils.loaders.call(this, this.normalize(manifest));
  return this;
};

/**
 * Expose Scaffolds
 */

module.exports = Scaffolds;
