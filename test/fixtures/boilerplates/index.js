'use strict';

var fs = require('fs');
var path = require('path');
var Boilerplate = require('../../boilerplate');
var boilerplate = new Boilerplate();

/**
 * Create boilerplate `blog`
 */

boilerplate.scaffold('site');
boilerplate.file('favicon', {path: 'vendor/bootstrap-blog/favicon.ico'});

// boilerplate.site.create('products');
// boilerplate.site.create('blog');
// boilerplate.site.blog.create('posts');
// boilerplate.site.blog.posts('foo', {content: 'this is content...'});
// boilerplate.site.blog.posts('../scaffolds/posts/*.hbs');


/**
 * Create boilerplate `site`
 */

boilerplate.scaffold('site');
boilerplate.site.create('blog');

boilerplate.site.blog.config({
  base: 'fixtures/scaffolds',
  renameKey: function (key) {
    return path.basename(key);
  },
  templates: {
    pages: {
      base: 'pages',
      patterns: '*.hbs',
      options: {},
    },
    posts: {
      base: 'posts',
      patterns: '*.md',
      options: {},
    },
    layouts: {
      base: 'layouts',
      patterns: '*.hbs',
      options: { viewType: 'layout' },
    },
    includes: {
      base: 'includes',
      patterns: '*.hbs',
      options: { viewType: 'partial' },
    }
  }
});

console.log(boilerplate);
