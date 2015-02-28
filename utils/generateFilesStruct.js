'use strict';

var _ = require('lodash');

module.exports = {
  generateFileStruct: generateFileStruct
};

/**
 * Recursion function for creating directory and file structure by
 * structure map json.
 *
 * @param sj {Object}
 * @param path {String}
 * @param context {Object}
 */
function generateFileStruct(sj, path, context) {
  path = path || './';

  var dirName = path + f(sj.name, {appName: context.appname});

  context.dest.mkdir(dirName);

  if (sj.files) {
    _.each(sj.files, function(fi) {
      // todo check: expected list of two elements
      var dest = dirName + '/' + f(_.first(fi), {appName: context.appname});
      var tpl = _.last(fi);  // src template name

      // set curDir value for templates
      context.curDir = _.last(dirName.split('/'));

      var tplName = _.last(tpl.split('/'));

      if (_.first(tplName) === '_') {
        context.fs.copyTpl(
          context.templatePath(tpl), context.destinationPath(dest), context);
      } else {
        context.fs.copy(
          context.templatePath(tpl), context.destinationPath(dest));
      }
    });
  }

  if (sj.dirs) {
    _.each(sj.dirs, function(d) {
      generateFileStruct(d, (dirName + '/'), context);
    });
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
