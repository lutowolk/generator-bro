'use strict';
var yeoman = require('yeoman-generator');
var format = require('util').format;
var generateFilesStruct = require('../../utils/generateFilesStruct');
var gfs = generateFilesStruct.generateFileStruct;
var f = generateFilesStruct.f;
var writeToFile = generateFilesStruct.writeToFile;
var fs = require('fs');
var colors = require('colors');


module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.Base.apply(this, arguments);

    this.argument('appName', {
      type: String,
      required: false
    });

    this.option('force', {
      desc: 'Overwrite files that already exist',
      type: Boolean, defaults: false});

    this.conflicter.force = this.options.force;
  },

  initializing: function () {

  },

  writing: {
    /**
     * Updating already existing files.
     */
    createFiles: function() {
      var self = this;

      createFromStruct();

      ///////////////////

      function createFromStruct() {
        var structJSON = self.fs.readJSON(
            self.templatePath('../struct.json'));

        gfs(structJSON, './', self);
      }
    },
    /**
     * Updating already existing files.
     */
    updateExistingFiles: function () {
      var self = this;

      updateUrls();

      updateInstalledApps();

      ///////////////////

      function updateUrls() {
        var content = self.fs.read('server/config/urls.py').replace(
            /(urlpatterns \+= patterns\(\n(\s*)'',[\n\w\s()'^/,]+)\)/,
            format('$1$2url(r\'^%s/\', include(\'apps.%s.urls\', namespace=\'%s\')),\n)',
                self.appName, self.appName, self.appName));

        writeToFile('server/config/urls.py', content);
      }

      function updateInstalledApps() {
        var content = self.fs.read('server/config/settings/installed_apps.py').replace(
            /(LOCAL_APPS = \([()\n\s'\w.,]+)\)/,
            f('$1    \'apps.{{appName}}\',\n)', self));

        writeToFile('server/config/settings/installed_apps.py', content);
      }
    }
  }
});
