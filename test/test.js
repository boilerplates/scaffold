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

  describe('main export', function () {
    it('should export a function', function () {
      assert.equal(typeof Scaffold, 'function');
    });

    it('should expose isScaffold', function () {
      assert.equal(typeof Scaffold.isScaffold, 'function');
    });
  });

  describe('instance', function () {
    it('should create an instance of scaffold', function () {
      assert(scaffold instanceof Scaffold);
    });

    it('should return true if an instance appears to be a scaffold', function () {
      assert(Scaffold.isScaffold(scaffold));
    });
  });

  describe('targets', function () {
    it('should expose an "options" property', function () {
      scaffold.addTargets({});
      assert(scaffold.options);
    });

    it('should expose an addTargets method', function() {
      assert.equal(typeof scaffold.addTargets, 'function');
    });

    it('should add targets to `scaffold`', function() {
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

    it('should expand src patterns in targets', function() {
      scaffold.addTargets({
        foo: {src: '*.md'},
        bar: {src: '*.js'}
      });
      assert(Array.isArray(scaffold.foo.files));
      assert(Array.isArray(scaffold.foo.files[0].src));
      assert(scaffold.foo.files[0].src.length);
    });

    it('should use scaffold options on targets', function() {
      scaffold.addTargets({
        options: {cwd: 'test/fixtures'},
        foo: {src: 'a.*'},
        bar: {src: 'one.*'}
      });
      assert(scaffold.foo.files[0].src[0] === 'a.txt');
      assert(scaffold.bar.files[0].src[0] === 'one.md');
    });

    it('should retain arbitrary properties on targets', function() {
      scaffold.addTargets({
        foo: {src: '*.md', data: {title: 'My Blog'}},
        bar: {src: '*.js'}
      });
      assert(scaffold.foo.files[0].data);
      assert(scaffold.foo.files[0].data.title);
      assert(scaffold.foo.files[0].data.title === 'My Blog');
    });

    it('should use plugins on targets', function() {
      scaffold.use(function(config) {
        return function fn(node) {
          if (config.options.data && !node.data) {
            node.data = config.options.data;
          }
          return fn;
        }
      });

      scaffold.addTargets({
        options: {data: {title: 'My Site'}},
        foo: {src: '*.md', data: {title: 'My Blog'}},
        bar: {src: '*.js'}
      });

      assert(scaffold.foo.files[0].data);
      assert(scaffold.foo.files[0].data.title);
      assert(scaffold.foo.files[0].data.title === 'My Blog');

      assert(scaffold.bar.options.data);
      assert(scaffold.bar.options.data.title === 'My Site');
      assert(scaffold.bar.files[0].data);
      assert(scaffold.bar.files[0].data.title);
      assert(scaffold.bar.files[0].data.title === 'My Site');
    });
  });
});
