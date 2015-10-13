/*!
 * metadata <https://github.com/doowb/metadata>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var Base = require('base-methods').namespace('cache');
var option = require('base-options');

var plugin = require('../plugins/base-plugin');
var resolve = require('./plugins/resolve');
var Scaffold = require('../scaffold');

var utils = require('../utils');

/**
 * Create a new metadata instance.
 *
 * ```js
 * var metadata = new Metadata();
 * ```
 *
 * @param {Object} `cache` initial cache to use
 * @param {Object} `options` Options to put on the instance.
 * @api public
 */

function Metadata (cache, options) {
  if (!(this instanceof Metadata)) {
    return new Metadata(cache, options);
  }
  Base.call(this);
  this.options = options || {};
  this.use(option);
  this.use(plugin);
  this.use(resolve);

  this.define('cache', cache || {});

  utils.defaultProperties(this);
  this.set('config', {});
  this.set('isMetadata', true);

}

Base.extend(Metadata);

/**
 * Add a dependency to the manifest.
 *
 * ```js
 * metadata.addDependency('foo', 'doowb/foo');
 * ```
 *
 * @param {String} `key` Name of the dependency to add.
 * @param {String} `val` Location of the dependency to add (github repo, url);
 * @api public
 */

Metadata.prototype.addDependency = function(key, val) {
  if (typeof key === 'object') {
    return this.visit('addDependency', key);
  }
  return this.set('dependencies.' + key, val);
};

/**
 * Add a has of dependencies to the manifest.
 *
 * ```js
 * metadata.addDependencies({
 *   'foo': 'doowb/foo',
 *   'bar': 'doowb/bar'
 * });
 * ```
 *
 * @param {Object} `deps` Object hash of dependencies to add.
 * @api public
 */

Metadata.prototype.addDependencies = function(deps) {
  return this.visit('addDependency', deps);
};


/**
 * Get a dependency by name.
 *
 * ```js
 * var manifest = metadata.dependency('doowb/scaffold-assemblefile');
 * ```
 *
 * @param  {String} `name` Name of the dependency to get.
 * @return {Object} metadata instance
 * @api public
 */

Metadata.prototype.dependency = function(name) {
  var dep = this.get('dependencies.' + name);
  return dep; // TODO turn this into an instance of metadata
};

/**
 * Return the actual manifest object to be used
 * when writing out to a json file.
 *
 * ```js
 * fs.writeFileSync('manifest.json', JSON.stringify(metadata, null, 2));
 * ```
 *
 * @return {Object} Object representation of the manifest.
 * @api public
 */

Metadata.prototype.toJSON = function() {
  return this.cache;
};

/**
 * Normalizes a manifest object by passing the manifest through
 * a list of transforms.
 *
 * ```js
 * metadata.normalize(require('./manifest.json'));
 * ```
 *
 * @param  {Object} `manifest` Object representing a manifest to normalize.
 * @return {Object} normalized manifest object
 * @api public
 */

Metadata.prototype.normalize = function(manifest) {
  return utils.transforms.call(this, manifest);
};

/**
 * Load a manifest object onto the metadata cache.
 *
 * ```js
 * metadata.load(require('./manifest.json'));
 * ```
 *
 * @param  {Object} `manifest` Object representing a manifest to load onto the cache.
 * @api public
 */

Metadata.prototype.load = function(manifest) {
  utils.loaders.call(this, this.normalize(manifest));
  return this;
};

/**
 * Save the current metadata object as a manifest.json file.
 *
 * ```
 * metadata.save(function (err) {
 *   if (err) return console.error(err);
 *   console.log('saved');
 * });
 * ```
 *
 * @param  {String} `dest` Optional destination path to save to. Defaults to `process.cwd()`
 * @param  {Function} `cb` Callback function that takes an error object if an error occurs.
 * @api public
 */

Metadata.prototype.save = function(dest, cb) {
  if (typeof dest === 'function') {
    cb = dest;
    dest = '';
  }
  dest = dest || process.cwd();
  dest = path.join(dest, 'manifest.json');
  var contents = null;
  try {
    contents = JSON.stringify(this, null, 2);
  } catch (err) {
    return cb(err);
  }
  return utils.write(dest, contents, cb);
};

/**
 * Read a manifest.json file and load it onto the current metadata object.
 *
 * ```
 * metadata.read(function (err) {
 *   if (err) return console.error(err);
 *   console.log('read');
 * });
 * ```
 *
 * @param  {String} `src` Optional source path to read from. Defaults to `process.cwd()`
 * @param  {Function} `cb` Callback function that takes an error object if an error occurs.
 * @api public
 */

Metadata.prototype.read = function(src, cb) {
  var self = this;
  if (typeof src === 'function') {
    cb = src;
    src = '';
  }
  src = src || process.cwd();
  src = path.join(src, 'manifest.json');

  fs.readFile(src, 'utf8', function (err, contents) {
    if (err) return cb(err);
    var data = {};
    try {
      data = JSON.parse(contents);
    } catch (err) {
      return cb(err);
    }
    self.load(data);
    cb(null);
  });
};

/**
 * Expose Metadata
 */

module.exports = Metadata;
