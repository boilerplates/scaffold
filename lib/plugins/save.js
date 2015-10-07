'use strict';

var utils = require('../utils');

module.exports = function (app) {
  app.mixin('save', function (scaffolds, cb) {
    var resolveDir = require('resolve-dir');
    var FetchFiles = require('fetch-files');
    var writeFile = require('write');
    var path = require('path');

    var name = scaffolds.get('name');
    var base = path.join(resolveDir('~/.scaffolds'), name, scaffolds.get('version'));

    var githubBase = utils.resolveGithubUri(scaffolds.get('repository'));
    var downloader = new FetchFiles({destBase: base});
    downloader.preset('github', {
      url: githubBase,
      fn: function (preset, config) {
        var branch = utils.parseGithubUrl(preset.url).branch;
        config.pathname = config.url;
        config.url = path.join(branch, config.url);
        return preset.url;
      }
    });

    var targets = scaffolds.get('targets');
    utils.reduce(targets, function (acc, target, name) {
      target.files.forEach(function (file) {
        file.src.forEach(function (src) {
          downloader.queue(src, {preset: 'github', target: name});
        });
      });
      return acc;
    }, {});

    var fp = path.join(base, 'manifest.json');
    writeFile(fp, JSON.stringify(scaffolds, null, 2), function (err) {
      if (err) return cb(err);
      downloader.fetch(function (err, res) {
        if (err) return cb(err);
        utils.async.each(res, function (config, next) {
          config.contents
            .pipe(writeFile.stream(config.dest))
            .on('error', next)
            .on('finish', next);
        }, function (err) {
          if (err) return cb(err);
          cb(null, scaffolds);
        });
      });
    });
  });
};
