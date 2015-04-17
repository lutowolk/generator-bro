'use strict';
var yeoman = require('yeoman-generator');
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
    appDirectories: function () {
      var structJSON = this.fs.readJSON(
        this.templatePath('../struct.json'));

      gfs(structJSON, './', this);
    }
  },

  /**
   * Updating already existing files.
   */
  updateExistingFiles: function () {
    var content = this.fs.read('server/config/urls.py').replace(
      /(urlpatterns \+= patterns\(\n(\s*)'',[\n\w\s()'^/,]+)\)/,
      f('$1$2url(r\'^{{appName}}/\', include(\'apps.{{appName}}.urls\')),\n)', this));

    writeToFile('server/config/urls.py', content);

    content = this.fs.read('server/config/settings/installed_apps.py').replace(
      /(LOCAL_APPS = \([()\n\s'\w.,]+)\)/,
      f('$1    \'apps.{{appName}}\',\n)', this));

    writeToFile('server/config/settings/installed_apps.py', content);
  }
});
