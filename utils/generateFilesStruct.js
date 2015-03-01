'use strict';

var _ = require('lodash');

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
   * Private reqursion function
   * @private
   */
  function _gfs(s, p, c) {
    var dirName = p + f(s.name, {appName: c.appname});

    c.dest.mkdir(dirName);

    if (s.files) {
      _.each(s.files, function(fi) {
        // todo check: expected list of two elements
        var dest = dirName + '/' + f(_.first(fi), {appName: c.appname});
        var tpl = _.last(fi);  // src template name

        // set curDir value for templates
        c.curDir = _.last(dirName.split('/'));

        var tplName = _.last(tpl.split('/'));

        if (_.first(tplName) === '_') {
          c.fs.copyTpl(
            c.templatePath(tpl), c.destinationPath(dest), c);
        } else {
          c.fs.copy(
            c.templatePath(tpl), c.destinationPath(dest));
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
