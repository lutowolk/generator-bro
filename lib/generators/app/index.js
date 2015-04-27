'use strict';

var yeoman = require('yeoman-generator');
var randomString = require('randomstring');
var helpers = require('../../core/helpers');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = helpers.extend({
  constructor: function () {
    yeoman.Base.apply(this, arguments);

    // get root dir of this generator for yo-rc
    this.gRootDir = this._.first(this.options.resolved
      .split(this.config.name)) + this.config.name;

    this.argument('appName', {
      type: String, required: false
    });
    this.argument('dbType', {
      description: 'Available database backends: ' + this._.keys(
        this.pythonDbDrive).join(', '),
      type: String, required: false
    });
    this.argument('dbUser', {
      type: String, required: false
    });
    this.argument('dbPass', {
      type: String, required: false
    });
  },

  initializing: {
    initVars: function() {
      this.pythonDbDrive = {
        postgresql_psycopg2: 'psycopg2',  // jshint ignore:line
        mysql: 'mysqlclient',
        sqlite3: '',
        oracle: 'cx_Oracle'
      };
    },
    loadPackageJson: function() {
      this.pkg = require('../../../package.json');
    },
    loadJsonMap: function() {
      this.JsonMap = this.fs.readJSON(this.templatePath('../struct.json'));
    }
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
      choices: this._.keys(this.pythonDbDrive),
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
    createFiles: function () {
      var self = this;

      createFromJsonMap();

      /////////////

      function createFromJsonMap() {
        var context = {
          apps: self.config.apps,
          appName: self.appName,
          secret: randomString.generate(48),
          pyDbDrive: self.pythonDbDrive[self.dbType]
        };

        self.createFilesFromJson(self.JsonMap, './', context);
      }
    }
  }
});
