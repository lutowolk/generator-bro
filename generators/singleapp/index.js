'use strict';
var yeoman = require('yeoman-generator');
var generateFilesStruct = require('../../utils/generateFilesStruct');
var gfs = generateFilesStruct.generateFileStruct;
var f = generateFilesStruct.f;


module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.Base.apply(this, arguments);

    this.argument('appName', {
      type: String,
      required: false
    });
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
    var content = this.fs.read('server/config/urls.py');

    content = content.replace(
      /(urlpatterns \+= patterns\(\n(\s*)'',[\n\w\s()'^/,]+)\)/,
      f('$1$2url(r\'^{{appName}}/\', include(\'apps.{{appName}}.urls\')),\n)', this));

    this.fs.write('server/config/urls.py', content);

    content = this.fs.read('server/config/settings/installed_apps.py');

    content = content.replace(
      /(LOCAL_APPS = \([()\n\s'\w.,]+)\)/,
      f('$1    \'apps.{{appName}}\',\n)', this));

    this.fs.write('server/config/settings/installed_apps.py', content);
  }
});
