var fs = require('fs');
var rimraf = require('rimraf');
var assert = require('assert');
var should = require('should');
var Metadata = require('../lib/metadata');
var metadata;

describe('metadata', function () {
  describe('constructor:', function () {
    it('should return an instance of Metadata:', function () {
      metadata = new Metadata();
      assert(metadata instanceof Metadata);
    });

    it('should return an instance of Metadata without new:', function () {
      metadata = Metadata();
      assert(metadata instanceof Metadata);
    });
  });

  describe('instance:', function () {
    afterEach(function (done) {
      rimraf('test/actual', done);
    });

    it('should create default metadata instance:', function () {
      var metadata = new Metadata();

      assert.equal(typeof metadata.options, 'object');
      assert.equal(typeof metadata.cache, 'object');
      assert.equal(typeof metadata.cache.config, 'object');
      assert(metadata.cache.isMetadata);
      assert.deepEqual(metadata.cache.name, '');
      assert.deepEqual(metadata.cache.description, '');
      assert.deepEqual(metadata.cache.version, '0.1.0');
      assert.deepEqual(metadata.cache.homepage, '');
      assert.deepEqual(metadata.cache.repository, '');
      assert.deepEqual(metadata.cache.authors, []);
      assert.deepEqual(metadata.cache.license, 'MIT');
      assert.deepEqual(metadata.cache.dependencies, {});
    });

    it('should register resolvers:', function () {
      var metadata = new Metadata();
      metadata.resolver('github', require('../lib/metadata/resolvers/github'));
      assert.deepEqual(metadata.resolverKeys, ['github']);
      assert.equal(typeof metadata.resolvers.github, 'function');
    });

    it('should use registered resolvers:', function () {
      var metadata = new Metadata();
      metadata.resolver('github', require('../lib/metadata/resolvers/github'));
      var installer = metadata.resolve('doowb/handlebars-helpers', 'docs');
      assert(installer);
      assert.equal(typeof installer, 'function');
    });

    it('should not resolve invalid github url:', function () {
      var metadata = new Metadata();
      metadata.resolver('github', require('../lib/metadata/resolvers/github'));
      var installer = metadata.resolve('doowb');
      assert(installer == null);
    });

    it('should download the default mainfest file from a github url:', function (done) {
      var metadata = new Metadata();
      metadata.resolver('github', require('../lib/metadata/resolvers/github'));
      var installer = metadata.resolve('doowb/handlebars-helpers', 'docs');
      installer('scaffolds.json', function (err, configs) {
        assert.equal(configs.length, 1);
        var config = configs[0];
        assert.equal(typeof config.content, 'string');
        var data = JSON.parse(config.content);
        assert.equal(data.name, 'handlebars-helpers');
        done();
      });
    });

    it('should download a specified file from a github url:', function (done) {
      var metadata = new Metadata();
      metadata.resolver('github', require('../lib/metadata/resolvers/github'));
      var installer = metadata.resolve('doowb/handlebars-helpers', 'docs');
      installer('scaffolds.json', function (err, configs) {
        assert.equal(configs.length, 1);
        var config = configs[0];
        assert.equal(typeof config.content, 'string');
        var data = JSON.parse(config.content);
        assert.equal(data.name, 'handlebars-helpers');
        done();
      });
    });

    it('should download a specified file from a github url to a specified dest:', function (done) {
      var metadata = new Metadata();
      metadata.resolver('github', require('../lib/metadata/resolvers/github'));
      var installer = metadata.resolve('doowb/handlebars-helpers', 'docs');
      installer('scaffolds.json', 'test/actual', function (err, configs) {
        assert.equal(configs.length, 1);
        var config = configs[0];
        assert.equal(typeof config.content, 'undefined');
        assert(fs.existsSync('test/actual/scaffolds.json'));
        var content = fs.readFileSync('test/actual/scaffolds.json', 'utf8');
        var data = JSON.parse(content);
        assert.equal(data.name, 'handlebars-helpers');
        done();
      });
    });

  });
});
