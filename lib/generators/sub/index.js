'use strict';
var yeoman = require('yeoman-generator');
var format = require('util').format;
var generateFilesStruct = require('../../utils/generateFilesStruct');
var writeToFile = generateFilesStruct.writeToFile;
var helpers = require('../../core/helpers');
var fs = require('fs');
var colors = require('colors');

module.exports = helpers.extend({
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

  initializing: {
    loadStructJson: function() {
      this.JsonMap = this.fs.readJSON(
        this.templatePath('../struct.json'));
    }
  },

  writing: {
    /**
     * Updating already existing files.
     */
    createFiles: function() {
      var self = this;

      createFromJsonMap();

      ///////////////////

      function createFromJsonMap() {
        var context = {
          apps: self.config.apps,
          appName: self.appName
        };

        self.createFilesFromJson(self.JsonMap, './', context);
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
        var rootUrlConfPath = self.config.rootUrlConfPath;

        if(self.fs.exists(rootUrlConfPath)) {
          self.warning(format(
              'File %s not found, include urls for new app to root url conf ' +
              'manually', rootUrlConfPath));
          return false;
        }

        var content = self.fs.read(rootUrlConfPath).replace(
            /(urlpatterns \+= patterns\(\n(\s*)'',[\n\w\s()'^/,]+)\)/,
            format('$1$2url(r\'^%s/\', include(\'apps.%s.urls\', namespace=\'%s\')),\n)',
                self.appName, self.appName, self.appName));

        writeToFile(rootUrlConfPath, content);
      }

      function updateInstalledApps() {
        var installedAppsPath = self.config.installedAppsPath;

        if(self.fs.exists(installedAppsPath)) {
          self.warning(format(
            'File %s not found, include new app to settings manually',
            installedAppsPath));
          return false;
        }

        var content = self.fs.read(installedAppsPath).replace(
          /(LOCAL_APPS = \([()\n\s'\w.,]+)\)/,
          format('$1    \'apps.%s\',\n)', self.appName));

        writeToFile(installedAppsPath, content);
      }
    }
  }
});
