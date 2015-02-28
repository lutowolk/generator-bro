'use strict';
var yeoman = require('yeoman-generator');
var generateFileStruct = require('../../utils/generateFilesStruct').generateFileStruct;

module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.Base.apply(this, arguments);

    // set interpolate symbols {{ foo }}
    this._.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
    this._.templateSettings.escape = /{{-([\s\S]+?)}}/g;
    this._.templateSettings.evaluate = /{{([\s\S]+?)}}/g;

    this.argument('appname', {
      type: String,
      required: false
    });
  },

  initializing: function () {

  },

  writing: {
    appDirectories: function () {
      var structJSON = this.src.readJSON('../struct.json');
      generateFileStruct(structJSON, './', this);
    }
  }
});
