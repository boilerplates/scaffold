# scaffold [![NPM version](https://img.shields.io/npm/v/scaffold.svg?style=flat)](https://www.npmjs.com/package/scaffold) [![NPM downloads](https://img.shields.io/npm/dm/scaffold.svg?style=flat)](https://npmjs.org/package/scaffold) [![Build Status](https://img.shields.io/travis/jonschlinkert/scaffold.svg?style=flat)](https://travis-ci.org/jonschlinkert/scaffold)

Conventions and API for creating declarative configuration objects for project scaffolds - similar in format to a grunt task, but more portable, generic and can be used by any build system or generator - even gulp.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save scaffold
```

[What is a scaffold?](#comparison-table) | [gulp-scaffold-example](https://github.com/jonschlinkert/gulp-scaffold-example)

The following scaffold expands into a configuration object that can be passed to [gulp](http://gulpjs.com), [grunt](http://gruntjs.com/), [assemble](https://github.com/assemble/assemble), [metalsmith](https://github.com/segmentio/metalsmith), or even [yeoman](http://yeoman.io) for scaffolding out various parts of a blog or site (like adding a new post, UI component, etc):

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
$ npm install --save scaffold
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

### [.isScaffold](index.js#L81)

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

### [.addTargets](index.js#L100)

Add targets to the scaffold, while also normalizing src-dest mappings and expanding glob patterns in each target.

**Params**

* `targets` **{Object}**: Object of targets, `options`, or arbitrary properties.
* `returns` **{Object}**

**Example**

```js
scaffold.addTargets({
  site: {src: '*.hbs', dest: 'templates/'},
  docs: {src: '*.md', dest: 'content/'}
});
```

### [.addTarget](index.js#L145)

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

### [.Target](index.js#L183)

Getter/setter for the `Target` constructor to use for creating new targets.

* `returns` **{Function}**: Returns the `Target` constructor to use for creating new targets.

**Example**

```js
var Target = scaffold.get('Target');
var target = new Target();
```

### [.name](index.js#L219)

Getter/setter for `scaffold.name`. The `name` property can be set on the options or directly on the instance.

* `returns` **{Function}**: Returns the `Target` constructor to use for creating new targets.

**Example**

```js
var scaffold = new Scaffold({name: 'foo'});
console.log(scaffold.name);
//=> 'foo'

// or
var scaffold = new Scaffold();
scaffold.options.name = 'bar';
console.log(scaffold.name);
//=> 'bar'

// or
var scaffold = new Scaffold();
scaffold.name = 'baz';
console.log(scaffold.name);
//=> 'baz'
```

### Comparison table

Many definitions exist for the terms "boilerplate", "scaffold" and "template". The following definitions describe these concepts as it relates to this project.

| **type** | **description** | 
| --- | --- |
| [template](https://github.com/jonschlinkert/templates) | Resuable file, code or content which contains "placeholder" values that will eventually be replaced with real values by a rendering (template) engine |
| [scaffold](#scaffold) | Consists of one or more templates or source files and serves as a "temporary support structure" that may be used to initialize a new project, or to provide ad-hoc "components" throughout the duration of a project. |
| [boilerplate](https://github.com/boilerplates) | Boilerplates consist of all of the necessary files required to initialize a complete project. |

## History

**v0.3.0**

* **breaking change**: targets are now stored on the `targets` object
* **feature**: now emits `files` when a files object is expanded.

## Related projects

You might also be interested in these projects:

* [assemble](https://www.npmjs.com/package/assemble): Assemble is a powerful, extendable and easy to use static site generator for node.js. Used… [more](https://github.com/assemble/assemble) | [homepage](https://github.com/assemble/assemble "Assemble is a powerful, extendable and easy to use static site generator for node.js. Used by thousands of projects for much more than building websites, Assemble is also used for creating themes, scaffolds, boilerplates, e-books, UI components, API docum")
* [boilerplate](https://www.npmjs.com/package/boilerplate): Tools and conventions for authoring and publishing boilerplates that can be generated by any build… [more](https://github.com/jonschlinkert/boilerplate) | [homepage](https://github.com/jonschlinkert/boilerplate "Tools and conventions for authoring and publishing boilerplates that can be generated by any build system or generator.")
* [generate](https://www.npmjs.com/package/generate): The Santa Claus machine for GitHub projects. Scaffolds out new projects, or creates any kind… [more](https://github.com/generate/generate) | [homepage](https://github.com/generate/generate "The Santa Claus machine for GitHub projects. Scaffolds out new projects, or creates any kind of required file or document from any given templates or source materials.")
* [templates](https://www.npmjs.com/package/templates): System for creating and managing template collections, and rendering templates with any node.js template engine… [more](https://github.com/jonschlinkert/templates) | [homepage](https://github.com/jonschlinkert/templates "System for creating and managing template collections, and rendering templates with any node.js template engine. Can be used as the basis for creating a static site generator or blog framework.")
* [update](https://www.npmjs.com/package/update): Easily keep anything in your project up-to-date by installing the updaters you want to use… [more](https://github.com/update/update) | [homepage](https://github.com/update/update "Easily keep anything in your project up-to-date by installing the updaters you want to use and running `update` in the command line! Update the copyright date, licence type, ensure that a project uses your latest eslint or jshint configuration, remove dep")
* [verb](https://www.npmjs.com/package/verb): Documentation generator for GitHub projects. Verb is extremely powerful, easy to use, and is used… [more](https://github.com/verbose/verb) | [homepage](https://github.com/verbose/verb "Documentation generator for GitHub projects. Verb is extremely powerful, easy to use, and is used on hundreds of projects of all sizes to generate everything from API docs to readmes.")

## Contributing

This document was generated by [verb-readme-generator](https://github.com/verbose/verb-readme-generator) (a [verb](https://github.com/verbose/verb) generator), please don't edit directly. Any changes to the readme must be made in [.verb.md](.verb.md). See [Building Docs](#building-docs).

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

Or visit the [verb-readme-generator](https://github.com/verbose/verb-readme-generator) project to submit bug reports or pull requests for the readme layout template.

## Building docs

_(This document was generated by [verb-readme-generator](https://github.com/verbose/verb-readme-generator) (a [verb](https://github.com/verbose/verb) generator), please don't edit the readme directly. Any changes to the readme must be made in [.verb.md](.verb.md).)_

Generate readme and API documentation with [verb](https://github.com/verbose/verb):

```sh
$ npm install -g verb verb-readme-generator && verb
```

## Running tests

Install dev dependencies:

```sh
$ npm install -d && npm test
```

## Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright © 2016, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT license](https://github.com/jonschlinkert/scaffold/blob/master/LICENSE).

***

_This file was generated by [verb](https://github.com/verbose/verb), v0.9.0, on June 26, 2016._