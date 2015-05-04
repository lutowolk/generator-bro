'use strict';

var fs = require('fs');
var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('bro:sub', function () {
  describe('Create new app', function () {
    beforeEach(function (done) {
      var generatorsDir = path.dirname(path.dirname(__dirname));

      helpers.run(path.join(generatorsDir, 'sub'))
          .inDir(path.join(__dirname, './tmp'), function (dir) {
            var content = fs.readFileSync(
                path.join(__dirname, '../../app/templates/_yo-rc.json'));

            var urls = fs.readFileSync(
                path.join(__dirname, '../../app/templates/server/config/urls.py'));

            var installedApps = fs.readFileSync(
                path.join(__dirname, '../../app/templates/server/config/installed_apps.py'));

            fs.writeFileSync(path.join(dir, '.yo-rc.json'), content);

            fs.mkdirSync('server');
            fs.mkdirSync('server/apps');
            fs.mkdirSync('server/config');
            fs.mkdirSync('server/config/settings');

            fs.writeFileSync('server/config/urls.py', urls);
            fs.writeFileSync('server/config/settings/installed_apps.py', installedApps);
          })
          .withArguments(['blog'])
          .on('end', done);
    });

    it('App files created', function () {
      var expectedFiles = [
        'server/apps/blog/__init__.py',
        'server/apps/blog/models',
        'server/apps/blog/models/__init__.py',
        'server/apps/blog/models/mixins',
        'server/apps/blog/models/mixins/__init__.py',
        'server/apps/blog/views',
        'server/apps/blog/views/__init__.py',
        'server/apps/blog/views/mixins',
        'server/apps/blog/views/mixins/__init__.py',
        'server/apps/blog/tests',
        'server/apps/blog/tests/__init__.py',
        'server/apps/blog/tests/models',
        'server/apps/blog/tests/models/__init__.py',
        'server/apps/blog/tests/views',
        'server/apps/blog/tests/views/__init__.py',
        'server/apps/blog/factories',
        'server/apps/blog/factories/__init__.py',
        'server/apps/blog/admin',
        'server/apps/blog/admin/__init__.py',
        'server/apps/blog/admin/mixins',
        'server/apps/blog/admin/mixins/__init__.py'
      ];

      helpers.assertFile(expectedFiles);
    });

    it('File installed_apps.py updated', function () {
      assert.fileContent('server/config/urls.py',
        /url\(r'\^blog\/', include\('apps\.blog\.urls', namespace='blog'\)\)/);
    });

    it('File urls.py updated', function () {
      assert.fileContent('server/config/settings/installed_apps.py',
        /apps\.blog/);
    });
  });
});
