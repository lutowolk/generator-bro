'use strict';

var _ = require('lodash');
var handlebars = require('handlebars');

module.exports = {
  generateFileStruct: generateFileStruct
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
 * @deprecated
 *
 * Get formating string and params and return result string.
 *
 * Usage:
 *
 * f('I'm {age} years old', {age: 10})
 *
 * @param tpl {String}
 * @param opts {Object}
 * @returns {String}
 * @private
 */
function f(tpl, opts) {
  _.each(_.keys(opts), function (opt){
    tpl = tpl.replace('{'+opt+'}', opts[opt]);
  }); return tpl;
}
