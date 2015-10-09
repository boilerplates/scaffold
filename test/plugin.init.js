var assert = require('assert');
var should = require('should');

var utils = require('../lib/utils');
var App = require('../');

describe('init plugin', function () {
  it('should initialize metadata with package.json data:', function () {
    var app = new App();
    app.init();
    var expected = utils.pick(utils.pkg, ['name', 'description', 'version', 'homepage', 'repository', 'author', 'license']);
    expected.authors = [utils.pick(expected, ['author'])];
    delete expected.author;
    expected.config = {};
    expected.dependencies = {};
    expected.targets = {};
    expected.isMetadata = true;
    assert.deepEqual(app.scaffolds.cache, expected);
  });

  it('should initialize metadata with passed in data:', function () {
    var app = new App();
    app.init({name: 'test-foo-bar', description: 'this is a test', homepage: 'https://github.com/doowb', repository: 'https://github.com/jonschlinkert/scaffold'});
    var expected = {
      name: 'test-foo-bar',
      description: 'this is a test',
      homepage: 'https://github.com/doowb',
      repository: 'https://github.com/jonschlinkert/scaffold',
      version: '0.1.0',
      license: 'MIT',
      authors: [],
      config: {},
      dependencies: {},
      targets: {},
      isMetadata: true,
    };
    assert.deepEqual(app.scaffolds.cache, expected);
  });

  it('should only initialize metadata once:', function () {
    var app = new App();
    app.init({name: 'test-foo-bar', description: 'this is a test', homepage: 'https://github.com/doowb', repository: 'https://github.com/jonschlinkert/scaffold'});
    app.scaffolds.set('name', 'test-foo-bar-2');
    app.init();
    var expected = {
      name: 'test-foo-bar-2',
      description: 'this is a test',
      homepage: 'https://github.com/doowb',
      repository: 'https://github.com/jonschlinkert/scaffold',
      version: '0.1.0',
      license: 'MIT',
      authors: [],
      config: {},
      dependencies: {},
      targets: {},
      isMetadata: true,
    };
    assert.deepEqual(app.scaffolds.cache, expected);
  });
});
