'use strict';
var yeoman = require('yeoman-generator');
var generateFileStruct = require('../../utils/generateFilesStruct').generateFileStruct;

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

      generateFileStruct(structJSON, './', this);
    }
  },

  updateExistingFiles: function () {
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
  //      '-r', '^' + this.appName + '/',
  //      '-u', 'apps.'+ this.appName +'.urls']);
  //
  //  this.spawnCommand('python',
  //    [scriptPath,
  //      '-c', 'add_str_to_tuple',
  //      '-p', './server/config/settings/installed_apps.py',
  //      '-t', 'LOCAL_APPS',
  //      '-v', 'apps.' + this.appName]);
  }
});
