# scaffold [![NPM version](https://img.shields.io/npm/v/scaffold.svg?style=flat)](https://www.npmjs.com/package/scaffold) [![Build Status](https://img.shields.io/travis/jonschlinkert/scaffold.svg?style=flat)](https://travis-ci.org/jonschlinkert/scaffold)

> Conventions and API for creating declarative configuration objects for project scaffolds - similar in format to a grunt task, but more portable, generic and can be used by any build system or generator - even gulp.

[What is a scaffold?](#what-is-a-scaffold) | [gulp-scaffold-example](https://github.com/jonschlinkert/gulp-scaffold-example)

- [The goal](#the-goal)
- [Install](#install)
- [Usage](#usage)
- [Examples](#examples)
- [API](#api)
- [What is a scaffold?](#what-is-a-scaffold-)
  * [Comparison table](#comparison-table)
- [Related projects](#related-projects)
- [Tests](#tests)
  * [Test coverage](#test-coverage)
  * [Running tests](#running-tests)
- [Contributing](#contributing)
- [Author](#author)
- [License](#license)

## The goal

Mainly the following two things:

1. Make it easy to create and publish project scaffolds with reusable templates, styles, themes, data etc.
2. To uncouple these "non-moving-parts", which can easily be described using a declarative configuration, from any particular build system or generator.

_(To see the opposite of what this project hopes to achieve, take a look at a generator from [Google's Yeoman](http://yeoman.io). Yeoman is a node.js application that generates projects from "scaffolding", which includes templates, project metadata, and so on. But it does so in a way that completely couples these things with application logic, making it difficult or tedious to make the components reusable by anything but yeoman)_.

**Example**

The following scaffold "expands" into a configuration object that can be passed to [gulp](http://gulpjs.com), [grunt](http://gruntjs.com/), [assemble](https://github.com/assemble/assemble), [metalsmith](https://github.com/segmentio/metalsmith), or even [yeoman](http://yeoman.io) for scaffolding out various parts of a blog or site (like adding a new post, UI component, etc):

```js
var Scaffold = require('scaffold');
var scaffold = new Scaffold({
  posts: {
    src: 'templates/post.md',
    dest: 'blog/' 
  },
  components: {
    cwd: 'content',
    src: ['templates/*.hbs'],
    dest: 'blog/'
  }  
});
```

**Example result**

The above scaffold might expand into something like the following:

```js
{
  options: {},
  blog: {
    options: {cwd: 'blog'},
    files: [
      {
        src: ['content/post.md', 'content/about.md'],
        dest: 'src/posts/'
      },
      {
        src: ['data/ipsum.json'],
        dest: 'src/data/'
      }
    ]
  },
  components: {
    options: {cwd: 'ui'},
    files: [
      {
        options: {cwd: 'templates/layouts'},
        src: ['default.hbs', '3-column.hbs'],
        dest: 'src/templates/layouts'
      },
      {
        options: {cwd: 'templates/components'},
        src: ['button.hbs', 'modal.hbs', 'navbar.hbs'],
        dest: 'src/templates/partials'
      },
      {
        src: ['scripts/button.js'],
        dest: 'src/assets/js/'
      },
      {
        src: ['data/ipsum.json'],
        dest: 'src/assets/data/'
      }
    ]
  }
}
```

Since we're just creating an object (with zero application logic), anything can obviously be extended, overridden, etc.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install scaffold --save
```

## Usage

Create an instance of scaffold:

```js
var Scaffold = require('scaffold');
var foo = new Scaffold({
  // config/options here  
});
```

Scaffold uses [expand-target](https://github.com/jonschlinkert/expand-target) and [expand-files](https://github.com/jonschlinkert/expand-files) as dependencies. Visit those projects for the full range of available features and options:

## Examples

The following are just a few random examples of what a scaffold could be, but there are many more use cases.

**Blog posts**

Create a scaffold for adding blog posts to a project:

```js
var blog = new Scaffold({
  post: {
    cwd: 'content',
    src: 'content/post.md', 
    dest: 'src/posts/'
  }
});
```

**UI components**

Create a scaffold for adding UI components to a project:

```js
var components = new Scaffold({
  foo: {
    options: {cwd: 'scaffolds'},
    files: [
      {src: 'templates/component.hbs', dest: 'src/templates/'},
      {src: 'scripts/component.js', dest: 'src/scripts/'},
      {src: 'styles/component.css', dest: 'src/styles/'},
    ]
  }
});
```

## API

### [Scaffold](index.js#L28)

Create a new Scaffold with the given `options`

**Params**

* `options` **{Object}**

**Example**

```js
var scaffold = new Scaffold({cwd: 'src'});
scaffold.addTargets({
  site: {src: ['*.hbs']},
  blog: {src: ['*.md']}
});
```

### [.isScaffold](index.js#L68)

Static method, returns `true` if the given value is an instance of `Scaffold` or appears to be a valid `scaffold` configuration object.

**Params**

* `val` **{Object}**: The value to check
* `returns` **{Boolean}**

**Example**

```js
Scaffold.isScaffold({});
//=> false

var blog = new Scaffold({
  post: {
    src: 'content/post.md',
    dest: 'src/posts/'
  }
});
Scaffold.isScaffold(blog);
//=> true
```

### [.addTargets](index.js#L87)

Add targets to the scaffold, while also normalizing src-dest mappings and expanding glob patterns in each target.

**Params**

* `scaffold` **{Object}**: Scaffold object with targets, `options`, or arbitrary properties.
* `returns` **{Object}**

**Example**

```js
scaffold.addTargets({
  site: {src: '*.hbs', dest: 'templates/'},
  docs: {src: '*.md', dest: 'content/'}
});
```

### [.addTarget](index.js#L127)

Add a single target to the scaffold, while also normalizing src-dest mappings and expanding glob patterns in the target.

**Params**

* `name` **{String}**
* `config` **{Object}**
* `returns` **{Object}**

**Example**

```js
scaffold.addTarget('foo', {
  src: 'templates/*.hbs',
  dest: 'site'
});

// other configurations are possible
scaffold.addTarget('foo', {
  options: {cwd: 'templates'}
  files: [
    {src: '*.hbs', dest: 'site'},
    {src: '*.md', dest: 'site'}
  ]
});
```

## What is a scaffold?

A scaffold consists of one or more templates or source files and serves as a "temporary support structure" that may be used to initialize a new project, or to provide ad-hoc "components" throughout the duration of a project.

**What does this project do?**

Given the above definition, this project provides an API for creating configuration objects with various details about a scaffold, such as source file paths or glob patterns, destination paths, default settings, and so on.

The resulting object could be described as a "scaffold configuration" or "scaffold manifest".

### Comparison table

The following table describes the difference between boilerplates, scaffolds and templates.

| **type** | **description** |
| --- | --- |
| [template](https://github.com/jonschlinkert/templates) | Resuable file, code or content which contains "placeholder" values that will eventually be replaced with real values by a rendering (template) engine |
| [scaffold](#scaffold) | Consists of one or more templates or source files and serves as a "temporary support structure" that may be used to initialize a new project, or to provide ad-hoc "components" throughout the duration of a project. |
| [boilerplate](https://github.com/boilerplates) | Boilerplates consist of all of the necessary files required to initialize a complete project. |

## Related projects

* [assemble](https://www.npmjs.com/package/assemble): Assemble is a powerful, extendable and easy to use static site generator for node.js. Used… [more](https://www.npmjs.com/package/assemble) | [homepage](https://github.com/assemble/assemble)
* [boilerplate](https://www.npmjs.com/package/boilerplate): Tools and conventions for authoring and publishing boilerplates that can be generated by any build… [more](https://www.npmjs.com/package/boilerplate) | [homepage](http://boilerplates.io)
* [generate](https://www.npmjs.com/package/generate): Fast, composable, highly extendable project generator with a user-friendly and expressive API. | [homepage](https://github.com/generate/generate)
* [templates](https://www.npmjs.com/package/templates): System for creating and managing template collections, and rendering templates with any node.js template engine.… [more](https://www.npmjs.com/package/templates) | [homepage](https://github.com/jonschlinkert/templates)
* [update](https://www.npmjs.com/package/update): Easily keep anything in your project up-to-date by installing the updaters you want to use… [more](https://www.npmjs.com/package/update) | [homepage](https://github.com/update/update)
* [verb](https://www.npmjs.com/package/verb): Documentation generator for GitHub projects. Verb is extremely powerful, easy to use, and is used… [more](https://www.npmjs.com/package/verb) | [homepage](https://github.com/verbose/verb)

## Tests

### Test coverage

As of May 11, 2016:

```
Statements   : 100% (29/29)
Branches     : 100% (18/18)
Functions    : 100% (3/3)
Lines        : 100% (28/28)
```

### Running tests

Install dev dependencies:

```sh
$ npm install -d && npm test
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/jonschlinkert/scaffold/issues/new).

## Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright © 2016, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT license](https://github.com/jonschlinkert/scaffold/blob/master/LICENSE).

***

_This file was generated by [verb](https://github.com/verbose/verb), v0.9.0, on May 11, 2016._