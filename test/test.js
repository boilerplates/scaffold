'use strict';

/* deps: mocha */
var assert = require('assert');
var should = require('should');
var Scaffold = require('../');
var scaffold;

describe('scaffold', function () {
  beforeEach(function () {
    scaffold = new Scaffold();
  });

  describe('constructor:', function () {
    it('should return an instance of Scaffold:', function () {
      assert(scaffold instanceof Scaffold);
    });
  });

  describe('static methods:', function () {
    it('should expose `extend`:', function () {
      assert(typeof Scaffold.extend === 'function');
    });
    it('should extend an object:', function () {
      function foo() {}
      Scaffold.extend(foo);
      assert(typeof foo.extend === 'function');
    });
  });

  describe('prototype methods:', function () {
    it('should expose `visit`:', function () {
      assert(typeof scaffold.visit === 'function');
    });
    it('should expose `get`:', function () {
      assert(typeof scaffold.get === 'function');
    });
    it('should expose `set`:', function () {
      assert(typeof scaffold.set === 'function');
    });
    it('should expose `register`:', function () {
      assert(typeof scaffold.register === 'function');
    });
  });

  describe('register:', function () {
    it('should add a scaffold to the targets object:', function () {
      scaffold.register('header', {
        cwd: 'test/templates',
        src: ['[a-c].txt']
      });
      assert(typeof scaffold.targets.header === 'object');
    });

    it('should support passing `src` as a string:', function () {
      scaffold.register('header', 'test/templates/[a-c].txt');
      assert(typeof scaffold.targets.header === 'object');
    });

    it('should support passing `src` as an array:', function () {
      scaffold.register('header', ['test/templates/[a-c].txt']);
      assert(typeof scaffold.targets.header === 'object');
    });

    it('should support passing options as the third argument:', function () {
      scaffold.register('header', '[a-c].txt', {cwd: 'test/templates'});
      assert(typeof scaffold.targets.header === 'object');
    });

    it('should be chainable:', function () {
      var scaffold = new Scaffold({cwd: 'test/templates'})
        .register('header', '[a-b].txt')
        .register('footer', '[c-d].txt')
        .register('sidebar', '[e-f].txt')

      assert(typeof scaffold.targets.header === 'object');
      assert(typeof scaffold.targets.footer === 'object');
      assert(typeof scaffold.targets.sidebar === 'object');
    });
  });
});
