var stringify = require('./test/support/');
var Scaffold = require('./');


/**
 * UI component
 */

var component = new Scaffold('component', {
  cwd: '@/scaffolds-example/scaffolds',
  files: [
    {src: 'templates/*.hbs', dest: 'src/'},
    {src: 'scripts/*.js', dest: 'src/'},
    {src: 'styles/*.css', dest: 'src/'},
  ]
});
console.log(stringify(component));


/**
 * Blog post
 */

var post = new Scaffold('post', {
  cwd: 'test/scaffolds',
  files: [
    {src: 'content/post.md', dest: 'src/posts/'},
    {src: 'scripts/ipsum.json', dest: 'src/data/'},
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

