var assert = require('assert');
var should = require('should');
var App = require('../');

describe('base-plugin plugin', function () {
  it('should use a plugin:', function () {
    var app = new App();
    var count = 0;
    app.use(function () {
      count++;
    });
    assert.equal(count, 1);
  });

  it('should register a plugin:', function () {
    var app = new App();
    var len = app.plugins.length;
    app.use(function () {
      return function () {};
    });
    assert.equal(app.plugins.length, len + 1);
  });

  it('should run registered plugins:', function () {
    var app = new App();
    var obj = {count: 0};
    app.use(function () {
      return function (config) {
        config.count++;
      };
    });
    app.run(obj);
    assert.deepEqual(obj, {count: 1});
  });

  it('should run registered plugins using use:', function () {
    var app = new App();
    var obj = {
      count: 0,
      use: function (fn) {
        fn.call(this, this);
      }
    };
    app.use(function () {
      return function () {
        this.count++;
      };
    });
    app.run(obj);
    assert.equal(obj.count, 1);
  });
});
