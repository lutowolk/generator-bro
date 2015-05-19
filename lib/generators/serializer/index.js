'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var format = require('util').format;
var colors = require('colors');
var yeoman = require('yeoman-generator');
var handlebars = require('../../utils/handlebars');
var generateFilesStruct = require('../../utils/generateFilesStruct');
var f = generateFilesStruct.f;
var helpers = require('../../core/helpers');
var core = require('../../core/generators/core');
var gHelper = require('../../core/generators/helper');

var selfGenerator = {
  _setArguments: function () {
    this.argument('appModelName', {
      desc: 'App name and model name in next format: app.ModelName',
      type: String, required: true
    });
  },

  _setOptions: function () {
    this.option('file', {
      desc: 'File where you want create serializer relatively this app.',
      type: String});
  },

  _afterInit: function () {
    var appModelName = this.appModelName.split('.');

    if (appModelName.length !== 2) {
      this.error('Argument appModelName invalid.');
    }

    this.appName = _.first(appModelName);
    this.modelName = _.last(appModelName);
  },

  _setContext: function() {
    var pyApp = this.config.get('pyApps') + '.' + this.appName;
    var serializerPyPath = format('serializers.%s', this.modelName);

    if (this.opts.file) {
      serializerPyPath = this.opts.file
          .replace(/\//g, '.')
          .replace(/\.py$/, '');
    }

    return {
      apps: this.config.get('apps'),
      pyApps: this.config.get('pyApps'),
      app: path.join(this.config.get('apps'), this.appName),
      pyApp: pyApp,
      serializer: pyApp + '.' + serializerPyPath,
      appName: this.appName,
      modelName: this.modelName
    };
  },

  creating: {
    // serializersInit.py
    serializersInit: {
      src: 'init.py',
      dst: '{{app}}/serializers/__init__.py',
      replacement: function (self, content, src, dst, context) {
        var imports = [
          f('from {{lower serializer}} ' +
          'import {{modelName}}Serializer', context)];
        return self.includeImports(imports, content, dst);
      }
    },

    // serializers/model_name.py
    serializer: {
      src: '_serializer.py',
      dst: '{{app}}/{{path}}',
      replacement: function (self, content, src, dst, context) {
        var serializerCode = f(
            self.fs.read(self.templatePath('_serializer_item.py')), context);

        var imports = [
          'from rest_framework import serializers',
          f('from {{pyApp}}.models.{{lower modelName}} import {{modelName}}', context)];

        return self.includeImports(imports, content, dst) + serializerCode;
      },
      context: function (self, globalContext) {
        return {
          path: self.opts.file ||
            f('serializers/{{lower modelName}}.py', globalContext)
        };
      }
    }
  }
};

module.exports = helpers.extendOf(gHelper, core, selfGenerator);
