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

    describe('dependencies', function () {
      it('should add a dependency to dependencies', function () {
        var metadata = new Metadata();
        metadata.addDependency('foo', 'doowb/foo');
        assert.deepEqual(metadata.cache.dependencies, {'foo': 'doowb/foo'});
      });

      it('should add an object of dependencies to dependencies', function () {
        var metadata = new Metadata();
        metadata.addDependencies({
          'foo': 'doowb/foo',
          'bar': 'doowb/bar',
          'baz': 'doowb/baz'
        });
        assert.deepEqual(metadata.cache.dependencies, {
          'foo': 'doowb/foo',
          'bar': 'doowb/bar',
          'baz': 'doowb/baz'
        });
      });

      it('should add an object of dependencies to dependencies with addDependency', function () {
        var metadata = new Metadata();
        metadata.addDependency({
          'foo': 'doowb/foo',
          'bar': 'doowb/bar',
          'baz': 'doowb/baz'
        });
        assert.deepEqual(metadata.cache.dependencies, {
          'foo': 'doowb/foo',
          'bar': 'doowb/bar',
          'baz': 'doowb/baz'
        });
      });

      it('should get a dependency by name', function () {
        var metadata = new Metadata();
        metadata.addDependency('foo', 'doowb/foo');
        assert.equal(metadata.dependency('foo'), 'doowb/foo');
      });
    });

    describe('manifest', function () {
      it('should return a manifest object from toJSON', function () {
        var metadata = new Metadata();
        metadata.addDependencies({
          'foo': 'doowb/foo',
          'bar': 'doowb/bar',
          'baz': 'doowb/baz'
        });
        assert.deepEqual(metadata.toJSON(), metadata.cache);
      });

      it('should load an existing manifest object onto the cache', function () {
        var metadata = new Metadata();
        metadata.addDependencies({
          'foo': 'doowb/foo',
          'bar': 'doowb/bar',
          'baz': 'doowb/baz'
        });
        var another = new Metadata();
        another.load(metadata.toJSON());
        assert.deepEqual(another.cache, metadata.cache);
      });
    });

    describe('transforms', function () {
      it('should load defaults when the manifest is not an object', function () {
        var metadata = new Metadata();
        metadata.load('foo');
        assert.deepEqual(metadata.cache, { name: 'manifest',
          description: '',
          version: '0.1.0',
          homepage: undefined,
          repository: undefined,
          authors: [],
          license: 'MIT',
          dependencies: {},
          targets: {},
          config: {},
          isMetadata: true
        });
      });

      it('should normalize an `author` array into `authors` array', function () {
        var metadata = new Metadata();
        var author = {author: 'Brian Woodward', email: 'brian.woodward@gmail.com', homepage: 'https://github.com/doowb'};
        metadata.load({author: [author]});
        assert.deepEqual(metadata.get('authors'), [author]);
      });

      it('should normalize an `author` object into `authors` array', function () {
        var metadata = new Metadata();
        var author = {author: 'Brian Woodward', email: 'brian.woodward@gmail.com', homepage: 'https://github.com/doowb'};
        metadata.load({author: author});
        assert.deepEqual(metadata.get('authors'), [author]);
      });

      it('should normalize an `authors` object into `authors` array', function () {
        var metadata = new Metadata();
        var author = {author: 'Brian Woodward', email: 'brian.woodward@gmail.com', homepage: 'https://github.com/doowb'};
        metadata.load({authors: author});
        assert.deepEqual(metadata.get('authors'), [author]);
      });

      it('should normalize an `author` string into `authors` array', function () {
        var metadata = new Metadata();
        var author = {author: 'Brian Woodward'};
        metadata.load({author: 'Brian Woodward'});
        assert.deepEqual(metadata.get('authors'), [author]);
      });
    });

    describe('loaders', function () {
      it('should concat `authors` on manifest to existing `authors`', function () {
        var metadata = new Metadata();
        metadata.set('authors', [{author: 'Jon Schlinkert'}]);
        var author = {author: 'Brian Woodward'};
        metadata.load({author: 'Brian Woodward'});
        assert.deepEqual(metadata.get('authors'), [{author: 'Jon Schlinkert'}, {author: 'Brian Woodward'}]);
      });
    });

    describe('resolvers', function () {
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

    describe('fs', function () {
      it('should write a manifest file', function (done) {
        var metadata = new Metadata();
        metadata.load({name: 'test-manifest', description: 'this is a test manifest'});
        metadata.addDependencies({
          'foo': 'doowb/foo',
          'bar': 'doowb/bar',
          'baz': 'doowb/baz'
        });
        metadata.save('test/actual', function (err) {
          if (err) return done(err);
          assert(fs.existsSync('test/actual/manifest.json'));
          var contents = fs.readFileSync('test/actual/manifest.json', 'utf8');
          var data = JSON.parse(contents);
          assert.equal(data.name, 'test-manifest');
          assert.equal(data.description, 'this is a test manifest');
          done();
        });
      });

      it('should read a manifest file', function (done) {
        var metadata = new Metadata();
        metadata.load({name: 'test-manifest', description: 'this is a test manifest'});
        metadata.addDependencies({
          'foo': 'doowb/foo',
          'bar': 'doowb/bar',
          'baz': 'doowb/baz'
        });
        metadata.save('test/actual', function (err) {
          if (err) return done(err);
          assert(fs.existsSync('test/actual/manifest.json'));

          var metadata2 = new Metadata();
          metadata2.read('test/actual', function (err) {
            if (err) return done(err);
            assert.equal(metadata2.get('name'), metadata.get('name'));
            assert.equal(metadata2.get('description'), metadata.get('description'));
            done();
          });
        });
      });
    });
  });
});
