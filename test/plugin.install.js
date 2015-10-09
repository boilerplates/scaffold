var capture = require('capture-stream');
var request = require('request');
var assert = require('assert');
var should = require('should');
var sinon = require('sinon');

var utils = require('../lib/utils');
var App = require('../');

describe('install plugin', function () {
  it('should install specified dependency:', function (done) {
    var restore = capture(process.stdout);
    var app = new App();
    app.install('doowb/scaffold-assemblefile', function (err, scaffolds) {
      var output = restore(true);
      if (err) return done(err);
      assert.notEqual(output.indexOf('Downloading'), -1);
      assert.notEqual(output.indexOf('doowb/scaffold-assemblefile'), -1);
      assert.equal(output.indexOf('Warning'), -1);
      done();
    });
  });

  it('should install registered dependencies:', function (done) {
    var app = new App();
    app.init({
      dependencies: {
        'doowb/scaffold-assemblefile': 'doowb/scaffold-assemblefile',
        'doowb/scaffold-gulpfile': 'doowb/scaffold-gulpfile',
      }
    });
    var restore = capture(process.stdout);
    app.install(function (err, scaffolds) {
      var output = restore(true);
      if (err) return done(err);
      assert.notEqual(output.indexOf('Downloading'), -1);
      assert.notEqual(output.indexOf('doowb/scaffold-assemblefile'), -1);
      assert.notEqual(output.indexOf('doowb/scaffold-gulpfile'), -1);
      assert.equal(output.indexOf('Warning'), -1);
      done();
    });
  });

  it('should install specified dependency when options is null:', function (done) {
    var app = new App();
    var restore = capture(process.stdout);
    app.install('doowb/scaffold-assemblefile', null, function (err, scaffolds) {
      var output = restore(true);
      if (err) return done(err);
      assert.notEqual(output.indexOf('Downloading'), -1);
      assert.notEqual(output.indexOf('doowb/scaffold-assemblefile'), -1);
      assert.equal(output.indexOf('Warning'), -1);
      done();
    });
  });

  it('should give a warning when dependency is not found:', function (done) {
    var app = new App();
    var restore = capture(process.stdout);
    app.install('doowb/scaffolds-assemblefile', function (err, scaffolds) {
      var output = restore(true);
      if (err) return done(err);
      assert.notEqual(output.indexOf('Downloading'), -1);
      assert.notEqual(output.indexOf('doowb/scaffolds-assemblefile'), -1);
      assert.notEqual(output.indexOf('Warning'), -1);
      assert.notEqual(output.indexOf('Not Found'), -1);
      done();
    });
  });

  it('should add dependency to manifest when `save:true` is specified on options:', function (done) {
    var app = new App();
    var restore = capture(process.stdout);
    app.install('doowb/scaffold-project', {save: true}, function (err, scaffolds) {
      var output = restore(true);
      if (err) return done(err);
      assert.notEqual(output.indexOf('Downloading'), -1);
      assert.notEqual(output.indexOf('doowb/scaffold-project'), -1);
      assert.equal(output.indexOf('Warning'), -1);
      assert.equal(output.indexOf('Not Found'), -1);
      done();
    });
  });

  describe('resolve error', function () {
    before(function(){
      sinon
        .stub(request, 'get')
        .yields(new Error('Fake Error'), null, null);
    });

    after(function(){
      request.get.restore();
    });

    it('should get a fake error from resolve', function (done) {
      var app = new App();
      var restore = capture(process.stdout);
      app.install('doowb/scaffold-project', function (err, scaffolds) {
        var output = restore(true);
        if (err) {
          assert.equal(typeof err.notFound, 'undefined');
          assert.equal(err.message, 'Error: Fake Error');
          return done();
        }
        done(new Error('Expected an error'));
      });
    });
  });
});