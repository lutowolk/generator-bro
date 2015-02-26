'use strict';
var yeoman = require('yeoman-generator');

module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.Base.apply(this, arguments);

    this.argument('appname', {
      type: String,
      required: false
    });
  },

  initializing: function () {

  },

  writing: function () {
    this.mkdir(this.appname);
  }
});
