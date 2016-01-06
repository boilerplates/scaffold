'use strict';

require('mocha');
require('should');
var util = require('util');
var assert = require('assert');
var Scaffold = require('..');
var scaffold;

describe('scaffolds', function () {
  beforeEach(function() {
    scaffold = new Scaffold();
  });

  describe('targets', function () {
    it('should expose an "options" property', function () {
      scaffold.addTargets({});
      assert(scaffold.options);
    });

    it('should expose targets', function () {
      scaffold.addTargets({
        foo: {src: '*'},
        bar: {src: '*'}
      });
      assert(scaffold.foo);
      assert(scaffold.bar);
    });

    it('should support passing a configuration to the constructor', function () {
      var scaffold = new Scaffold({
        foo: {
          cwd: 'test/templates',
          files: [{src: '*.txt', dest: 'foo'}]
        }
      });
      assert(scaffold.foo);
      assert(Array.isArray(scaffold.foo.files));
      assert(scaffold.foo.files[0].src.length > 1);
    });

    it('should expand files arrays', function () {
      scaffold.addTargets({
        foo: {src: '*'},
        bar: {src: '*'}
      });
      assert(scaffold.foo);
      assert(scaffold.bar);
    });
  });
});
