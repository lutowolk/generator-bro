'use strict';

var _ = require('lodash');
var path = require('path');
var colors = require('colors');
var format = require('util').format;
var yeoman = require('yeoman-generator');
var handlebars = require('../utils/handlebars');

module.exports = yeoman.generators.Base.extend({
  /**
   * Recursion function for creating directories and files from list of dirs.
   * Context need for compiled file templates with handlebars.
   *
   * @param listDirs {Array}
   * @param path {String}
   * @param context {Object}
   */
  createFilesFromJson: function (listDirs, path, context) {
    var self = this;

    path = path || './';

    if (!listDirs) {
      return false;
    }

    _.each(listDirs, createFilesForDir);

    ///////////////

    function createFilesForDir(dir) {
      _createFilesFromJson(dir, path);
    }

    /**
     * Private recursion function
     * @private
     */
    function _createFilesFromJson(dir, path) {
      var dirName = path + f(dir.name, context);

      self.dest.mkdir(dirName.toLowerCase());

      if (dir.files) {
        _.each(dir.files, copyFile);
      }

      if (dir.dirs) {
        _.each(dir.dirs, function(d) {
          _createFilesFromJson(d, (dirName + '/'));
        });
      }

      function copyFile(file) {
        if (file.length !== 2) {
          throw Error(
            'Invalid format json file. Arg file must be list from 2 elements');
        }

        var dstFilePath = self
            .destinationPath(path.join(dirName, f(_.first(file), context))
              .toLowerCase());
        var srcFilePath = self
            .templatePath(_.last(file));  // src template name

        // add to context current directory
        context.curDir = _.last(dirName.split('/'));

        var isTemplate = _.first(
          _.last(srcFilePath.split('/'))) === '_';

        if (isTemplate) {
          var compiled = handlebars
            .compile(self.fs.read(srcFilePath));

          self.fs.write(
            dstFilePath, compiled(context));
        } else {
          self.fs.copy(
            srcFilePath, dstFilePath);
        }
      }
    }
  },
  copyTpl: function (from, to, context) {
    var srcContent = this.fs.read(from);
    var compileContent = handlebars.compile(srcContent);
    this.fs.write(to, compileContent(context));
  },
  error: function(message) {
    this.log(format('%s %s', colors.red('Error!'), message));
    process.exit(1);
  },
  warning: function(message) {
    this.log(format('%s %s', colors.yellow('Warning!'), message));
  },
  includeImports: function (imports, content, file) {
    if (!/((from|import).*)/.test(content)) {
      // todo improve algorithm for insert imports

      this.warning(format(
          'Did not find where to insert imports, do this manually: ' +
          '\n%s~~~%s\n~~~', file + '\n' || '', imports));

      return content;
    }

    _.forEach(imports, includeImport);

    return content;

    function includeImport(i) {
      var isFrom = i
        .indexOf('from') !== -1;
      var spliting = i
        .split('import');
      var path = _
        .first(spliting)
        .replace('from', '')
        .trim();
      var objs = _
        .chain(_.last(spliting).split(','))
        .map(_.trim)
        .filter(checkImport)
        .value();

      if(!objs.length) {
        return content;
      }

      var importString = isFrom ? format('\nfrom %s ', path) : '\n';
      importString += format('import %s', objs.join(', '));

      content = content
        .replace(/((from|import).+)/, '$1' + importString);

      function checkImport(im) {
        var importPattern = new RegExp(format('import\\s+.*?%s', im));
        return !importPattern.test(content);
      }
    }
  },
  getClassBody: function (name, content) {
    return _.first(content.match(new RegExp(format(
      '(class %s\\(.*?\\):(\n\\s{4}.*)+)', name))));
  },
  getMethodBody: function (name, content) {
    return _.first(content.match(new RegExp(format(
        '(def %s\\(.*?\\):(\n\\s{8}.*)+)', name))));
  },
  getModelFields: function (name, content) {
    var classBody = this.getClassBody(name, content);

    return _
        .chain(classBody.match(/^\s{4}([a-z0-9_]+)\s*=\s*[\w\d_.]+\(/gm))
        .map(prepareField)
        .value();

    function prepareField(field) {
      return _.trim(_.first(field.split('=')));
    }
  },
  getClassMethods: function (name, content) {
    var classBody = this.getClassBody(name, content);

    return _
        .chain(classBody.match(/\s{4}def\s+(\w+)/g))
        .map(prepareMethod)
        .value();

    function prepareMethod(method) {
      return _.trim(method.replace('def', ''));
    }
  }
});