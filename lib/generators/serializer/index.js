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
      desc: 'App name and model name in next format: app:ModelName',
      type: String, required: true
    });
  },

  _setOptions: function () {
    this.option('view', {
      desc: 'File for view (file name only)',
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
    return {
      apps: this.config.get('apps'),
      app: path.join(this.config.get('apps'), this.appName),
      appName: this.appName,
      modelName: this.modelName
    };
  },

  creating: {
    // serializersInit.py
    serializersInit: {
      src: 'init.py',
      dst: '{{app}}/serializers/__init__.py',
      isRun: function(self, src, dst) {
        return !fs.existsSync(dst);
      }
    },

    // serializers/model_name.py
    serializer: {
      src: '_serializer.py',
      dst: '{{app}}/serializers/{{lower modelName}}.py'
    },

    // serializers/__init__.py
    serializerInit: {
      dst: '{{app}}/serializers/__init__.py',
      replacement: function (self, content, src, dst, context) {
        var imports = [
            f('from {{apps}}.{{app}}.serializers.{{lower modelName}} ' +
            'import {{modelName}}Serializer', context)
        ];
        return self.includeImports(imports, content, dst);
      }
    }
  }
};

module.exports = helpers.extendOf(gHelper, core, selfGenerator);
