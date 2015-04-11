'use strict';

var _ = require('lodash');
var handlebars = require('handlebars');

module.exports = {
  generateFileStruct: generateFileStruct,
  addToFile: addToFile,
  f: f
};

/**
 * Recursion function for creating directory and file structure by
 * structure map json.
 *
 * @param sj {Array}
 * @param path {String}
 * @param context {Object}
 */
function generateFileStruct(sj, path, context) {

  path = path || './';

  if (sj) {
    _.each(sj, function(d) {
      _gfs(d, path, context);
    });
  }

  /**
   * ToLowerCase wrapper
   * @private
   */
  function tlc(s) {
    return s.toLowerCase();
  }

  /**
   * Private reqursion function
   * @private
   */
  function _gfs(s, p, c) {
    var dirName = p + f(s.name, c);

    c.dest.mkdir(tlc(dirName));

    if (s.files) {
      _.each(s.files, function(fi) {
        // todo check: expected list of two elements
        var dest = dirName + '/' + f(_.first(fi), c);
        var tpl = _.last(fi);  // src template name

        // set curDir value for templates
        c.curDir = _.last(dirName.split('/'));

        var tplName = _.last(tpl.split('/'));

        handlebars.registerHelper('lower', function(str) {
          return str.toLowerCase();
        });

        handlebars.registerHelper('upper', function(str) {
          return str.toLowerCase();
        });

        handlebars.registerHelper('capitalize', function(str) {
          return _.capitalize(str);
        });

        if (_.first(tplName) === '_') {
          var tplCnt = handlebars.compile(c.fs.read(c.templatePath(tpl)));
          c.fs.write(c.destinationPath(tlc(dest)), tplCnt(c));
        } else {
          c.fs.copy(
            c.templatePath(tpl), c.destinationPath(tlc(dest)));
        }
      });
    }

    if (s.dirs) {
      _.each(s.dirs, function(d) {
        _gfs(d, (dirName + '/'), c);
      });
    }
  }
}

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
  _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
  var compile = _.template(formatStr);
  return compile(options);
}

/**
 * Add to end file string. If file end without new line - set newline
 * and add new string.
 */
function addToFile(filePath, newString, storage) {
  var content = storage.read(filePath, newString);

  if(!/.*\n$/.test(content)) {
    content += '\n'; // if file end without newline
  }

  content += f('{{str}}\n', {str: newString});

  storage.write(filePath, content);
}
