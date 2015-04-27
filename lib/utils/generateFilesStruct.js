'use strict';

var _ = require('lodash');
var fs = require('fs');
var colors = require('colors');
var handlebars = require('./handlebars');

module.exports = {
  generateFileStruct: generateFileStruct,
  addToFile: addToFile,
  f: f,
  writeToFile: writeToFile
};

/**
 * Wrapper on lodash template method.
 *
 * Usage:
 *
 * f('I am {{age}} years old', {age: 10})
 *
 * @param formatStr {String}
 * @param options {Object}
 * @returns {String}
 * @private
 */
function f(formatStr, options) {
  var compile = handlebars.compile(formatStr);
  return compile(options);
}

/**
 * Add to end file string. If file end without new line - set newline
 * and add new string.
 */
function addToFile(filePath, newString, context, log) {
  log = log === undefined ? true : log;

  var content = context.fs.read(filePath);

  if(content.indexOf(newString) > -1) {
    return false; // this string already exists
  }

  if(!/.*\n$/.test(content)) {
    content += '\n'; // if file end without newline
  }

  content += f('{{str}}\n', {str: newString});

  writeToFile(filePath, content, log);
}

/**
 * Write to file without mem-fs usage. To modify existing
 * files with force.
 *
 * @param path {String}
 * @param content {String}
 * @param log {Boolean}
 */
function writeToFile(path, content, log) {
  fs.writeFileSync(path, content);

  if (log) {
    console.log(f('   {{change}} {{path}}',
      {change: colors.yellow('change'), path: path}));
  }
}
