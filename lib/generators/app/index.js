'use strict';

var _ = require('lodash');
var yeoman = require('yeoman-generator');
var randomString = require('randomstring');
var helpers = require('../../core/helpers');
var core =  require('../../core/generators/core');

module.exports = helpers.extendOf(yeoman.Base, core, {
  constructor: function () {
    yeoman.Base.apply(this, arguments);

    this.argument('appName', {
      type: String,
      required: false
    });

    this.option('dbType', {
      description: 'Django database backends',
      type: String,
      required: false
    });

    this.option('dbUser', {
      type: String,
      required: false
    });

    this.option('dbPass', {
      type: String,
      required: false
    });
  },

  initializing: function() {
    var pythonDbDrive = {
      postgresql_psycopg2: 'psycopg2',  // jshint ignore:line
      mysql: 'mysqlclient',
      sqlite3: '',
      oracle: 'cx_Oracle'
    };
    this.dbType = this.options.dbType;
    this.dbUser = this.options.dbUser;
    this.dbPass = this.options.dbPass;
    this.pyDbDrive = pythonDbDrive[this.dbType];
  },

  context: function () {
    return {
      apps: this.config.get('apps'),
      appName: this.appName,
      dbType: this.dbType,
      dbUser: this.dbUser,
      dbPass: this.dbPass,
      pyDbDrive: this.pyDbDrive,
      secret: randomString.generate(48)
    };
  }
});
