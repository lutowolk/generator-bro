'use strict';

var _ = require('lodash');
var path = require('path');
var format = require('util').format;
var yeoman = require('yeoman-generator');
var handlebars = require('../../utils/handlebars');

module.exports = yeoman.generators.Base.extend({
  copyTpl: function (from, to, context) {
    var srcContent = this.fs.read(from);
    var compileContent = handlebars.compile(srcContent);
    this.fs.write(to, compileContent(context));
  }
});