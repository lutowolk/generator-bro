'use strict';

var _ = require('lodash');
var path = require('path');
var colors = require('colors');
var format = require('util').format;
var yeoman = require('yeoman-generator');
var handlebars = require('../../utils/handlebars');
var writeToFile = require('../../utils/generateFilesStruct').writeToFile;
var f = require('../../utils/generateFilesStruct').f;

module.exports = {
  constructor: function () {
    // init constructor
    yeoman.Base.apply(this, arguments);

    // set arguments
    this._setArguments();

    // set options
    this._setOptions();
  },
  initializing: function () {
    var self = this;
    
    if (self.beforeInit) {
      self.beforeInit();
    }

    parseOptions();

    if (self.afterInit) {
      self.afterInit();
    }

    function parseOptions() {
      self.opts = _.transform(self._options, parseOpt, {});

      function parseOpt(opts, opt) {
        opts[_.camelCase(opt.name)] = self.options[opt.name];
      }
    }
  },
  prompting: function () {
  },
  writing: function () {
    var self = this;

    var globalContext = self._setContext();

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
  },
  install: function () {
    if (this.beforeInstall) {
      this.beforeInstall();
    }

    // ...

    if (this.afterInstall) {
      this.afterInstall();
    }
  },
  end: function () {
    if (this.beforeEnd) {
      this.beforeEnd();
    }

    // ...

    if (this.afterEnd) {
      this.afterEnd();
    }
  }
};