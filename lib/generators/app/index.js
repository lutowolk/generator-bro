'use strict';

var _ = require('lodash');
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
    this.option('drf', {
      desc: 'Django rest framework support',
      type: Boolean,
      default: false
    });

    this.option('dbType', {
      desc: 'Django database backends: ' +
        'postgresql_psycopg2, mysql, sqlite3, oracle',
      type: String
    });

    this.option('dbUser', {
      type: String
    });

    this.option('dbPass', {
      type: String
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
      drf: this.opts.drf,
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