'use strict';

var _ = require('lodash');
var path = require('path');
var fs = require('fs-extra');
var colors = require('colors');
var format = require('util').format;

var helpers = require('../../core/helpers');
var core = require('../../core/generators/core');
var gHelper = require('../../core/generators/helper');

var selfGenerator = {
  _setOptions: function () {
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

  _questions: function () {
    var self = this;

    var questions = [{
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

    return _.filter(questions, function(quest){
      return !self.opts[quest.name];
    });

    function validateDir(path) {
      return (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) ||
          format('Dir ./%s not found', path);
    }

    function validateFile(path) {
      return (fs.existsSync(path) && fs.lstatSync(path).isFile()) ||
          format('File ./%s not found', path);
    }
  },

  _setContext: function() {
    return {
      apps: this.opts.apps || this.answers.apps,
      urls: this.opts.urls || this.answers.urls,
      settings: this.opts.settings || this.answers.settings,
      templates: this.opts.templates || this.answers.templates
    };
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
        console.log(context.urls);
        return fs.existsSync(context.apps) &&
            fs.existsSync(context.urls) &&
            fs.existsSync(context.settings);
      }
    }
  },

  _afterEnd: function () {
    this.log(format('%s Your config created!', colors.green('Finish!')));
  }
};

module.exports = helpers.extendOf(gHelper, core, selfGenerator);