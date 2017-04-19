#!/usr/bin/env node
const DIR = process.cwd();

/*
 * Imports
 */
const argv = require('minimist')(process.argv.slice(2));
const _ = require('lodash');
const requirejs = require('requirejs');
const chokidar = require('chokidar');
const Path = require('path');

const ARGV = [
    'w', 'watch',
    'm', 'minify',
    'v', 'verbose',
    'n', 'no-source-urls',
    'c', 'config',
    'h', 'help'
];

/*
 * Parse CLI options
 */
if (argv.help || argv.h) {
    require('./help');
    return;
}
const configFile = argv.config || argv.c;
const options = (configFile) ?
    require(Path.resolve(DIR, configFile)) :
    require(Path.resolve(DIR, 'build.config.js'));
const watch = argv.watch || argv.w || false;
const minify = argv.minify || argv.m || false;
const verbose = argv.verbose || argv.v || false;
const noSourceUrls = argv['no-source-urls'] || argv.n || false;

/*
 * Constants and additional config
 */
const IGNORE = new RegExp('(%s)'.replace('%s',
    [options.out, options.outDev].join('|')));
const BASEDIR = options.baseDir;
const FILE_TYPES = options.fileTypes;
const FILE_TYPES_REGEX = new RegExp('\\.(%s)$'
    .replace('%s', FILE_TYPES.join('|')));
const FILES = BASEDIR + '/**/*.(%s)'.replace('%s',
    FILE_TYPES.join('|'));
const DEBOUNCE = 100;
const OUT_FILE = (minify) ? options.out : options.outDev;

function validateArgv(argv) {
    const invalids = _(argv).keys().reduce((result, k) => {
        if (!_(['_'].concat(ARGV)).includes(k)) {
            result.push(k);
        }
        return result;
    }, []);
    if (invalids.length > 0) {
        console.error('Error: Unrecognized arguments: ' + invalids.join(', '));
        throw new TypeError('Unrecognized arguments');
    }
}
validateArgv(argv);
/*
 * Base Config for RequireJS Optimizer
 */
function config(paths) {
    return {
        baseUrl: options.baseDir,
        mainConfigFile: options.mainConfigFile,
        out: OUT_FILE,
        name: '../node_modules/almond/almond',
        findNestedDependencies: true,
        optimize: (minify) ? 'uglify' : 'none',
        useSourceUrl: !minify && !noSourceUrls,
        mustache: {
            resolve: function (name) {
                return name + '.mustache';
            }
        },
        paths: {
            'lib/template':
                '../node_modules/requirejs-mustache-loader/lib/template',
            'template': '../node_modules/requirejs-mustache-loader/index',
            'text': '../node_modules/text/text',
            'mustache': '../node_modules/mustache/mustache'
        },
        stubModules: ['text', 'lib/template'],
        include: [].concat(paths)
    };
}
/*
 * Watcher Singleton
 * File-collector and asynchronous Build-Hub
 */
const watcher = chokidar.watch(FILES, {
    ignored: IGNORE,
    ignoreInitial: false,
    persistent: watch,
    atomic: 100,
    cwd: '.'
});

/*
 * Helpers
 */
function stripBase(path) {
    return path.replace(/^tpl\//, '');
}

function stripJSExtension(path) {
    if (/\.mustache$/.test(path)) {
        return 'template!' + stripBase(path);
    }
    return path.replace(/\.js$/, '');
}

function toPathList(watched) {
    return _(watched).reduce((result, files, dir) => {
        const paths = files.filter((file) =>
            FILE_TYPES_REGEX.test(file)
        ).reduce((result, file) => {
            result.push(dir + '/' + file);
            return result;
        }, [])
            .map(stripBase)
            .map(stripJSExtension);
        if (paths.length) return result.concat(paths);
        return result;
    }, []).sort();
}

/*
 * Bundling
 */

function logBuildResponse(buildResponse, stamp) {
    if (verbose) {
        console.log(buildResponse);
    }
    console.log('\x1b[32m' + 'Bundling complete:' + '\x1b[0m',
        (new Date().getTime() - stamp) / 1000 + 's');
}

function logBuildError(err) {
    console.error('\x1b[31m' + 'Build failed.', '\x1b[0m');
    if (watch) console.error(err.originalError);
}

function bundle(config) {
    const stamp = new Date().getTime();
    if (!watch) console.log('Bundling started.');
    if (verbose) console.log(config);
    // Call optimize without error callback. Otherwise
    // the optimizer catches all exceptions and the script 
    // exits with 0 instead of 1
    if (!watch) {
        return requirejs.optimize(config, (buildResponse) => 
            logBuildResponse(buildResponse, stamp));
    }
    return requirejs.optimize(config, (buildResponse) => 
        logBuildResponse(buildResponse, stamp), logBuildError);
}

/*
 * Initialize
 */
watcher.on('ready', () => {
    const makeBundle = _.debounce(() => {
        bundle(
            config(
                toPathList(watcher.getWatched())
            )
        );
    }, DEBOUNCE);
    if (watch) {
        console.log('Watcher started.');
        watcher.on('all', (event, path) => {
            switch (event) {
                case 'add':
                    console.log('Add file:', path);
                    makeBundle();
                    break;
                case 'change':
                    makeBundle();
                    break;
                case 'unlink':
                    console.log('Remove file:', path);
                    makeBundle();
                    break;
            }
        });
    }
    makeBundle();
});
