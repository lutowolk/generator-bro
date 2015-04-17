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
    this.option('def-save', {
      alias: 's',
      desc: 'Create model method save for next overriding',
      type: Boolean, defaults: false});

    this.option('force', {
      alias: 'f',
      desc: 'Overwrite files that already exist',
      type: Boolean, defaults: false});

    this.option('prepopulated', {
      alias: 'p',
      desc: 'Prepopulated field name',
      type: String});

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
      var self = this;

      var appModelName = this.appModelName.split(':');

      if(appModelName.length !== 2) {
        this.log(colors.red('Error!') + ' First arg must be app name and models name in next format ' +
        colors.green('yo bro:model app:ModelName'));
        process.exit(1);
      }

      var fieldArgs = _.slice(this.arguments, 1); // get all args without first

      this.appName = _.first(appModelName);
      this.modelName = _.last(appModelName);

      var fieldsObj = _.map(fieldArgs, getFieldObj);
      this.fields = _.map(fieldsObj, serializeModelField);

      var fieldNames = _.pluck(fieldsObj, 'name');
      if (this.prepopulated && fieldNames.indexOf(this.prepopulated) === -1) {
        var formatObj = {
          error: colors.red('Error!'),
          prepopulated: colors.red(this.prepopulated),
          fields: colors.green(fieldNames.join(', '))
        };
        console.log(f('{{error}} Option prepopulated is invalid, field ' +
        '{{prepopulated}} not found from this field: {{fields}}', formatObj));

        process.exit(1);
      }

      var isName = _.chain(fieldsObj)
          .find(where)
          .result('name', undefined)
          .value();

      this.prepopulated = this.prepopulated || isName;

      var isSlug = _.result(_.find(fieldsObj, 'name', 'slug'), 'name');

      this.isPrepopulated = isSlug && this.prepopulated;

      if(isSlug && !this.prepopulated) {
        this.warnings.push(
          f('{{warning}} Finding slug field but prepopulated field not found.',
            {warning: colors.yellow('Warning!')}));
      }

      this.isNameOrSlug = isName || isSlug;

      this.factoryFields = [];

      function where(f) {
        return f.name === 'name' || f.name === 'title';
      }

      /**
       * Convert raw string to file object.
       *
       * Usage:
       *
       * var rawField = 'title:char:blank=True,null=True';
       * getFieldObj(rawField);
       * {name: 'title',
       *  args: {blank: True, null: True, max_length: 255, verbose_name: '_("Title")'},
       *  fieldType: 'models.CharField'}
       *
       * @param rawField
       * @returns {{name: *, args: Object, fieldType: *}}
       */
      function getFieldObj(rawField) {

        var validationErrMsg = colors.red('Error!') + f(' Field {{field}} invalid. ', {field: rawField}) +
            'Field must have next format: ' + colors.green('title:char:blank=True,null=True');

        var nameTypeArgs = rawField.split(':');

        if (nameTypeArgs.length !== 2 && nameTypeArgs.length !== 3) {
          console.log(validationErrMsg);
          process.exit(1);
        }

        var name = nameTypeArgs[0];
        var ftype = nameTypeArgs[1];
        var args = nameTypeArgs[2];

        var opts = getDefaultArgsForField(ftype, name); // options for field

        if (!opts) {
          console.log(colors.red(f('Error! Field {{name}} is not a valid. ' +
          'Enter valid django field.', {name: ftype})));
          process.exit(1);
        }

        if (args) {
          var listKeyVal = args.split(',');

          _.transform(listKeyVal, function (res, val){
            var keyVal = val.split('=');

            if (keyVal.length === 1) {
              res[keyVal[0]] = '';
            } else if(keyVal.length === 2) {
              res[keyVal[0]] = keyVal[1];
            } else {
              console.log(validationErrMsg);
              process.exit(1);
            }
          }, opts);
        }

        var fromModule = 'models.';

        return {
          name: name,
          args: opts,
          fieldType: f('{{from}}{{ftype}}', {
            from: fromModule, ftype: self.modelFieldTypes[ftype].name})
        };

        /**
         * Get default args object for field initialize. Default args for field
         * must be set in file `model_field_types.json` for `field` param.
         * Default args building from two objects: model_field_types[field]
         * and `defaultArgsForAll` private variable.
         *
         * If field does not exist in model_field_types - return false.
         *
         * Will be removed in next minor version.
         *
         * @deprecated
         *
         * @private
         *
         * @param field {String}
         * @param name {String}
         * @returns {Object|Boolean}
         */
        function getDefaultArgsForField(field, name) {
          var defaultArgsForAll = {
            verbose_name: f('_("{{name}}")', {name: name})};  // jshint ignore:line

          if(!_.has(self.modelFieldTypes, field)) {
            return false;
          }

          var defaultArgsForThis = self.modelFieldTypes[field].defaultArgs || {};

          return _.merge(defaultArgsForAll, defaultArgsForThis);
        }
      }

      /**
       * Get string from object in django model field format.
       *
       * Usage:
       *
       * var field = {
       *  name: 'title',
       *  args: {max_length: 255, verbose_name: '_("Title")'},
       *  fieldType: 'models.CharField'};
       * serializeModelField(field);*
       * "title = models.CharField(max_length=255, verbose_name=_(\"Title\"))"
       *
       * @param field {Object}
       * @returns {String}
       */
      function serializeModelField(field) {
        field.opts = getOptions(field.args);
        return f('{{name}} = {{fieldType}}({{opts}})', field);

        /**
         * Get args and kwargs as string format for initializing
         * django model field. Sorting parameters begin args and then kwargs.
         *
         * Usage:
         *
         * var opts = {blank: True, null: True, News: ''};
         * getOptions(opts);
         * "\"News\", blank=True, null=True"
         *
         * @private
         *
         * @param args {Object}
         * @returns {String}
         */
        function getOptions(args) {
          var argsKwargs = _.chain(args)
              .map(getKeyVal).sortBy(sort).value();
          return argsKwargs.join(', ');

          function getKeyVal(v, k) {
            return v? k + '=' + v : '"' + k + '"';
          }

          function sort(param, i) {
            return _.indexOf(param, '=') === -1 ? (i * -1) : i;
          }
        }
      }
    }
  },

  /**
   * Creating new files and directories.
   */
  writing: function () {
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
      this.fs);

    addToFile(
      f('server/apps/{{appName}}/admin/__init__.py', this),
      f('from apps.{{appName}}.admin.{{modelName.toLowerCase()}} import *', this),
      this.fs);
  },

  /**
   * Show complete message.
   */
  end: function () {
    _.forEach(this.warnings, function(warning){
      console.log(warning);
    });

    this.log(colors.green('Finish!') + ' Your models was created! Run ' +
      colors.green(f('./manage.py makemigrations {{appName}} && migrate', this)));
  }
});
