'use strict';

require('mocha');
require('should');
var path = require('path');
var util = require('util');
var assert = require('assert');
var Scaffold = require('..');
var scaffold;

var cwd = path.resolve.bind(path, __dirname);

describe('scaffolds', function() {
  beforeEach(function() {
    scaffold = new Scaffold();
  });

  describe('main export', function() {
    it('should export a function', function() {
      assert.equal(typeof Scaffold, 'function');
    });

    it('should expose isScaffold', function() {
      assert.equal(typeof Scaffold.isScaffold, 'function');
    });
  });

  describe('instance', function() {
    it('should create an instance of scaffold', function() {
      assert(scaffold instanceof Scaffold);
    });

    it('should return true if an instance appears to be a scaffold', function() {
      assert(Scaffold.isScaffold(scaffold));
    });
  });

  describe('.options', function() {
    it('should support passing a targets configuration on constructor options', function() {
      var scaffold = new Scaffold({
        foo: {
          cwd: cwd('templates'),
          files: [{src: '*.txt', dest: 'foo'}]
        }
      });

      assert(scaffold.targets.foo);
      assert(Array.isArray(scaffold.targets.foo.files));
      assert(scaffold.targets.foo.files[0].src.length > 1);
    });

    it('should expose an "options" property', function() {
      scaffold.addTargets({});
      assert(scaffold.options);
    });
  });

  describe('.addTargets', function() {
    it('should expose an addTargets method', function() {
      assert.equal(typeof scaffold.addTargets, 'function');
    });

    it('should add targets to `scaffold`', function() {
      scaffold.addTargets({
        foo: {src: '*'},
        bar: {src: '*'}
      });
      assert(scaffold.targets.foo);
      assert(scaffold.targets.bar);
    });

    it('should expand files arrays', function() {
      scaffold.addTargets({
        foo: {src: '*'},
        bar: {src: '*'}
      });
      assert(scaffold.targets.foo);
      assert(scaffold.targets.bar);
    });

    it('should expand src patterns in targets', function() {
      scaffold.addTargets({
        foo: {src: cwd('fixtures/*.md')},
        bar: {src: cwd('fixtures/*.js')}
      });
      assert(Array.isArray(scaffold.targets.foo.files));
      assert(Array.isArray(scaffold.targets.foo.files[0].src));
      assert(scaffold.targets.foo.files[0].src.length);
    });

    it('should use scaffold options on targets', function() {
      scaffold.addTargets({
        options: {cwd: cwd('fixtures')},
        foo: {src: 'a.*'},
        bar: {src: 'one.*'}
      });
      assert.equal(scaffold.targets.foo.files[0].src[0], 'a.txt');
      assert.equal(scaffold.targets.bar.files[0].src[0], 'one.md');
    });

    it('should retain arbitrary properties on targets', function() {
      scaffold.addTargets({
        foo: {src: '*.md', data: {title: 'My Blog'}},
        bar: {src: '*.js'}
      });
      assert(scaffold.targets.foo.files[0].data);
      assert(scaffold.targets.foo.files[0].data.title);
      assert.equal(scaffold.targets.foo.files[0].data.title, 'My Blog');
    });
  });

  describe('events', function() {
    it('should emit `target`', function() {
      var count = 0;

      scaffold.on('target', function(target) {
        assert(target.isTarget);
        count++;
      });

      scaffold.addTargets({
        foo: {src: '*'},
        bar: {src: '*'}
      });

      assert.equal(count, 2);
    });

    it('should emit `files`', function() {
      var count = 0;

      scaffold.on('files', function(name, files) {
        count++;
      });

      scaffold.addTargets({
        foo: {
          files: [{src: ['*']}]
        },
        bar: {
          files: [{src: ['*']}]
        }
      });

      assert.equal(count, 6);
    });
  });

  describe('.use', function() {
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

      assert(scaffold.targets.foo.files[0].data);
      assert(scaffold.targets.foo.files[0].data.title);
      assert.equal(scaffold.targets.foo.files[0].data.title, 'My Blog');

      assert(scaffold.targets.bar.options.data);
      assert.equal(scaffold.targets.bar.options.data.title, 'My Site');
      assert(scaffold.targets.bar.files[0].data);
      assert(scaffold.targets.bar.files[0].data.title);
      assert.equal(scaffold.targets.bar.files[0].data.title, 'My Site');
    });
  });
});
