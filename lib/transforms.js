'use strict';

var transforms = [
  defaultFactory('name', 'manifest'),
  defaultFactory('description', ''),
  defaultFactory('version', '0.1.0'),
  repository,
  homepage,
  authors,
  defaultFactory('license', 'MIT'),
  dependencies,
  targets,
  defaultFactory('config', {})
];

/**
 * Run an array of transforms over the given manifest to
 * transform the manifest object before loading.
 *
 * @param  {Object} `manifest` manifest object
 * @return {Object} transformed manifest object
 */

module.exports = function (manifest) {
  if (typeof manifest !== 'object') {
    manifest = {};
  }

  var len = transforms.length, i = 0;
  while (len--) {
    transforms[i++].call(this, manifest);
  }
  return manifest;
};

function repository (manifest) {}
function homepage (manifest) {}

/**
 * Ensure an `authors` array property is on the manifest file,
 * transforming `author` and `authors` properties into the proper format.
 *
 * @param  {Object} `manifest` manifest object
 */

function authors (manifest) {
  var authors = manifest.authors || [];
  authors = Array.isArray(authors) ? authors : [authors];

  if (Array.isArray(manifest.author)) {
    authors = authors.concat(manifest.author);
    delete manifest.author;
  }

  if (typeof manifest.author === 'string') {
    var author = manifest.author;
    delete manifest.author
    authors.push({author: author});
  }

  if (typeof manifest.author === 'object') {
    var author = manifest.author;
    delete manifest.author;
    authors.push(author);
  }

  manifest.authors = authors;
}

/**
 * Ensure a `dependencies` object property is on the manifest file
 *
 * @param  {Object} `manifest` manifest object
 */

function dependencies (manifest) {
  defaultFactory('dependencies', {})(manifest);
}

/**
 * Ensure a `targets` object property is on the manifest file
 *
 * @param  {Object} `manifest` manifest object
 */

function targets (manifest) {
  defaultFactory('targets', {})(manifest);
}

/**
 * Create a transform function that ensures the given property
 * is on the manifest object, setting a default when the property doesn't exist.
 *
 * @param  {String} `prop` property to set.
 * @param  {*} `def` default to use when property doesn't exist.
 * @return {Function} Function to use as a transform.
 */

function defaultFactory (prop, def) {
  return function (manifest) {
    manifest[prop] = manifest[prop] || def;
  };
}
