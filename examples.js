var path = require('path');
var stringify = require('./test/support/');
var Scaffold = require('./');


/**
 * UI component
 */

var npm = new Scaffold('component', {
  cwd: '@/scaffolds-example/scaffolds',
  files: [
    {src: 'templates/*.hbs', dest: 'src/'},
    {src: 'scripts/*.js', dest: 'src/'},
    {src: 'styles/*.css', dest: 'src/'},
  ]
});
console.log(stringify(npm));


/**
 * Blog post
 */

var post = new Scaffold('post', {
  cwd: 'test/scaffolds',
  files: [
    {src: 'content/post.md', dest: 'src/posts/'},
    {src: 'scripts/ipsum.json', dest: 'src/data/'}
  ]
});
console.log(stringify(post));


/**
 * Dotfiles
 */

var dotfiles = new Scaffold('dotfiles', '.*', {
  filter: function (fp) {
    return !/DS_Store/.test(fp);
  }
});
console.log(stringify(dotfiles));


var foo = new Scaffold('foo', {
  // `~` tilde expands to the user's home directory
  options: {cwd: '~/scaffolds'},
  src: ['**/component*'],
  dest: 'local/src/'
});
console.log(stringify(foo))


var bar = new Scaffold('foo', {
  // `~` tilde expands to the user's home directory
  options: {cwd: '~', srcBase: 'scaffolds'},
  src: ['*/component.*'],
  dest: 'local/src/'
});
console.log(stringify(bar));


// function component(name) {
//   return new Scaffold(name, {
//     files: {src: ['*.js'], dest: 'src'},
//     rename: function(dest, src, opts) {
//       return path.join(dest, name, 'index') + path.extname(src);
//     }
//   });
// }

// component('foo')
// //=> 'src/foo/index.js'
// component('bar')
// //=> 'src/bar/index.js'
// component('baz')
// //=> 'src/baz/index.js'
