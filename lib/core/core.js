'use strict';

var _ = require('lodash');
var path = require('path');
var colors = require('colors');
var format = require('util').format;
var yeoman = require('yeoman-generator');
var handlebars = require('../utils/handlebars');
var writeToFile = require('../utils/generateFilesStruct').writeToFile;
var f = require('../utils/generateFilesStruct').f;
var helpers = require('./helpers');

module.exports = helpers.extend({
  _writing: function() {
    var self = this;

    var globalContext = _.isFunction(self.context) ?
        self.context() : self.context || {};

    if (this.fs.exists(this.templatePath('../struct.json'))) {
      var jsonMap = this.fs.readJSON(this.templatePath('../struct.json'));
      self.createFilesFromJson(jsonMap, './', globalContext);
    }

    _.forIn(self.creating, processFiles);

    function processFiles(file) {
      var localContext = _.isFunction(file.context) ?
        file.context(self, globalContext) : file.context || {};

      var context = _.merge(localContext, globalContext);
      var srcPath = file.src? self.templatePath(f(file.src, context)) : '';
      var dstPath = self.destinationPath(f(file.dst, context));

      var isRun = !file.isRun ||
        (file.isRun && file.isRun(self, srcPath, dstPath, context));

      if(isRun) {
        var fileExists = self.fs.exists(dstPath);
        var content;

        if (fileExists && file.replacement) {
          content = self.fs.read(dstPath);
          var changed = file.replacement(
              self, content, srcPath, dstPath, context);

          if (changed) {
            writeToFile(dstPath, changed, false);
          }
        } else {
          self.copyTpl(srcPath, dstPath, context);
        }
      }
    }
  }
});