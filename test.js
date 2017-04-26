#!/usr/bin/env node
// Copyright © 2015-2017 STRG.AT GmbH, Vienna, Austria
//
// This file is part of the The SCORE Framework.
//
// The SCORE Framework and all its parts are free software: you can redistribute
// them and/or modify them under the terms of the GNU Lesser General Public
// License version 3 as published by the Free Software Foundation which is in the
// file named COPYING.LESSER.txt.
//
// The SCORE Framework and all its parts are distributed without any WARRANTY;
// without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. For more details see the GNU Lesser General Public
// License.
//
// If you have not received a copy of the GNU Lesser General Public License see
// http://www.gnu.org/licenses/.
//
// The License-Agreement realised between you as Licensee and STRG.AT GmbH as
// Licenser including the issue of its valid conclusion and its pre- and
// post-contractual effects is governed by the laws of Austria. Any disputes
// concerning this License-Agreement including the issue of its valid conclusion
// and its pre- and post-contractual effects are exclusively decided by the
// competent court, in whose district STRG.AT GmbH has its registered seat, at
// the discretion of STRG.AT GmbH also the competent court, in whose district the
// Licensee has his registered seat, an establishment or assets.

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
