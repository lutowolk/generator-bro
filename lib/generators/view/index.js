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

    // options for list view
    this.option('paginate', {
      desc: 'Set paginate_by property for list view.',
      type: Number, defaults: 5});

    // options for detail view
    this.option('slug-field', {
      desc: 'Set slug_field property for detail view.',
      type: String, defaults: 'slug'});

    // options for delete view
    this.option('delete-success-url', {
      desc: 'Set success_url property for delete view.',
      type: String, defaults: '/'});

    this.conflicter.force = this.options.force || this.options.f;
  },

  initializing: {
    initVars: function() {
      this.views = {};
      this.root = path.dirname(this.config.path);
      this.includeForm = this.options.create || this.options.update;
    },
    /**
     * Parsing options.
     */
    parseOpts: function () {
      this.defSave = this.options.defSave || this.options.s;
      this.force = this.options.force || this.options.f;
      this.paginateBy = this.options.paginate;
      this.slugField = this.options['slug-field'];
      this.deleteSuccessUrl = this.options['delete-success-url'];
    },
    /**
     * Parsing arguments.
     */
    parseArgs: function () {
      var appModelName = this.appModelName.split(':');

      if(appModelName.length !== 2) {
        this.error(format(
          'First arg must be app name and models name in next format %s',
          colors.green('yo bro:view app:ModelName')));
      }

      this.appName = _.first(appModelName).toLowerCase();
      this.modelName = _.last(appModelName);
    },
    /**
     * Load model in json format.
     */
    loadModel: function() {
      var path = format('server/apps/%s/models/%s.py', this.appName,
        this.modelName.toLowerCase());
      this.modelFields = this.getModelFields(
        this.modelName, this.fs.read(path));
    },
    /**
     * Register views.
     */
    registerViews: function () {
      var self = this;

      var lowerModelName = self.modelName.toLowerCase();

      self.views.list = {
        className: 'ListView',
        userClass: format('%sListView', self.modelName),
        optionName: 'list',
        urlpattern: format(
          'url(r\'^%s/\', %sListView.as_view(), name=\'%s.list\')',
          lowerModelName, self.modelName, lowerModelName),
        viewContext: function () {
          var context = {
            appName: self.appName,
            modelName: self.modelName,
            paginateBy: self.paginateBy
          };
          return context;
        },
        templateContext: function () {
          var context = {
            appName: self.appName,
            modelName: self.modelName,
            fields: self.modelFields
          };
          return context;

          function mapFields(field) {
            return format('{{ item.%s }}', field.name);
          }
        },
        dstPath: format('server/templates/%s/%s_list.html',
          self.appName, self.modelName.toLowerCase()),
        srcTemplatePath: self.templatePath('templates/_list.html'),
        srcCodePath: self.templatePath('views/_list.py')
      };

      self.views.detail = {
        className: 'DetailView',
        userClass: format('%sDetailView', self.modelName),
        optionName: 'detail',
        urlpattern: format(
            'url(r\'^%s/detail/%s/\', %sDetailView.as_view(), name=\'%s.detail\')',
            lowerModelName, this.isSlug ? '(?P<slug>[-a-zA-Z0-9_]+)' : '(?P<pk>\\d+)',  //jshint ignore:line
            self.modelName, lowerModelName),
        viewContext: function () {
          var context = {
            appName: self.appName,
            modelName: self.modelName,
            slugField: self.slugField
          };
          return context;
        },
        templateContext: function () {
          var context = {
            appName: self.appName,
            modelName: self.modelName,
            fields: self.modelFields
          };
          return context;

          function mapFields(field) {
            return format('{{ object.%s }}', field.name);
          }
        },
        dstPath: format('server/templates/%s/%s_detail.html', self.appName,
            self.modelName.toLowerCase()),
        srcTemplatePath: self.templatePath(format('templates/_detail.html')),
        srcCodePath: self.templatePath('views/_detail.py')
      };

      self.views.create = {
        className: 'CreateView',
        userClass: format('%sCreateView', self.modelName),
        optionName: 'create',
        urlpattern: format('url(r\'^%s/create/\', ' +
          '%sCreateView.as_view(), name=\'%s.create\')',
          lowerModelName, self.modelName, lowerModelName),
        viewContext: function () {
          var context = {
            appName: self.appName,
            modelName: self.modelName
          };
          return context;
        },
        templateContext: function () {
          var context = {
            appName: self.appName,
            modelName: self.modelName,
            fields: self.modelFields
          };
          return context;

          function mapFields(field) {
            var djangoHtml = '' +
                '<div class="form-create__field">\n' +
                '            {{ form.%s.errors }}\n' +
                '            {{ form.%s.label_tag }}\n' +
                '            {{ form.%s }}\n' +
                '        </div>';
            return format(djangoHtml, field.name, field.name, field.name);
          }
        },
        dstPath: format('server/templates/%s/%s_form.html', self.appName,
            self.modelName.toLowerCase()),
        srcTemplatePath: self.templatePath(format('templates/_form.html')),
        srcCodePath: self.templatePath('views/_create.py')
      };

      self.views.update = {
        className: 'UpdateView',
        userClass: format('%sUpdateView', self.modelName),
        optionName: 'update',
        urlpattern: format('url(r\'^%s/update/(?P<pk>\\d+)/\', ' +
            '%sUpdateView.as_view(), name=\'%s.update\')',
            lowerModelName, self.modelName, lowerModelName),
        viewContext: function () {
          var context = {
            appName: self.appName,
            modelName: self.modelName
          };
          return context;
        },
        templateContext: function () {
          var context = {
            appName: self.appName,
            modelName: self.modelName,
            fields: self.modelFields
          };
          return context;

          function mapFields(field) {
            var djangoHtml = '' +
                '<div class="form-create__field">\n' +
                '            {{ form.%s.errors }}\n' +
                '            {{ form.%s.label_tag }}\n' +
                '            {{ form.%s }}\n' +
                '        </div>';
            return format(djangoHtml, field.name, field.name, field.name);
          }
        },
        dstPath: format('server/templates/%s/%s_form.html', self.appName,
            self.modelName.toLowerCase()),
        srcTemplatePath: self.templatePath(format('templates/_form.html')),
        srcCodePath: self.templatePath('views/_update.py')
      };

      self.views.delete = {
        className: 'DeleteView',
        userClass: format('%sDeleteView', self.modelName),
        optionName: 'del',
        viewContext: function () {
          var context = {
            appName: self.appName,
            modelName: self.modelName,
            deleteSuccessUrl: getSuccessUrl(self.deleteSuccessUrl)
          };
          return context;

          function getSuccessUrl(defaultUrl) {
            var reverseExp = format(
              '%s:%s.list', self.appName, self.modelName.toLowerCase());

            var isListViewExists = self.options.list ||
              self.fs.read(format('server/apps/%s/urls.py', self.appName))
                .indexOf(_.last(reverseExp.split(':'))) !== -1;

            if (isListViewExists) {
              return format('reverse(\'%s\')', reverseExp);
            } else {
              return defaultUrl;
            }
          }
        },
        srcCodePath: self.templatePath('views/_del.py'),
        urlpattern: format('url(r\'^%s/delete/(?P<pk>\\d+)/\', ' +
            '%sDeleteView.as_view(), name=\'%s.delete\')',
            lowerModelName, self.modelName, lowerModelName)
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
        _.forEach(_.values(self.activeViews), copyTemplateView);

        function copyTemplateView(view){
          var context = _.isFunction(view.templateContext) ?
            view.templateContext() : view.templateContext;

          if(view.srcTemplatePath && view.dstPath) {
            self.copyTpl(view.srcTemplatePath, view.dstPath, context);
          }
        }
      }

      function createFormFile() {
        var dest = self.destinationPath(format('server/apps/%s/forms/%s.py',
          self.appName, self.modelName.toLowerCase()));

        self.copyTpl(self.templatePath('_form.py'), dest, self);
      }

      function createViewFile() {
        var viewsPath = format(
          'server/apps/%s/views/%s.py', self.appName,
          self.modelName.toLowerCase());

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
        updateView();
      }

      updateUrl();

      updateInitForm();

      if(self.options.detail) {
        updateModel();
      }

      /////////////////////////

      function updateModel() {
        var path = format('server/apps/%s/models/%s.py',
            self.appName, self.modelName.toLowerCase());

        var content = self.fs.read(path);

        var modelBody = self.getClassBody(self.modelName, content);

        if (!modelBody) {
          self.warning(format(
            'Model %s not found in file %s', self.modelName, path));
          return false;
        }

        var modelMethods = self
          .getClassMethods(self.modelName, content);

        if(modelMethods.indexOf('get_absolute_url') !== -1) {
          return false;
        }

        var getAbsoluteUrlMethod = getMethod();

        var methodsAfterMustBeInsert = ['__unicode__', 'save'];

        var methodAfter = _
          .chain(modelMethods)
          .intersection(methodsAfterMustBeInsert)
          .last()
          .value();

        if (!methodAfter) {
          content = content.replace(
            modelBody, modelBody + getAbsoluteUrlMethod);
        } else {
          // insert method to end model
          var methodBody = self.getMethodBody(methodAfter, modelBody);

          content = content.replace(modelBody, modelBody.replace(
            methodBody, methodBody + getAbsoluteUrlMethod));
        }

        var imports = ['from django.core.urlresolvers import reverse'];

        content = self.includeImports(imports, content, path);

        writeToFile(path, content);

        function getMethod() {
          var spaces = 4;

          return format('\n\n%sdef get_absolute_url(self):\n' +
            '%sreturn reverse(\'%s:%s.detail\', args=(%s,))',
            _.repeat(' ', spaces), _.repeat(' ', spaces*2), self.appName,
            self.modelName.toLowerCase(), self.isSlug ? 'self.slug' : 'self.pk');
        }
      }

      function updateUrl() {
        var appUrlPath = format('server/apps/%s/urls.py', self.appName);
        var content = self.fs.read(appUrlPath);

        var viewImportsList = _
            .chain(self.activeViews)
            .values()
            .pluck('userClass')
            .value();

        _.forEach(self.activeViews, addUrlPatterns);

        var imports = [];
        if(viewImportsList.length) {
          imports.push(format('\nfrom apps.%s.views.%s import %s',
            self.appName, self.modelName.toLowerCase(),
            viewImportsList.join(', ')));
        }

        content = self.includeImports(imports, content, appUrlPath);

        writeToFile(appUrlPath, content);

        /////////////////////////

        function addUrlPatterns(view) {
          if (content.indexOf(view.urlpattern) === -1) {
            // todo log warning if can't find where insert
            content = content.replace(
              /(urlpatterns = patterns\(\n?(\s*)'[\w_.]*?',(\s|.)+)\)/,
              format('$1$2%s,\n)', view.urlpattern));
          } else {
            viewImportsList = _.without(viewImportsList, view.className);
          }
        }
      }

      function updateInitForm() {
        if (!self.options.create && !self.options.update) {
          return false;
        }

        var formInitPath = format(
          'server/apps/%s/forms/__init__.py', self.appName);
        var imports = [format('\nfrom apps.%s.forms.%s import %sForm',
          self.appName, self.modelName.toLowerCase(), self.modelName)];
        var content = self.fs.read(formInitPath);

        content = self.includeImports(imports, content, formInitPath);
        writeToFile(formInitPath, content);
      }

      function updateView() {
        var viewsPath = format('server/apps/%s/views/%s.py', self.appName,
          self.modelName.toLowerCase());

        var viewContent = self.fs.read(viewsPath);

        var viewImportsList = _
          .chain(self.activeViews)
          .values()
          .pluck('className')
          .value();

        _.forEach(_.values(self.activeViews), addNewViews);

        // Next code do some operations with imports. Build imports,
        // inserts imports, check that this imports is not imported.

        var imports = [];

        if(viewImportsList.length) {
          imports.push(format('\nfrom django.views.generic import %s',
            viewImportsList.join(', ')));
        }

        if (self.includeForm) {
          imports.push(format(
            '\nfrom apps.%s.forms.%s import %sForm', self.appName.toLowerCase(),
            self.modelName.toLowerCase(), self.modelName));
        }

        viewContent = self.includeImports(imports, viewContent, viewsPath);

        writeToFile(viewsPath, viewContent, false);

        /////////////////////////

        function addNewViews(view) {
          // If file is not contain this view then add.
          if (viewContent.indexOf(view.userClass) === -1) {
            var compiled = handlebars.compile(self.fs.read(view.srcCodePath));
            viewContent += compiled(view.viewContext());
          } else {
            self.warning(format('View %s already exists in file %s.',
              view.className, viewsPath));

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
    this.log(format('%s Your views was created!', colors.green('Finish!')));
  }
});
