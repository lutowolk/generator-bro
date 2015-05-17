'use strict';

var _ = require('lodash');
var yeoman = require('yeoman-generator');
var randomString = require('randomstring');
var helpers = require('../../core/helpers');
var core = require('../../core/generators/core');
var gHelper = require('../../core/generators/helper');

var selfGenerator = {
  _setArguments: function() {
    this.argument('appName', {
      type: String,
      required: false
    });
  },

  _setOptions: function () {
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

  _setContext: function () {
    var pythonDbDrive = {
      postgresql_psycopg2: 'psycopg2',  // jshint ignore:line
      mysql: 'mysqlclient',
      sqlite3: '',
      oracle: 'cx_Oracle'
    };

    return {
      apps: this.config.get('apps'),
      appName: this.appName,
      dbType: this.opts.dbType,
      dbUser: this.opts.dbUser,
      dbPass: this.opts.dbPass,
      pyDbDrive: pythonDbDrive[this.opts.dbType],
      secret: randomString.generate(48)
    };
  }
};

module.exports = helpers.extendOf(gHelper, core, selfGenerator);