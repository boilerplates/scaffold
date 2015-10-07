'use strict';

var loaders = [
  setFactory('name'),
  setFactory('description'),
  setFactory('version'),
  setFactory('repository'),
  setFactory('homepage'),
  setFactory('license'),
  authors,
  visitFactory('addDependency', 'dependencies'),
  visitFactory('addTarget', 'targets'),
  setFactory('config')
];

/**
 * Run an array of loaders over the given manifest to
 * set properties on the metadata instance.
 *
 * @param  {Object} `manifest` manifest object
 * @return {Object} original manifest object
 */

module.exports = function (manifest) {
  var len = loaders.length, i = 0;
  while (len--) {
    loaders[i++].call(this, manifest);
  }
  return manifest;
};

/**
 * Extend the current `authors` array with any new authors
 * on the manifest object.
 *
 * @param  {Object} `manifest` manifest object
 */

function authors (manifest) {
  var current = this.get('authors');
  this.set('authors', current.concat(manifest.authors));
}

/**
 * Create a loader function that calls visit on the given
 * `methods` and passing in the given `prop` from the `manifest` object.
 *
 * @param  {String} `method` Method to visit.
 * @param  {String} `prop` Property to pass to `visit`
 * @return {Function} Function to use as a loader
 */

function visitFactory (method, prop) {
  return function (manifest) {
    this.visit(method, manifest[prop]);
  };
}

/**
 * Create a loader function that sets the given property.
 *
 * @param {String} `prop` Property to set.
 * @return {Function} Function to use as a loader
 */

function setFactory (prop) {
  return function (manifest) {
    this.set(prop, manifest[prop]);
  };
}
