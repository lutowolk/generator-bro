'use strict';

var _ = require('lodash');
var path = require('path');
var colors = require('colors');
var format = require('util').format;
var yeoman = require('yeoman-generator');
var handlebars = require('../../utils/handlebars');

module.exports = yeoman.generators.Base.extend({
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