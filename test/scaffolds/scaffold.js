'use strict';

var path = require('path');
var each = require('async-each');
var task = require('expand-task');
var relative = require('relative');

var config = task('scaffolds', {
  options: {
    cwd: relative(path.join(__dirname, '..', 'templates')),
    expand: true
  },
  foo: {
    files: {
      src: '*.txt',
      dest: 'foo/'
    }
  },
  bar: {
    files: {
      src: '*.txt',
      dest: 'foo/'
    }
  }
});

console.log(config.targets)

// function target(name) {
//   return res.targets[name];
// }

// function build(key, cb) {
//   var config = target(key);
//   var i = 0;

//   each(config.files, function (node, next) {
//       console.log(node)
//     // generate.task(key, function (done) {
//     //   // generate.src(node.src).pipe(generate.dest(node.dest));
//     //   done();
//     // });
//     next();
//   }, function (err) {
//     if (err) return cb(err);

//     // generate.run(key, function (err) {
//     //   if (err) return cb(err);
//     //   cb();
//     // })
//   });
//   return config;
// }

// build('partials', function (err, res) {
//   console.log(res)
// });
