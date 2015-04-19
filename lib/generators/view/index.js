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
var writeToFile = generateFilesStruct.writeToFile;

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
      var self = this;

      createViewFile();

      /////////////////////////
      
      function createViewFile() {
        var viewsPath = f('server/apps/{{appName}}/views/{{appName}}.py', self);

        // build imports
        self.viewImportsList = [];
        var selectOpts = _.transform(self.options, transform, []);

        _.forIn(views, forIn);

        self.viewImports = self.viewImportsList.join(', ');

        if(!self.fs.exists(viewsPath)) {

          // load partial views to handlebars
          var selectViews = _.intersection(_.keys(views), selectOpts);

          _.forEach(selectViews, forEach);

          var tplCnt = handlebars.compile(self.fs.read(self.templatePath('_views.py')));
          self.fs.write(self.destinationPath(viewsPath), tplCnt(self));

          self.viewFileWasCreated = true;
        }

        /////////////////////////

        function transform(res, v, k) {
          if (v) {
            res.push(k);
          }
        }

        function forIn(v, k) {
          if(selectOpts.indexOf(k) !== -1) {
            self.viewImportsList.push(v);
          }
        }

        function forEach(view) {
          handlebars.registerPartial(views[view],
            self.fs.read(self.templatePath('views/_' + view + '.py')));
        }
      }
    },
    /**
     * Updating already existing files.
     */
    updateExistingFiles: function() {
      var self = this;

      if(!self.viewFileWasCreated) {
        updateViewFile();
      }

      /////////////////////////

      function updateViewFile() {
        var viewsPath = f('server/apps/{{appName}}/views/{{appName}}.py', self);
        var content = self.fs.read(viewsPath); // mutable var

        var selectOpts = _.transform(self.options, transform, []);
        var selectViews = _.intersection(_.keys(views), selectOpts);

        _.forEach(selectViews, forEach);

        var imports = '\nfrom django.views.generic import ' + self.viewImportsList.join(', ');

        if (self.includeForm && !new RegExp(f('import.+{{modelName}}Form', self)).test(content)) {
          imports += f(
            '\nfrom apps.{{lower appName}}.forms.{{lower modelName}} import {{modelName}}Form', self);
        }

        if (/((from|import).*)/.test(content)) {
          content = content.replace(/((from|import).*)/, '$1' + imports);
        } else {
          self.warnings.push(
            f('{{warning}} Did not find where to insert imports, do this manually: \n~~~{{imports}}\n~~~',
              {warning: colors.yellow('Warning!'), imports: imports}));
        }
        writeToFile(viewsPath, content, false);

        /////////////////////////

        function forEach(view, i) {
          // find view which we want create
          if (content.indexOf(views[view]) !== -1) {
            self.warnings.push(f('{{warning}} View {{view}} already exists in file {{file}}.',
              {warning: colors.yellow('Warning!'), view: views[view], file: viewsPath}));

            self.viewImportsList = _.without(self.viewImportsList, views[view]);
          } else {
            var tplCnt = handlebars.compile(
                self.fs.read(self.templatePath('views/_' + view + '.py')));

            content += tplCnt(self);
          }
        }

        function transform(res, v, k) {
          if (v) {
            res.push(k);
          }
        }
      }
    }
  },

  /**
   * Show complete message.
   */
  end: function () {
    _.forEach(this.warnings, function(warning){
      console.log('   ' + warning);
    });

    this.log(colors.green('   Finish!') + ' Your views was created!');
  }
});
