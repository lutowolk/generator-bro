'use strict';

var _ = require('lodash');
var yeoman = require('yeoman-generator');
var randomString = require('randomstring');
var helpers = require('../../core/helpers');
var core = require('../../core/generators/core');
var gHelper = require('../../core/generators/helper');

module.exports = helpers.extendOf(gHelper, core, {
  setArguments: function() {
    this.argument('appName', {
      type: String,
      required: false
    });
  },

  setOptions: function () {
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

  setContext: function () {
    var pythonDbDrive = {
      postgresql_psycopg2: 'psycopg2',  // jshint ignore:line
      mysql: 'mysqlclient',
      sqlite3: '',
      oracle: 'cx_Oracle'
    };

    return {
      apps: this.config.get('apps'),
      appName: this.appName,
      dbType: this.options.dbType,
      dbUser: this.options.dbUser,
      dbPass: this.options.dbPass,
      pyDbDrive: pythonDbDrive[this.dbType],
      secret: randomString.generate(48)
    };
  }
});
