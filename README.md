# js.bundle.require

Automatic JS Bundling with RequireJS and Mustache Support.

Traverses a configurable root directory for \*.js and \*.mustache files and includes all
assets in one optimized bundle.

The build process uses the following libraries:
- requirejs optimizer
- almond
- mustache
- requirejs mustache loader


### Example
```bash
$ ./node_modules/.bin/js.bundle.require
------------- includes ----------------
tpl/foo.js
tpl/foo.mustache
tpl/partials/bar.mustache
-------------- output -----------------
tpl/dist/bundle.js
tpl/dist/bundle.dev.js
```

## Install

```bash
$ npm install --save git+https://github.com/strg-at/js.bundle.require.git
$ cp ./node_modules/js.bundle.require/example.config.js build.config.js  # copy example config
$ vim build.config.js  # edit the config
```

## CLI Usage

```bash
$ ./node_modules/.bin/js.bundle.require            # create development build
$ ./node_modules/.bin/js.bundle.require --minify   # create production build
$ ./node_modules/.bin/js.bundle.require --watch    # start watcher
$ ./node_modules/.bin/js.bundle.require --verbose  # print config and build response
$ ./node_modules/.bin/js.bundle.require --exclude-almond  # exclude almond and include full requirejs instead
$ ./node_modules/.bin/js.bundle.require --config   # print config and build response
$ ./node_modules/.bin/js.bundle.require --help     # print options
$ ./node_modules/.bin/js.bundle.require --config build.config.js  # specify path to config file
```

## License

Copyright © 2015-2017 STRG.AT GmbH, Vienna, Austria

All files in and beneath this directory are part of The SCORE Framework.
The SCORE Framework and all its parts are free software: you can redistribute
them and/or modify them under the terms of the GNU Lesser General Public
License version 3 as published by the Free Software Foundation which is in the
file named COPYING.LESSER.txt.

The SCORE Framework and all its parts are distributed without any WARRANTY;
without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. For more details see the GNU Lesser General Public License.

If you have not received a copy of the GNU Lesser General Public License see
http://www.gnu.org/licenses/.

The License-Agreement realised between you as Licensee and STRG.AT GmbH as
Licenser including the issue of its valid conclusion and its pre- and
post-contractual effects is governed by the laws of Austria. Any disputes
concerning this License-Agreement including the issue of its valid conclusion
and its pre- and post-contractual effects are exclusively decided by the
competent court, in whose district STRG.AT GmbH has its registered seat, at the
discretion of STRG.AT GmbH also the competent court, in whose district the
Licensee has his registered seat, an establishment or assets.
