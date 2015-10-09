var assert = require('assert');
var should = require('should');
var App = require('../');
var Scaffolds = App.Scaffolds;

describe('scaffolds plugin', function () {
  afterEach(function () {
    var app = new App();
    app.store.del('test-foo-bar');
  });

  it('should set scaffold information in the store:', function () {
    var app = new App();
    var store = app.store;
    var scaffolds = new Scaffolds();
    scaffolds.option('foo', 'bar');
    app.set('test-foo-bar', scaffolds);
    assert.deepEqual(store.get('test-foo-bar').options, {foo: 'bar'});
  });

  it('should get the same instance of the store:', function () {
    var app = new App();
    var store = app.store;
    var scaffolds = new Scaffolds();
    scaffolds.option('foo', 'bar');
    store.set('test-foo-bar', {options: scaffolds.options, manifest: scaffolds.toJSON()});
    assert.deepEqual(app.get('test-foo-bar'), scaffolds);
  });

  it('should return null when metadata is not found:', function () {
    var app = new App();
    assert.deepEqual(app.get('test-foo-bar'), null);
  });

  it('should return empty options object:', function () {
    var app = new App();
    var store = app.store;
    var scaffolds = new Scaffolds();
    scaffolds.options = null;
    app.set('test-foo-bar', scaffolds);
    assert.deepEqual(store.get('test-foo-bar').options, {});
  });
});
