'use strict';

var generateFileStruct = require('../../utils/generateFilesStruct').generateFileStruct;
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

    // get root dir of this generator for yo-rc
    this.gRootDir = this._.first(this.options.resolved
      .split(this.config.name)) + this.config.name;

    // set interpolate symbols {{ foo }}
    this._.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
    this._.templateSettings.escape = /{{-([\s\S]+?)}}/g;
    this._.templateSettings.evaluate = /{{([\s\S]+?)}}/g;

    this.argument('appName', {
      type: String, required: false
    });
    this.argument('dbType', {
      description: 'Available database backends: ' + this._.keys(PythonDbDrive).join(', '),
      type: String, required: false
    });
    this.argument('dbUser', {
      type: String, required: false
    });
    this.argument('dbPass', {
      type: String, required: false
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
        var structJSON = this.fs.readJSON(
          this.templatePath('../struct.json'));

        // generate secret for settings.py
        this.secret = randomString.generate(48);

        // python db driver
        this.pyDbDrive = PythonDbDrive[this.dbType];

        generateFileStruct(structJSON, './', this);
      }
  },

  install: function () {
    // install deps project
  }
});
