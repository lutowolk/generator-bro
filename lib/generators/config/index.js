'use strict';

var fs = require('fs-extra');
var _ = require('lodash');
var path = require('path');
var format = require('util').format;
var colors = require('colors');
var yeoman = require('yeoman-generator');
var handlebars = require('../../utils/handlebars');
var generateFilesStruct = require('../../utils/generateFilesStruct');
var gfs = generateFilesStruct.generateFileStruct;
var f = generateFilesStruct.f;
var Core = require('../../core/core');

module.exports = Core.extend({
  constructor: function () {
    yeoman.Base.apply(this, arguments);

    // options
    this.option('apps', {
      desc: 'Path to apps directory (relative to the root directory)',
      type: String});

    this.option('urls', {
      desc: 'Path to root url conf (relative to the root directory)',
      type: String});

    this.option('settings', {
      desc: 'Path to project settings directory (relative to the root directory)',
      type: String});

    this.option('templates', {
      desc: 'Path to templates directory (relative to the root directory)',
      type: String});
  },

  prompting: function () {
    var self = this;
    var done = this.async();
    var prompts = [{
      type: 'input',
      name: 'apps',
      message: 'Path to apps directory',
      default: 'apps',
      validate: validateDir,
      store: true
    }, {
      type: 'input',
      name: 'urls',
      message: 'Path to root url conf file',
      default: 'config/urls.py',
      validate: validateFile,
      store: true
    }, {
      type: 'input',
      name: 'settings',
      message: 'Path to project settings directory',
      default: 'config/settings',
      validate: validateDir,
      store: true
    }, {
      type: 'input',
      name: 'templates',
      message: 'Path to templates directory (may be empty)',
      store: true
    }];

    prompts = _.filter(prompts, function(prompt){
      return !self.options[prompt.name];
    });

    this.prompt(prompts, function (answers) {
      this.answers = answers;
      done();
    }.bind(this));

    function validateDir(path) {
      return (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) ||
          format('Dir ./%s not found', path);
    }

    function validateFile(path) {
      return (fs.existsSync(path) && fs.lstatSync(path).isFile()) ||
          format('File ./%s not found', path);
    }
  },

  initializing: {
    parseOpts: function () {
      this.apps = this.options.apps || this.answers.apps;
      this.urls = this.options.urls || this.answers.urls;
      this.settings = this.options.settings || this.answers.settings;
      this.templates = this.options.templates || this.answers.templates;
    }
  },

  context: function() {
    return {
      apps: this.apps,
      urls: this.urls,
      settings: this.settings,
      templates: this.templates
    };
  },

  writing: function() {
    this._writing();
  },

  creating: {
    //settings/installed_apps.py
    installedApps: {
      src: 'installed_apps.py',
      dst: '{{settings}}/installed_apps.py',
      isRun: function(self, src, dst, context) {
        return fs.existsSync(path.dirname(dst));
      }
    },

    //settings/__init__.py
    settingsInit: {
      dst: '{{settings}}/__init__.py',
      isRun: function(self, src, dst, context) {
        return fs.existsSync(dst);
      },
      replacement: function(self, content, src, dst) {
        var imports = [
          'from installed_apps import INSTALLED_APPS'
        ];
        return self.includeImports(imports, content, dst);
      }
    },

    // .yo-rc.json
    yoRc: {
      src: '_yo-rc.json',
      dst: '.yo-rc.json',
      isRun: function (self, src, dst, context) {
        return fs.existsSync(self.apps) &&
            fs.existsSync(self.urls) &&
            fs.existsSync(self.settings);
      }
    }
  },

  end: function () {
    this.log(format('%s Your config created!', colors.green('Finish!')));
  }
});
