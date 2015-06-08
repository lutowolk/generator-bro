'use strict';

var fs = require('fs');
var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('bro:app', function () {
  describe('Create project', function () {
    beforeEach(function (done) {
      var generatorsDir = path.dirname(path.dirname(__dirname));

      helpers.run(path.join(generatorsDir, 'app'))
          .withArguments(['blog'])
          .withOptions({
            dbType: 'postgresql_psycopg2',
            dbUser: 'postgres',
            dbPass: '1'
          })
          .on('end', done);
    });

    it('Project files created', function () {
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
          'blog/server/core',
          'blog/server/core/templates',
          'blog/server/core/templates/list_tag.html',
          'blog/server/core/templates/form_tag.html',
          'blog/server/core/templatetags',
          'blog/server/core/templatetags/core.py',
          'blog/server/core/templatetags/__init__.py',
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

      helpers.assertFile(expectedFiles);
    });

    it('Check local settings', function() {
      helpers.assertFileContent(
        'blog/server/config/settings/__local.py',
        /'ENGINE': 'django\.db\.backends\.postgresql_psycopg2'/);

      helpers.assertFileContent(
        'blog/server/config/settings/__local.py',
        /'NAME': 'blog'/);

      helpers.assertFileContent(
        'blog/server/config/settings/__local.py',
        /'USER': 'postgres'/);

      helpers.assertFileContent(
        'blog/server/config/settings/__local.py',
        /'PASSWORD': '1'/);
    });
  });
  describe('Create project with drf', function () {
      beforeEach(function (done) {
          var generatorsDir = path.dirname(path.dirname(__dirname));

          helpers.run(path.join(generatorsDir, 'app'))
              .withArguments(['blog'])
              .withOptions({
                  dbType: 'postgresql_psycopg2',
                  dbUser: 'postgres',
                  dbPass: '1',
                  drf: true
              })
              .on('end', done);
      });

      it('Check drf', function() {
          helpers.assertFileContent(
              'blog/server/config/urls.py',
              /url\(r'\^api\-auth\/', include\('rest_framework\.urls', namespace='rest_framework'\)\)/);

          helpers.assertFileContent(
              'blog/server/requirements.txt',
              /djangorestframework==3\.1/);

          helpers.assertFileContent(
              'blog/server/config/settings/installed_apps.py',
              /'rest_framework',/);

          helpers.assertFileContent(
              'blog/server/config/settings/settings.py',
              /REST_FRAMEWORK/);

          helpers.assertFileContent(
              'blog/.yo-rc.json',
              /"drf": true/);
      });
  });
});

