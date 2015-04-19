'use strict';

var _ = require('lodash');
var path = require('path');
var colors = require('colors');
var yeoman = require('yeoman-generator');
var handlebars = require('../../utils/handlebars');
var generateFilesStruct = require('../../utils/generateFilesStruct');
var f = generateFilesStruct.f;
var gfs = generateFilesStruct.generateFileStruct;
var addToFile = generateFilesStruct.addToFile;

// Allowed views

var views = {
  list: 'ListView',
  detail: 'DetailView',
  create: 'CreateView',
  update: 'UpdateView',
  del: 'DeleteView'
};

module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.Base.apply(this, arguments);

    // args
    this.argument('appModelName', {
      desc: 'App name and model name in next format: app:ModelName',
      type: String, required: true});

    // options
    this.option('list', {
      desc: 'Create generic view ListView for model',
      type: Boolean, defaults: false});

    this.option('detail', {
      desc: 'Create generic view DetailView for model',
      type: Boolean, defaults: false});

    this.option('create', {
      desc: 'Create generic view CreateView for model',
      type: Boolean, defaults: false});

    this.option('update', {
      desc: 'Create generic view UpdateView for model',
      type: Boolean, defaults: false});

    this.option('del', {
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
      this.root = path.dirname(this.config.path);
    },
    /**
     * Parsing options.
     */
    parseOpts: function () {
      this.defSave = this.options.defSave || this.options.s;
      this.force = this.options.force || this.options.f;

      this.includeForm = this.options.create || this.options.update;
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

      this.appName = _.first(appModelName);
      this.modelName = _.last(appModelName);
    },
    /**
     * Load model in json format.
     */
    loadModel: function() {
      var modelsJsonPath = path.join(
          this.root, f('server/apps/{{appName}}/models/.models.json', this));

      if(!this.fs.exists(modelsJsonPath)) {
        this.log(f(colors.red('Error!') + ' File server/apps/{{appName}}/models/.models.json ' +
        'not found. Run ' + colors.green('./manage.py modelsjson {{appName}}') + ' for create.', this));
        process.exit(1);
      }

      var modelsJson = this.fs.readJSON(modelsJsonPath);

      if(!_.has(modelsJson, this.modelName)) {
        this.log(f(colors.red('Error!') + ' Model not found. Make sure that model name is entered correctly.\nOr ' +
        'update file .models.json run ' + colors.green('./manage.py modelsjson {{appName}}') + ' for update.', this));
        process.exit(1);
      }

      this['model' + this.modelName] = modelsJson[this.modelName];
    }
  },

  writing: {
    /**
     * Creating new files and directories.
     */
    createFiles: function() {
      var viewsPath = f('server/apps/{{appName}}/views/{{appName}}.py', this);
      if(!this.fs.exists(viewsPath)) {

        // load partial views to handlebars
        handlebars.registerPartial('listView',
            this.fs.read(this.templatePath('views/_list.py')));
        handlebars.registerPartial('detailView',
            this.fs.read(this.templatePath('views/_detail.py')));
        handlebars.registerPartial('createView',
            this.fs.read(this.templatePath('views/_create.py')));
        handlebars.registerPartial('updateView',
            this.fs.read(this.templatePath('views/_update.py')));
        handlebars.registerPartial('deleteView',
            this.fs.read(this.templatePath('views/_delete.py')));

        // build imports
        var selectOpts = _.transform(this.options, transform, []);
        var viewImportsList = [];

        _.forIn(views, forIn);

        this.viewImports = viewImportsList.join(', ');
        var tplCnt = handlebars.compile(this.fs.read(this.templatePath('_views.py')));
        this.fs.write(this.destinationPath(viewsPath), tplCnt(this));
      }

      /////////////////////////

      function transform(res, v, k) {
        if (v) {
          res.push(k);
        }
      }

      function forIn(v, k) {
        if(selectOpts.indexOf(k) !== -1) {
          viewImportsList.push(v);
        }
      }
    },
    /**
     * Updating already existing files.
     */
    updateExistingFiles: function () {
      var viewsPath = f('server/apps/{{appName}}/views/{{appName}}.py', this);

      if(this.fs.exists(viewsPath)) {
        addToFile(
          f('server/apps/{{appName}}/models/__init__.py', this),
          f('from apps.{{appName}}.models.{{modelName.toLowerCase()}} import *', this),
          this);
      }
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
