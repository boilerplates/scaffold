'use strict';

module.exports = function download(app) {
  app.mixin('download', function (uri, cb) {
    var request = require('request');
    var opts = {url: uri};

    request(opts, function (err, res, body) {
      if (err) return cb(new Error(err));
      if (res.statusCode !== 200) {
        var err = new Error(res.statusMessage);
        err.notFound = (res.statusCode === 404);
        return cb(err);
      }
      try {
        var data = JSON.parse(body);
        return cb(null, data);
      } catch (err) {
        return cb(err);
      }
    });
  });
};
