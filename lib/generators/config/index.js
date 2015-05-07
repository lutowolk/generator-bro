'use strict';

var fs = require('fs');
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
      default: 'apps'
    }, {
      type: 'input',
      name: 'urls',
      message: 'Path to root url conf',
      default: 'config/urls.py'
    }, {
      type: 'input',
      name: 'settings',
      message: 'Path to project settings directory',
      default: 'config/settings'
    }, {
      type: 'input',
      name: 'templates',
      message: 'Path to templates directory (may be empty)',
      default: 'templates'
    }];

    prompts = _.filter(prompts, function(prompt){
      return !self.options[prompt.name];
    });

    this.prompt(prompts, function (answers) {
      this.answers = answers;
      done();
    }.bind(this));
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
    // installed_apps.py
    installedApps: {
      src: 'installed_apps.py',
      dst: '{{settings}}/installed_apps.py',
      context: function(self, globalContext) {
      }
    },

    // .yo-rc.json
    yoRc: {
      src: '_yo-rc.json',
      dst: '.yo-rc.json',
      isRun: function (self, src, dst) {
        return fs.existsSync(dst);
      }
    }
  },

  end: function () {
    this.log(format('%s Your config created!', colors.green('Finish!')));
  }
});
