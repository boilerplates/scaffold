'use strict';

require('mocha');
require('should');
var path = require('path');
var util = require('util');
var assert = require('assert');
var Scaffold = require('..');
var scaffold;

var cwd = path.resolve.bind(path, __dirname);

describe('.name', function() {
  beforeEach(function() {
    scaffold = new Scaffold();
  });

  it('should get name from ctor options', function() {
    var scaffold = new Scaffold({name: 'foo'});
    assert.strictEqual(scaffold.name, 'foo');
  });

  it('should get name from scaffold.options', function() {
    var scaffold = new Scaffold();
    scaffold.options.name = 'foo';
    assert.strictEqual(scaffold.name, 'foo');
  });

  it('should get name from scaffold.name', function() {
    var scaffold = new Scaffold();
    scaffold.name = 'foo';
    assert.strictEqual(scaffold.name, 'foo');
  });

  it('should get name from another Scaffold instance', function() {
    var foo = new Scaffold({name: 'foo'});
    var scaffold = new Scaffold(foo);
    scaffold.name = 'foo';
    assert.strictEqual(scaffold.name, 'foo');
  });
});
