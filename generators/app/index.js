'use strict';
var yeoman = require('yeoman-generator');
var randomString = require('randomstring');
var chalk = require('chalk');
var yosay = require('yosay');

// constant
var PythonDbDrive = {
  postgresql_psycopg2: 'psycopg2',  // jshint ignore:line
  mysql: 'mysqlclient',
  sqlite3: '',
  oracle: 'cx_Oracle'
};

module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.Base.apply(this, arguments);

    this.argument('appName', {
      type: String,
      required: false
    });
    this.argument('dbType', {
      description: 'Available database backends: ' + this._.keys(PythonDbDrive).join(', '),
      type: String,
      required: false
    });
    this.argument('dbUser', {
      type: String,
      required: false
    });
    this.argument('dbPass', {
      type: String,
      required: false
    });
  },

  initializing: function () {
    this.pkg = require('../../package.json');
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
      choices: this._.keys(PythonDbDrive),
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

    this._.each(prompts, function(p){
      if (!self[p.name]) {
        newPrompts.push(p);
      }
    });

    this.prompt(newPrompts, function (props) {
      self._.each(self._.keys(props), function(key){
        self[key] = props[key];
      });

      done();
    }.bind(this));
  },

  writing: {
      appDirectories: function () {
        var structJSON = this.src.readJSON('../struct.json');
        generateFileStruct(structJSON, './', this);

        // Root folder.
        this.mkdir(this.projectName);

        // Client folder.
        this.mkdir(this.projectName + '/client');

        // Server folder.
        this.mkdir(this.projectName + '/server');

        // Contrib and libs.
        this.mkdir(this.projectName + '/server/contrib');
        this.mkdir(this.projectName + '/server/libs');
        this.mkdir(this.projectName + '/server/apps');

        // Templates folder.
        this.mkdir(this.projectName + '/server/templates');

        // Static files folder.
        this.mkdir(this.projectName + '/server/config');
        this.mkdir(this.projectName + '/server/config/settings');
      },

      appFiles: function () {
        // generate secret for settings.py
        this.secret = randomString.generate(48);

        // server.config files

        this.copy(
          'config/init.py',
          this.projectName + '/server/config/settings/__init__.py'
        );
        this.template(
          'config/_settings.py',
          this.projectName + '/server/config/settings/settings.py'
        );
        this.template(
          'config/_local.py',
          this.projectName + '/server/config/settings/__local.py'
        );
        this.template(
          'config/_local.py',
          this.projectName + '/server/config/settings/local.py'
        );
        this.copy(
          'init.py',
          this.projectName + '/server/config/__init__.py'
        );
        this.copy(
          'config/urls.py',
          this.projectName + '/server/config/urls.py'
        );
        this.template(
          'config/_wsgi.py',
          this.projectName + '/server/config/wsgi.py'
        );

        // server files

        this.copy(
          'init.py',
          this.projectName + '/server/__init__.py'
        );
        this.copy(
          'manage.py',
          this.projectName + '/server/manage.py'
        );

        // set database python driver
        this.pyDbDrive = PythonDbDrive[this.dbType];

        this.copy(
          'requirements.txt',
          this.projectName + '/server/requirements.txt'
        );
      }
  },

  install: function () {
    // install deps project
  }
});
