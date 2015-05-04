'use strict';

var _ = require('lodash');
var yeoman = require('yeoman-generator');
var randomString = require('randomstring');
var helpers = require('../../core/helpers');
var Core = require('../../core/core');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = Core.extend({
  constructor: function () {
    yeoman.Base.apply(this, arguments);

    this.argument('appName', {
      type: String,
      required: false
    });

    this.options('dbType', {
      description: 'Django database backends',
      type: String,
      required: false
    });

    this.options('dbUser', {
      type: String,
      required: false
    });

    this.options('dbPass', {
      type: String,
      required: false
    });
  },

  initializing: function() {
    this.pythonDbDrive = {
      postgresql_psycopg2: 'psycopg2',  // jshint ignore:line
      mysql: 'mysqlclient',
      sqlite3: '',
      oracle: 'cx_Oracle'
    };
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
        'Welcome to the priceless' + chalk.red('Bro') + ' generator!'
    ));

    var prompts = [{
      name: 'appName',
      message: 'Name of the project:',
      default: 'bro-project'
    }, {
      name: 'dbType',
      message: 'Database type',
      type: 'list',
      choices: _.keys(this.pythonDbDrive),
      default: 0
    }, {
      name: 'dbUser',
      message: 'User of database:',
      default: 'postgres'
    }, {
      name: 'dbPass',
      message: 'Password of database:',
      default: ''
    }];

    var newPrompts = [];

    var self = this;

    _.each(prompts, function(p){
      if (!self[p.name]) {
        newPrompts.push(p);
      }
    });

    this.prompt(newPrompts, function (props) {
      _.each(_.keys(props), function(key){
        self[key] = props[key];
      });

      done();
    }.bind(this));
  },

  context: function () {
    return {
      apps: this.config.get('apps'),
      appName: this.appName,
      rootUrlConfPath: 'server/config/urls.py',
      installedAppsPath: 'server/config/settings/installed_apps.py'
    };
  },

  writing: function() {
    this._writing();
  }
});
