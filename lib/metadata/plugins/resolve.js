'use strict';

var async = require('async');

module.exports = function (app) {
  app.define('resolvers', {});
  app.define('resolverKeys', []);
  app.define('resolver', function (name, fn) {
    if (arguments.length === 1) {
      return this.resolvers[name];
    }

    if (this.resolverKeys.indexOf(name) === -1) {
      this.resolverKeys.push(name);
    }
    this.resolvers[name] = fn;
    return this;
  });

  app.define('resolve', function (key, version, cb) {
    if (typeof version === 'function') {
      cb = version;
      version = '';
    }
    cb = cb || function (err, val) {
      if (err) throw new Error(err);
      return val;
    };

    var len = app.resolverKeys.length, i = 0;
    var installer;

    var until = function () {
      return !(len-- && !installer);
    };

    var resolve = function (next) {
      var resolver = app.resolvers[app.resolverKeys[i++]];
      resolver(key, version, function (err, results) {
        if (err) return next(err);
        installer = results;
        next();
      });
    };

    async.until(until, resolve, function (err) {
      if (err) return cb(err);
      return cb(null, installer);
    });
  });
}
