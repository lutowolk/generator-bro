'use strict';
var yeoman = require('yeoman-generator');
var colors = require('colors');
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
      desc: 'App name and model name in next format: app:ModelName',
      type: String, required: true});

    // options
    this.option('--list', {
      desc: 'Create generic view ListView for model',
      type: Boolean, defaults: false});

    this.option('--detail', {
      desc: 'Create generic view DetailView for model',
      type: Boolean, defaults: false});

    this.option('--create', {
      desc: 'Create generic view CreateView for model',
      type: Boolean, defaults: false});

    this.option('--update', {
      desc: 'Create generic view UpdateView for model',
      type: Boolean, defaults: false});

    this.option('--del', {
      desc: 'Create generic view DeleteView for model',
      type: Boolean, defaults: false});

    this.option('force', {
      alias: 'f',
      desc: 'Overwrite files that already exist',
      type: Boolean, defaults: false});

    this.conflicter.force = this.options.force;
  },

  initializing: {
    initVars: function() {
      this.warnings = [];
    },
    /**
     * Load model fields type json.
     */
    loadFieldTypes: function () {
      this.modelFieldTypes = this.fs.readJSON(
          this.templatePath('../model_field_types.json'));
    },
    /**
     * Parsing options.
     */
    parseOpts: function () {
      this.defSave = this.options.defSave || this.options.s;
      this.prepopulated = this.options.prepopulated || this.options.p;
      this.force = this.options.force || this.options.f;
    },
    /**
     * Parsing arguments.
     */
    parseArgs: function () {
      var appModelName = this.appModelName.split(':');

      if(appModelName.length !== 2) {
        this.log(colors.red('Error!') + ' First arg must be app name and models name in next format ' +
        colors.green('yo bro:view app:ModelName'));
        process.exit(1);
      }

      var fieldArgs = _.slice(this.arguments, 1); // get all args without first

      this.appName = _.first(appModelName);
      this.modelName = _.last(appModelName);

      this.fields = [];

      var isName = _.chain(this.fields)
          .find(where)
          .result('name', undefined)
          .value();

      var isSlug = _.result(_.find(this.fields, 'name', 'slug'), 'name');

      this.isNameOrSlug = isName || isSlug;

      function where(f) {
        return f.name === 'name' || f.name === 'title';
      }
    }
  },

  writing: {
    /**
     * Creating new files and directories.
     */
    createFiles: function() {
      var structJSON = this.fs.readJSON(
          this.templatePath('../struct.json'));

      gfs(structJSON, './', this);  // generate file struct for this generator
    },
    /**
     * Updating already existing files.
     */
    updateExistingFiles: function () {
      addToFile(
        f('server/apps/{{appName}}/models/__init__.py', this),
        f('from apps.{{appName}}.models.{{modelName.toLowerCase()}} import *', this),
        this);
    }
  },

  /**
   * Show complete message.
   */
  end: function () {
    _.forEach(this.warnings, function(warning){
      console.log(warning);
    });

    this.log(colors.green('Finish!') + ' Your views was created!');
  }
});
