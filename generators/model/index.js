'use strict';
var yeoman = require('yeoman-generator');
var _ = require('lodash');
var generateFilesStruct = require('../../utils/generateFilesStruct');
var gfs = generateFilesStruct.generateFileStruct;
var f = generateFilesStruct.f;
var addToFile = generateFilesStruct.addToFile;


module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.Base.apply(this, arguments);

    // args
    this.argument('appModelName', {
      type: String, required: true});

    // options
    this.option('def-save', {
      type: Boolean, defaults: false});
  },

  parseArgs: function () {
    var appModelName = this.appModelName.split(':');

    this.appName = _.first(appModelName);
    this.modelName = _.last(appModelName);
    this.factoryFields = [];
    this.fields = [];
  },

  parseOpts: function () {
    this.defSave = this.options.defSave;
  },

  initializing: function () {

  },

  writing: function () {
    var structJSON = this.fs.readJSON(
      this.templatePath('../struct.json'));

    gfs(structJSON, './', this);  // generate file struct for this generator
  },

  updateExistingFiles: function () {

    addToFile(
      f('server/apps/{{appName}}/models/__init__.py', this),
      f('from apps.news.models.{{modelName}} import *', this),
      this.fs);

    addToFile(
      f('server/apps/{{appName}}/admin/__init__.py', this),
      f('from apps.news.admin.{{modelName}} import *', this),
      this.fs);

    addToFile(
      f('server/apps/{{appName}}/factories/__init__.py', this),
      f('from apps.news.factories.{{modelName}} import *', this),
      this.fs);
  }
});
