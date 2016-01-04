var path = require('path');
var gm = require('global-modules');
var stringify = require('./test/support/');
var Scaffold = require('./');


/**
 * UI component
 */

var npm = new Scaffold({
  component: {
    options: {
      cwd: gm + '/scaffolds-example/scaffolds',
      expand: true,
    },
    files: [
      {src: 'templates/*.hbs', dest: 'src/'},
      {src: 'scripts/*.js', dest: 'src/'},
      {src: 'styles/*.css', dest: 'src/'},
    ]
  }
});
console.log(stringify(npm));


/**
 * Site components
 */

var site = new Scaffold({
  blog: {
    cwd: 'test/scaffolds',
    files: [
      {src: 'content/post.md', dest: 'src/posts/'},
      {src: 'scripts/*.js', dest: 'src/scripts/'},
      {src: 'data/ipsum.json', dest: 'src/data/'}
    ]
  },
  components: {
    cwd: 'test/scaffolds',
    files: [
      {src: 'content/post.md', dest: 'src/posts/'},
      {src: 'scripts/*.js', dest: 'src/scripts/'},
      {src: 'data/ipsum.json', dest: 'src/data/'}
    ]
  }
});
console.log(stringify(site));


/**
 * Dotfiles
 */

var dotfiles = new Scaffold({
  root: {
    src: '.*',
    filter: function (fp) {
      return !/DS_Store/.test(fp);
    }
  }
});

console.log(stringify(dotfiles));


// `~` tilde expands to the user's home directory
var home = new Scaffold({
  foo: {
    options: {cwd: '~/scaffolds'},
    src: ['**/component*'],
    dest: 'local/src/'
  },
  bar: {
    options: {cwd: '~', srcBase: 'scaffolds'},
    src: ['*/component.*'],
    dest: 'local/src/'
  }
});
console.log(stringify(home))



function component(name) {
  var scaffold = {};
  scaffold[name] = {
    files: {
      src: ['*.js'],
      dest: 'src'
    },
    rename: function (dest, src, opts) {
      return path.join(dest, name, 'index') + path.extname(src);
    }
  };
  return new Scaffold(scaffold);
}

console.log(component('foo'));
//=> 'src/foo/index.js'
console.log(component('bar'));
//=> 'src/bar/index.js'
console.log(component('baz'));
//=> 'src/baz/index.js'
