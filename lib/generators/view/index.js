'use strict';

var _ = require('lodash');
var path = require('path');
var format = require('util').format;
var colors = require('colors');
var yeoman = require('yeoman-generator');
var handlebars = require('../../utils/handlebars');
var generateFilesStruct = require('../../utils/generateFilesStruct');
var helpers = require('./helpers');
var f = generateFilesStruct.f;
var gfs = generateFilesStruct.generateFileStruct;
var addToFile = generateFilesStruct.addToFile;
var writeToFile = generateFilesStruct.writeToFile;

module.exports = helpers.extend({
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
      this.views = {};
      this.warnings = [];
      this.root = path.dirname(this.config.path);
      this.includeForm = this.options.create || this.options.update;
    },
    /**
     * Parsing options.
     */
    parseOpts: function () {
      this.defSave = this.options.defSave || this.options.s;
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

      this.appName = _.first(appModelName);
      this.modelName = _.last(appModelName);
    },
    /**
     * Load model in json format.
     */
    loadModel: function() {
      var modelsJsonPath = path.join(
        this.root, format('server/apps/%s/models/.models.json', this.appName));

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

      this.viewModel = modelsJson[this.modelName];
    },
    /**
     * Register views.
     */
    registerViews: function () {
      var self = this;

      self.views.list = {
        className: 'ListView',
        optionName: 'list',
        context: function () {
          var context = {
            itemUrl: '{{ item.get_absolute_url }}',
            item: '{{ item }}',
            fields: _.map(self.viewModel.fields, mapFields)
          };
          return context;

          function mapFields(field) {
            return format('{{ item.%s }}', field.name);
          }
        },
        dstPath: format(
            'server/templates/%s/%s_list.html', self.appName, self.modelName),
        srcTemplatePath: self.templatePath('templates/_list.html'),
        srcCodePath: self.templatePath('views/_list.py')
      };

      self.views.detail = {
        className: 'DetailView',
        optionName: 'detail',
        context: function () {
          var context = {
            item: '{{ object }}',
            fields: _.map(self.viewModel.fields, mapFields)
          };
          return context;

          function mapFields(field) {
            return format('{{ object.%s }}', field.name);
          }
        },
        dstPath: format(
            'server/templates/%s/%s_detail.html', self.appName, self.modelName),
        srcTemplatePath: self.templatePath(format('templates/_detail.html')),
        srcCodePath: self.templatePath('views/_detail.py')
      };

      self.views.create = {
        className: 'CreateView',
        optionName: 'create',
        context: function () {
          var context = {
            formUrl: format('%s:%s:create', self.appName, self.modelName),
            modelName: self.modelName,
            fields: _.map(self.viewModel.fields, mapFields)
          };
          return context;

          function mapFields(field) {
            var djangoHtml = '' +
                '<div class="form-create__field">' +
                '  {{ form.%s.errors }}' +
                '  {{ form.%s.label_tag }}' +
                '  {{ form.%s }}' +
                '</div>';
            return format(djangoHtml, field.name);
          }
        },
        dstPath: format(
            'server/templates/%s/%s_create.html', self.appName, self.modelName),
        srcTemplatePath: self.templatePath(format('templates/_create.html')),
        srcCodePath: self.templatePath('views/_create.py')
      };

      self.views.update = {
        className: 'UpdateView',
        optionName: 'update',
        context: function () {
          var context = {
            formUrl: format('%s:%s:update', self.appName, self.modelName),
            modelName: self.modelName,
            fields: _.map(self.viewModel.fields, mapFields)
          };
          return context;

          function mapFields(field) {
            var djangoHtml = '' +
                '<div class="form-create__field">' +
                '  {{ form.%s.errors }}' +
                '  {{ form.%s.label_tag }}' +
                '  {{ form.%s }}' +
                '</div>';
            return format(djangoHtml, field.name);
          }
        },
        dstPath: format(
            'server/templates/%s/%s_update.html', self.appName, self.modelName),
        srcTemplatePath: self.templatePath(format('templates/_create.html')),
        srcCodePath: self.templatePath('views/_update.py')
      };

      self.views.delete = {
        className: 'DeleteView',
        optionName: 'del',
        srcCodePath: self.templatePath('views/_del.py')
      };

      // Create active views object. From all registered views
      // choose those that is in options list.
      self.activeViews = _.transform(self.views, filterViews);

      function filterViews(res, view, name) {
        if (self.options[view.optionName]) {
          res[name] = view;
        }
      }
    }
  },

  writing: {
    /**
     * Creating new files and directories.
     */
    createFiles: function() {
      var self = this;

      createViewFile();

      if(self.includeForm) {
        createFormFile();
      }

      createTemplates();

      /////////////////////////

      function createTemplates() {
        var selectOpts = _
            .transform(self.options, transform, []);
        var selectViews = _
            .intersection(_.keys(views), selectOpts);
        var templateView = _
            .partial(format, '%s_%s.html', self.modelName);

        _.forEach(selectViews, function forEach(view){
          var formFields = _
              .map(self.viewModel.fields, mapFormField);
          var modelListFields = _
              .map(self.viewModel.fields, mapModelListField);
          var modelDetailFields = _
              .map(self.viewModel.fields, mapModelDetailField);

          var context = {
            formUrl: format('%s:%s:create', self.appName, self.modelName),
            modelName: self.modelName,
            detailItem: '{{ object }}',
            itemUrl: '{{ item.get_absolute_url }}',
            fromListItem: '{{ item }}',
            formFields: formFields,
            modelListFields: modelListFields,
            modelDetailFields: modelDetailFields
          };

          self.fs.copy(templatePath(view), destPath(view), context);
        });

        function mapFormField(field) {
          var djangoHtml = '' +
            '<div class="form-create__field">' +
            '  {{ form.%s.errors }}' +
            '  {{ form.%s.label_tag }}' +
            '  {{ form.%s }}' +
            '</div>';
          return format(djangoHtml, field.name);
        }

        function mapModelListField(field) {
          var djangoHtml = '{{ item.%s }}';
          return format(djangoHtml, field.name);
        }

        function mapModelDetailField(field) {
          var djangoHtml = '{{ object.%s }}';
          return format(djangoHtml, field.name);
        }

        function destPath(view) {
          path
            .join('server/templates', self.appName, templateView(view));
        }

        function templatePath (view) {
          return self
            .templatePath(format('templates/_%s.html', view));
        }

        function transform(res, v, k) {
          if (v) {
            res.push(k);
          }
        }
      }

      function createFormFile() {
        var dest = self.destinationPath(format('server/apps/%s/forms/%s.py',
          self.appName.toLowerCase(), self.modelName.toLowerCase()));

        self.copyTpl(self.templatePath('_form.py'), dest, self);
      }

      function createViewFile() {
        var viewsPath = format(
          'server/apps/%s/views/%s.py', self.appName, self.appName);

        self.viewImports = _
          .chain(self.activeViews)
          .values()
          .pluck('className')
          .join(', ')
          .value();

        if(!self.fs.exists(viewsPath)) {
          _.forEach(_.values(self.activeViews), loadPartials);

          self.copyTpl(self.templatePath('_views.py'),
            self.destinationPath(viewsPath), self);

          self.viewFileWasCreated = true;
        }

        /////////////////////////

        function loadPartials(view) {
          handlebars.registerPartial(
            view.className, self.fs.read(view.srcCodePath));
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
        var viewsPath = format(
          'server/apps/%s/views/%s.py', self.appName, self.appName);

        var viewContent = self.fs.read(viewsPath);

        var viewImportsList = _
            .chain(self.activeViews)
            .values()
            .pluck('className')
            .value();

        _.forEach(_.values(self.activeViews), addNewViews);

        // Next code do some operations with imports. Build imports,
        // inserts imports, check that this imports is not imported.

        var imports = format(
          '\nfrom django.views.generic import %s', viewImportsList.join(', '));

        var isFormNeedAndClassNotImported = self.includeForm &&
          !new RegExp(format('import.+%sForm', self.modelName))
            .test(viewContent);

        if (isFormNeedAndClassNotImported) {
          var modelName = self.modelName.toLowerCase();

          imports += format(
            '\nfrom apps.%s.forms.%s import %sForm',
              self.appName.toLowerCase(), modelName, modelName);
        }

        if (/((from|import).*)/.test(viewContent)) {
          viewContent = viewContent
            .replace(/((from|import).*)/, '$1' + imports);
        } else {
          self.warnings.push(
            format('%s Did not find where to insert imports, do this manually: \n~~~%s\n~~~',
              colors.yellow('Warning!'), imports));
        }

        writeToFile(viewsPath, viewContent, false);

        /////////////////////////

        function addNewViews(view) {
          // If file is not contain this view then add.
          if (viewContent.indexOf(view.className) === -1) {
            var compiled = handlebars.compile(self.fs.read(view.srcCodePath));
            viewContent += compiled(self);
          } else {
            self.warnings.push(format('%s View %s already exists in file %s.',
              colors.yellow('Warning!'), view.className, viewsPath));

            viewImportsList = _.without(viewImportsList, view.className);
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
