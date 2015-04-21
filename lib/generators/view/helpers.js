'use strict';

var _ = require('lodash');
var path = require('path');
var colors = require('colors');
var format = require('util').format;
var yeoman = require('yeoman-generator');
var handlebars = require('../../utils/handlebars');

module.exports = yeoman.generators.Base.extend({
  copyTpl: function (from, to, context) {
    var srcContent = this.fs.read(from);
    var compileContent = handlebars.compile(srcContent);
    this.fs.write(to, compileContent(context));
  },
  error: function(message) {
    this.log(format('%s %s', colors.red('Error!'), message));
    process.exit(1);
  },
  warning: function(message) {
    this.log(format('%s %s', colors.yellow('Warning!'), message));
  }
});