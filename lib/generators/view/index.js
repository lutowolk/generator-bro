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
      type: String, defaults: '\'/\''});

    this.option('model', {
      desc: 'File with model (file name only)',
      type: String});

    this.option('view', {
      desc: 'File for view (file name only)',
      type: String});

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
      this.model = this.options.model;
      this.view = this.options.view;
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
      var pathToModelPackage = format('server/apps/%s/models', this.appName);

      var fileModelName = this.modelName.toLowerCase();

      var pathToModel = !fs.existsSync(pathToModelPackage) ?
        pathToModelPackage + '.py' :
        path.join(pathToModelPackage, (this.model || fileModelName) + '.py');

      this.modelFields = this.getModelFields(
        this.modelName, this.fs.read(pathToModel));
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
          'url(r"^%s/$$$", %sListView.as_view(), name=\'%s.list\')',
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
            fields: _.map(self.modelFields, mapFields)
          };
          return context;

          function mapFields(field) {
            return format('{{ item.%s }}', field);
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
            'url(r"^%s/%s/$$$", %sDetailView.as_view(), name=\'%s.detail\')',
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
            fields: _.map(self.modelFields, mapFields)
          };
          return context;

          function mapFields(field) {
            return format('{{ object.%s }}', field);
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
        urlpattern: format('url(r"^%s/create/$$$", ' +
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
            fields: _.map(self.modelFields, mapFields)
          };
          return context;

          function mapFields(field) {
            var djangoHtml = '' +
                '<div class="form-create__field">\n' +
                '            {{ form.%s.errors }}\n' +
                '            {{ form.%s.label_tag }}\n' +
                '            {{ form.%s }}\n' +
                '        </div>';
            return format(djangoHtml, field, field, field);
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
        urlpattern: format('url(r"^%s/update/(?P<pk>\\d+)/$$$", ' +
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
            fields: _.map(self.modelFields, mapFields)
          };
          return context;

          function mapFields(field) {
            var djangoHtml = '' +
                '<div class="form-create__field">\n' +
                '            {{ form.%s.errors }}\n' +
                '            {{ form.%s.label_tag }}\n' +
                '            {{ form.%s }}\n' +
                '        </div>';
            return format(djangoHtml, field, field, field);
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
        urlpattern: format('url(r"^%s/delete/(?P<pk>\\d+)/$$$", ' +
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

  context: function() {
    return {
      app: path.join(this.config.get('apps'), this.appName),
      templates: this.config.get('templates'),
      modelFields: this.modelFields,
      appName: this.appName,
      modelName: this.modelName,
      defSave: this.defSave,
      force: this.force,
      paginateBy: this.paginateBy,
      slugField: this.slugField,
      deleteSuccessUrl: this.deleteSuccessUrl,
      views: this.views,
      root: this.root,
      includeForm: this.includeForm
    };
  },

  writing: function() {
    this._writing();
  },

  creating: {
    // views/model_name.py || views.py
    viewNamed: {
      src: '_views.py',
      dst: '{{app}}/{{fileName}}.py',
      isRun: function(self, src, dst, context) {
        return fs.existsSync(
            self.destinationPath(f('{{app}}/models', context)));
      },
      replacement: function(self, content, src, dst, context) {
        _.forEach(self.activeViews, addViewsToContent);

        // Next code do some operations with imports. Build imports,
        // inserts imports, check that this imports is not imported.

        var viewImportsList = _
            .chain(self.activeViews)
            .values()
            .pluck('className')
            .value();

        var imports = [
            f('from apps.{{appName}}.models.{{lower modelName}} import {{modelName}}', context)
        ];

        if (self.includeForm) {
          imports.push(format(
              '\nfrom apps.%s.forms.%s import %sForm', self.appName.toLowerCase(),
              self.modelName.toLowerCase(), self.modelName));
        }

        if(viewImportsList.length) {
          imports.push(format('\nfrom django.views.generic import %s',
              viewImportsList.join(', ')));
        }

        content = self.includeImports(imports, content, dst);

        return content;

        function addViewsToContent(view) {
          content += f(self.fs.read(view.srcCodePath), context);
        }
      },
      context: function(self, globalContext) {
        var fileName = 'views';
        var viewsPackage = self
            .destinationPath(f('{{app}}/views', globalContext));
        var viewsCode = _
            .map(self.activeViews, getCodeView);
        var viewImportsList = _
            .chain(self.activeViews)
            .values()
            .pluck('className')
            .value();

        if (fs.existsSync(viewsPackage)) {
          fileName = 'views/' + (self.view || self.modelName).toLowerCase();
        }

        return {
          viewImports: viewImportsList.join(', '),
          fileName: fileName,
          viewsCode: viewsCode
        };

        function getCodeView(view) {
          var viewTemplate = fs
              .readFileSync(view.srcCodePath)
              .toString();

          var context = _.merge(globalContext, view.viewContext);

          return f(viewTemplate, context);
        }
      }
    },

    // urls.py
    urls: {
      dst: '{{app}}/urls.py',
      isRun: function (self, src, dst) {
        return fs.existsSync(dst);
      },
      replacement: function (self, content, src, dst) {
        var urlpattern = _.first(self.getFunctionCall('patterns', content));

        if (!urlpattern) {
          return false;
        }

        var fixUrlpattern = urlpattern;

        _.forEach(self.activeViews, addUrlPattern);

        var changeContent = content.replace(urlpattern, fixUrlpattern);

        // Next code do some operations with imports. Build imports,
        // inserts imports, check that this imports is not imported.

        var imports = [];

        var viewImportsList = _
            .chain(self.activeViews)
            .values()
            .pluck('userClass')
            .value();

        if(viewImportsList.length) {
          imports.push(format('\nfrom apps.%s.views import %s',
            self.appName, viewImportsList.join(', ')));
        }

        changeContent = self.includeImports(imports, changeContent, dst);

        return changeContent;

        function addUrlPattern(view) {
          fixUrlpattern = fixUrlpattern
              .replace(/(patterns\(\n?(\s*)'[\w_.]*?',(\s|.)+)\)/,
                format('$1$2%s,\n)', view.urlpattern))
              .replace(/"/g, '\'');
        }
      }
    },

    // forms/__init__.py
    formInit: {
      dst: '{{app}}/forms/__init__.py',
      isRun: function(self, src, dst) {
        return self.options.update || self.options.create;
      },
      replacement: function(self, content) {
        var imports = [
          format('from apps.%s.forms.%s import %sForm', self.appName,
            self.modelName.toLowerCase(), self.modelName)
        ];
        return self.includeImports(imports, content);
      }
    },

    // views/__init__.py
    viewsInit: {
      dst: '{{app}}/views/__init__.py',
      isRun: function(self, src, dst) {
        return fs.existsSync(path.dirname(dst));
      },
      replacement: function(self, content, dst) {
        var imports = [];

        var viewImportsList = _
            .chain(self.activeViews)
            .values()
            .pluck('userClass')
            .value();

        if(viewImportsList.length) {
          imports.push(format('\nfrom apps.%s.views.%s import %s', self.appName,
            self.modelName.toLowerCase(), viewImportsList.join(', ')));
        }

        return self.includeImports(imports, content, dst);
      }
    },

    // models/*.py
    models: {
      dst: '{{app}}/{{fileName}}.py',
      isRun: function(self, src, dst, context) {
        return self.options.detail;
      },
      replacement: function(self, content, src, dst, context) {
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

        return content;

        function getMethod() {
          var spaces = 4;

          return format('\n\n%sdef get_absolute_url(self):\n' +
              '%sreturn reverse(\'%s:%s.detail\', args=(%s,))',
              _.repeat(' ', spaces), _.repeat(' ', spaces*2), self.appName,
              self.modelName.toLowerCase(), self.isSlug ? 'self.slug' : 'self.pk');
        }
      },
      context: function(self, globalContext) {
        var fileName = 'models';
        var modelsPackage = self
            .destinationPath(f('{{app}}/models', globalContext));

        if (fs.existsSync(modelsPackage)) {
          fileName = 'models/' + (self.model || self.modelName).toLowerCase();
        }

        return {
          fileName: fileName
        };
      }
    },

    // forms/model_name.py
    form: {
      src: '_form.py',
      dst: '{{app}}/forms/{{lower modelName}}.py',
      isRun: function(self, src, dst) {
        return self.options.update || self.options.create;
      },
      context: function(self, globalContext) {
        var basePath = format('apps.%s.models', self.appName);

        if (fs.existsSync(path.join(globalContext.app, 'models'))) {
          basePath += format('.%s', self.model || self.modelName.toLowerCase());
        }

        return {
          modelPythonPath: basePath
        };
      }
    },

    // templates/app_name/model_name_detail.html
    templateDetail: {
      src: 'templates/_detail.html',
      dst: '{{templates}}/{{appName}}/{{lower modelName}}_detail.html',
      isRun: function(self, src, dst) {
        return self.options.detail && !fs.existsSync(dst);
      }
    },

    // templates/app_name/model_name_form.html
    templateForm: {
      src: 'templates/_form.html',
      dst: '{{templates}}/{{appName}}/{{lower modelName}}_form.html',
      isRun: function(self, src, dst) {
        return (self.options.update || self.create) && !fs.existsSync(dst);
      }
    },

    // templates/app_name/model_name_list.html
    templateList: {
      src: 'templates/_list.html',
      dst: '{{templates}}/{{appName}}/{{lower modelName}}_list.html',
      isRun: function(self, src, dst) {
        return self.options.list && !fs.existsSync(dst);
      }
    }
  },

  end: function () {
    this.log(format('%s Your views was created!', colors.green('Finish!')));
  }
});
