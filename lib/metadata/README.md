# Metadata

## Basic metadata file

A basic metadata file contains the following properties. These properties are also valid `package.json` properties which means that `package.json` files may be valid basic metadata files.

- `name` *required* String specifying the name of the project or repository this metadata file is used in.
- `description` Optional description of the project or repository
- `version` *required* The version or branch of the metadata file. (*defaults to `0.1.0`*)
- `homepage` Optional homepage where additional information about the project or repository may be found.
- `repository` Optional repository where the metadata file and additional files may live.
- `author` Optional author of the project or repository. This may be an array for `authors`.
- `license` Optional license (*defaults to `MIT`*)
- `files` Optional files array. These are files the metadata file *knows* about. ([more below](#files))
- `dependencies` Optional dependency hash. These are other projects/repositories that contain metadata files. ([more below](#dependencies))

*Example*

```js
{
  "name": "my-project",
  "description": "Description about my project",
  "version": "0.1.0",
  "homepage": "https://github.com/doowb/my-project",
  "repository": "doowb/my-project",
  "author": "Brian Woodward (https://github.com/doowb)"
  "license": "MIT",
  "files": [
    "docs/installing.md",
    "docs/contributing.md"
  ],
  "dependencies": {
    "doowb/another-project": "docs"
  },
}
```

----


### Files

The `files` array lists out files that this metadata file should *know* about. This means that, without any additional plugins, a basic metadata file my describe the files that should be included when downloading/installing this project or repository.

Metadata resolvers will provide an installer that determines where the files are pulled from. ([more below](#resolvers))

----


### Dependencies

The `dependencies` hash lists where other projects or repositories may be that the current metadata depends on. These allow composing large groups of files from many smaller groups of files.

Metadata resolvers will provide an installer that determines where dependencies are found and how they're installed. ([more below](#resolvers))

----


### Resolvers

Resolvers are custom functions that determine if they know how to find a metadata file and it's files. A resolver is a function that takes three (3) parameters `name`, `version`, and `callback` and returns a valid [installer](#installers) if it knows how to handle the name and version.

```js
function resolver(name, version, callback) {
  if (name === 'doowb/test' && version === 'fake') {
    return callback(null, fakeInstaller);
  }
  return callback();
};
```

Resolvers are async to allow lookups from remote resources (e.g. github, npm, custom database, custom url endpoint).
Resolvers are run based on the order they're registered and the first one that's able to *handle* a request is used.

Basic logic in metadata will call a `.resolve` method for each dependency found in a metadata file to determine how that dependency should resolve. This allows mixing dependencies that may come from different sources. (e.g. github, npm). ([see default resolvers](#defaults))

----


### Installers

Installers are custom functions that are returned from a resolver. These may be used to *install* the files listed in a metadata file. An installer is a function that takes three (3) parameters `files`, `destBase`, and `callback`.

- `files` Array of files to install.
- `destBase` Optional destination directory to install files to. Installer determines the default when not provided.
- `callback` Called when errors occur or when finished installing. Should return a location of where the files are installed.

```js
function fakeInstaller(files, destBase, callback) {
  if (typeof destBase === 'function') {
    callback = destBase;
    destBase = '';
  }
  destBase = destBase || path.join(process.cwd(), 'fakes');
  files.forEach(function(file) {
    fs.writeFileSync(path.join(destBase, file), 'a fake file for ' + file);
  });
  callback(null, destBase);
}
```

----


### Defaults

#### Resolvers

- github:

  The default github resolver will handle resolving a dependency `name` in the format of `{user}/{repo}` and `version` that is a valid `tag` or `branch` on the specified repository. Optionally, the name of the metadata file to use may be appended to the `version` with a colon (`:`). (e.g. `doowb/my-project#dev:package.json`)

- npm:

  The default npm resolver will handle resolving a dependency `name` in the format of `{package_name}` and `version` that is published to `npm`. Optionally, the name of the metadata file to use may be appended to the `version` with a colon (`:`). (e.g. `my-project@0.1.0:package.json`).

#### Installers

- github:

  The default github installer will use the resolved github url as the `cwd` and download files from `path.join(cwd, filepath)` and install them to `destBase`.

  The following will result in the `installing.md` and `contributing.md` files being downloaded from `https://raw.githubusercontent.com/doowb/my-project/dev` to the `docs` folder in the current working directory.

```js
metadata.resolve('doowb/my-project', 'dev', function (err, installer) {
  if (err) return console.error(err);
  if (!installer) {
    return console.error('Cannot find an installer.');
  }
  installer(['docs/installing.md', 'docs/contributing.md'], function (err) {
    if (err) return console.error(err);
    console.log('docs installed');
  });
});
```

- npm:

  The default npm installer will install files from npm packages based on where they're already installed. If an npm package with matching version has been installed to local or global `node_modules`, the files will be installed from the found location. Otherwise, the npm package tarball will be downloaded and extracted. Then the files will be installed from the temporary location to the specified destination.
