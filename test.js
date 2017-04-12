#!/usr/bin/env node
const DIR = process.cwd();

const CLIEngine = require("eslint").CLIEngine;
const Path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const configFile = argv.config || argv.c || 'build.config.js';
const options = require(Path.resolve(DIR, configFile));
const BUNDLE = Path.resolve(Path.dirname(configFile), options.out);

const cli = new CLIEngine({
    envs: ["browser", "mocha"],
    fix: false, // difference from last example
    useEslintrc: false
});

const report = cli.executeOnFiles([BUNDLE]);
if (report.results.length < 1) {
    throw new Error(`\x1b[31mMissing file:\x1b[0m ${BUNDLE}`);
} else if (report.errorCount > 0) {
    console.error('\x1b[31mError: Test failed.\x1b[0m');
    report.results.forEach((result) => {
        result.messages.forEach((msg) => {
            console.error(`${msg.message} at '${msg.source}'`);
        });
    });
    throw new Error(`Test failed with ${report.errorCount} Errors`);
}

console.log(`\x1b[32mTest passed.\x1b[0m \n` +
    `${report.errorCount} Errors ` +
    `${report.warningCount} Warnings\nFile: ${BUNDLE}`);
