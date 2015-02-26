'use strict';
var yeoman = require('yeoman-generator');
var randomString = require('randomstring');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
    initializing: function () {
        this.pkg = require('../package.json');
    },

    prompting: function () {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the priceless' + chalk.red('Bro') + ' generator!'
        ));

        var prompts = [{
            name: 'projectName',
            message: 'Name of the project:',
            default: 'bro-project'
        }, {
            name: 'dbType',
            message: 'Database type',
            type: 'list',
            choices: ['postgres_psycopg2', 'mysql', 'sqlite3', 'oracle'],
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

        this.prompt(prompts, function (props) {
            this.projectName = props.projectName;
            this.dbType = props.dbType;
            this.dbUser = props.dbUser;
            this.dbPass = props.dbPass;

            done();
        }.bind(this));
    },

    writing: {
        app: function () {
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

            this.fs.copy(
                'config/init.py',
                this.projectName + '/server/config/settings/__init__.py'
            );

            this.secret = randomString.generate(48);

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
            this.fs.copy(
                'init.py',
                this.projectName + '/server/config/__init__.py'
            );
            this.fs.copy(
                'config/urls.py',
                this.projectName + '/server/config/urls.py'
            );
            this.template(
                'config/_wsgi.py',
                this.projectName + '/server/config/wsgi.py'
            );
        },

        projectfiles: function () {
            this.fs.copy(
                this.templatePath('init.py'),
                this.destinationPath(this.projectName + '/server/__init__.py')
            );
            this.fs.copy(
                this.templatePath('manage.py'),
                this.destinationPath(this.projectName + '/server/manage.py')
            );
            this.fs.copy(
              this.templatePath('requirements.txt'),
              this.destinationPath(this.projectName + '/server/requirements.txt')
            );
        }
    },

    install: function () {
        // install deps project
    }
});
