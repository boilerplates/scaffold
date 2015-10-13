'use strict';

var utils = require('../../utils');
var path = require('path');

module.exports = function (name, version, cb) {
  if (typeof version === 'function') {
    cb = version;
    version = '';
  }
  cb = cb || function (err, val) {
    if (err) throw new Error(err);
    return val;
  };

  // determine if this looks like a github url and
  if (version) {
    name += '#' + version;
  }
  try {
    var url = utils.resolveGithubUri(name);
    return cb(null, installer(url));
  } catch (err) {
    if (err.message === 'Invalid github repository') {
      return cb(null, null);
    }
    return cb(new Error(err));
  }
};

function installer(githubBase) {
  var FetchFiles = require('fetch-files');
  var writeFile = require('write');

  return function (files, dest, cb) {
    if (typeof dest === 'function') {
      cb = dest;
      dest = '';
    }
    if (typeof files === 'function') {
      cb = files;
      files = '';
      dest = '';
    }
    files = files || 'manifest.json';
    files = Array.isArray(files) ? files : [files];

    var downloader = new FetchFiles({destBase: dest});
    downloader.preset('github', {
      url: githubBase,
      fn: function (preset, config) {
        var branch = utils.parseGithubUrl(preset.url).branch;
        config.pathname = config.url;
        config.url = path.join(branch, config.url);
        return preset.url;
      }
    });

    files.forEach(function (file) {
      downloader.queue(file, {preset: 'github'});
    });

    downloader.fetch(function (err, res) {
      if (err) return cb(err);
      utils.async.map(res, function (config, next) {
        if (dest) {
          config.contents
            .pipe(writeFile.stream(config.dest))
            .on('error', next)
            .on('finish', function () {
              next(null, config);
            });
        } else {
          config.contents
            .pipe(writeBuffer(function (err, content) {
              if (err) return next(err);
              config.content = content;
              next(null, config);
            }))
            .on('error', next);
        }
      }, function (err, results) {
        if (err) return cb(err);
        cb(null, results);
      });
    });
  };
}

function writeBuffer(cb) {
  var through = require('through2');
  var buffer = '';
  return through()
    .on('data', function (data, next) {
      buffer += data;
    })
    .on('error', cb)
    .on('finish', function () {
      return cb(null, buffer);
    });
}
