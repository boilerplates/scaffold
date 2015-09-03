#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var inflect = require('inflection');
var argv = require('minimist')(process.argv.slice(2));

/**
 * Lazily required module dependencies
 */


var lazy = require('lazy-cache')(require);
lazy('resolve-up', 'resolveup');
lazy('look-up', 'lookup');
lazy('globby', 'glob');


/**
 * Resolve cwd, and get package metadata from project
 */

var fp = lookup()('package.json', { cwd: argv.cwd || process.cwd() });
var pkg = tryRequire(fp);
var cwd = path.dirname(fp);
process.chdir(cwd);

/**
 * Commands
 */

if (argv.new) {
  scaffold(cwd);
} else {
  runTasks(cwd)
}

/**
 * Scaffold
 */

function scaffold(dir) {
  var base = glob().sync('*/scaffold{,s}/', {cwd: dir});
  if (!base.length) {
    console.log('cannot find `scaffolds` directory.');
    process.exit(1);
  }

  var files = lazy.glob.sync('**/*.hbs', {cwd: base[0]});
  var cache = {};
  files.forEach(function (fp) {
    var segs = fp.split(/[\\\/]/);
    var type = segs[0];
    var name = segs[segs.length - 1];
    name = name.slice(0, name.lastIndexOf('.'));
    type = inflect.singularize(type);
    cache[type] = cache[type] || {};
    cache[type][name] = fp;
  });

  var parts = argv.new.split(':');
  var key = inflect.singularize(parts[0]);
  var filename = parts[1];
  if (!filename) {
    console.error('Please specify the file to get.');
    console.error('The sytax is:');
    console.error();
    console.error('   `assemble --new foo:bar`');
    console.error();
  }
  var filepath = path.resolve(cache[key][filename]);
  console.log(filepath);
}

/**
 * Tasks
 */

function runTasks(cwd) {
  var tasks = argv._;
  var toRun = tasks.length ? tasks : ['default'];

  /**
   * Find assemble...
   */

  var assemble = pkg.name !== 'assemble'
    ? lookup()('node_modules/assemble/index.js', {cwd: cwd})
    : cwd;

  var inst = require(assemble);

  /**
   * Find assemblefile...
   */

  var assemblefile = lookup()('assemblefile.js', {cwd: cwd});
  var tasks = {};


  if (typeof assemblefile === 'string') {
    require(assemblefile);
  }

  process.nextTick(function () {
    inst.start.apply(inst, toRun);
  });
}


function tryRequire(fp) {
  try {
    return require(path.resolve(fp));
  } catch(err) {}
  return {};
}
