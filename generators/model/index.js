'use strict';
var yeoman = require('yeoman-generator');
var _ = require('lodash');
var generateFileStruct = require('../../utils/generateFilesStruct').generateFileStruct;

module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.Base.apply(this, arguments);

    // set interpolate symbols {{ foo }}
    this._.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
    this._.templateSettings.escape = /{{-([\s\S]+?)}}/g;
    this._.templateSettings.evaluate = /{{([\s\S]+?)}}/g;

    this.argument('appModelName', {
      type: String,
      required: false
    });

    this.option('def-save', {type: Boolean, defaults: false});
  },

  parseArgs: function () {
    var appModelName = this.appModelName.split(':');

    this.appName = _.first(appModelName);
    this.modelName = _.last(appModelName);

    this.defSave = this.options.defSave;
  },

  initializing: function () {

  },

  writing: {
    appDirectories: function () {
      var structJSON = this.fs.readJSON(
        this.templatePath('../struct.json'));

      generateFileStruct(structJSON, './', this);
    }
  }

  //updateExistingFiles: function () {
  //  var scriptPath = this.config.get('path') + '/scripts/update_file.py';
  //
  //  if(!this.fs.exists(scriptPath)) {
  //    this.log('Error. Path to the python script `update_file.py` is not found');
  //    return false;
  //  }
  //
  //  this.spawnCommand('python',
  //    [scriptPath,
  //      '-c', 'add_url_to_patterns',
  //      '-p', './server/config/urls.py',
  //      '-t', 'urlpatterns',
  //      '-r', '^' + this.appname + '/',
  //      '-u', 'apps.'+ this.appname +'.urls']);
  //
  //  this.spawnCommand('python',
  //    [scriptPath,
  //      '-c', 'add_str_to_tuple',
  //      '-p', './server/config/settings/installed_apps.py',
  //      '-t', 'LOCAL_APPS',
  //      '-v', 'apps.' + this.appname]);
  //}
});
