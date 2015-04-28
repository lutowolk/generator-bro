'use strict';

var _ = require('lodash');
var path = require('path');
var colors = require('colors');
var format = require('util').format;
var yeoman = require('yeoman-generator');
var handlebars = require('../utils/handlebars');
var writeToFile = require('../utils/generateFilesStruct').writeToFile;
var f = require('../utils/generateFilesStruct').f;
var helpers = require('../../core/helpers');

module.exports = helpers.extend({
  writing: function() {
    var self = this;

    _.forEach(this.creating, processFiles);

    function processFiles(file) {
      if(file.isRun && !file.isRun) {
        return false;
      }

      var context = _.merge(file.context, self.context);
      var srcPath = f(self.templatePath(file.src), context);
      var dstPath = f(self.destinationPath(file.dst), context);
      var fileExists = self.fs.exists(dstPath);
      var content;

      if (fileExists) {
        content = self.fs.read(dstPath);
        var changed = file.replacement(content);

        if (changed) {
          writeToFile(dstPath, changed, false);
        }
      } else {
        self.copyTpl(dstPath, srcPath, file.context);
      }
    }
  }
});