'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('bro:app', function () {
  var mockPrompts = {
    dbType: 'postgresql_psycopg2',
    dbUser: 'postgres',
    dbPass: '1'
  };

  var expectedFiles = [
    'blog',
    'blog/.yo-rc.json',
    'blog/client',
    'blog/server',
    'blog/server/requirements.txt',
    'blog/server/__init__.py',
    'blog/server/manage.py',
    'blog/server/contrib',
    'blog/server/contrib/__init__.py',
    'blog/server/libs',
    'blog/server/libs/__init__.py',
    'blog/server/apps',
    'blog/server/apps/__init__.py',
    'blog/server/config',
    'blog/server/config/settings',
    'blog/server/config/settings/installed_apps.py',
    'blog/server/config/settings/settings.py',
    'blog/server/config/settings/__local.py',
    'blog/server/config/settings/__init__.py',
    'blog/server/config/settings/local.py',
    'blog/server/config/__init__.py',
    'blog/server/config/wsgi.py',
    'blog/server/config/urls.py',
    'blog/server/templates',
    'blog/server/templates/base.html'
  ];

  beforeEach(function (done) {
    var generatorsDir = path.dirname(path.dirname(__dirname));

    helpers.run(path.join(generatorsDir, 'app'), {inDirSet: true})
      .withArguments(['blog'])
      .withPrompts(mockPrompts)
      .on('end', done);
  });

  it('File Creation', function () {
    helpers.assertFile(expectedFiles);
  });
});
