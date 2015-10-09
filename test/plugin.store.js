var assert = require('assert');
var should = require('should');
var DataStore = require('data-store');
var App = require('../');

describe('store plugin', function () {
  it('should get the store:', function () {
    var app = new App();
    var store = app.store;
    assert(store instanceof DataStore);
  });

  it('should get the same instance of the store:', function () {
    var app = new App();
    var store1 = app.store;
    var store2 = app.store;
    assert(store1 instanceof DataStore);
    assert(store2 instanceof DataStore);
    assert.deepEqual(store1, store2);
  });
});
