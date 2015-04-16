'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('bro:singleapp', function () {
  var mockPrompts = {
    dbType: 'postgresql_psycopg2',
    dbUser: 'postgres',
    dbPass: '1'
  };
  var newApp;

  var expectedFiles = [
    'server/apps/post',
    'server/apps/post/urls.py',
    'server/apps/post/__init__.py',
    'server/apps/post/factories',
    'server/apps/post/factories/post.py',
    'server/apps/post/factories/__init__.py',
    'server/apps/post/models',
    'server/apps/post/models/post.py',
    'server/apps/post/models/__init__.py',
    'server/apps/post/models/mixins',
    'server/apps/post/models/mixins/__init__.py',
    'server/apps/post/views',
    'server/apps/post/views/post.py',
    'server/apps/post/views/__init__.py',
    'server/apps/post/views/mixins',
    'server/apps/post/views/__init__.py',
    'server/apps/post/admin',
    'server/apps/post/admin/post.py',
    'server/apps/post/admin/__init__.py',
    'server/apps/post/admin/mixins',
    'server/apps/post/admin/mixins/__init__.py',
    'server/apps/post/tests',
    'server/apps/post/tests/__init__.py',
    'server/apps/post/tests/models',
    'server/apps/post/tests/models/test_post.py',
    'server/apps/post/tests/models/__init__.py',
    'server/apps/post/tests/views',
    'server/apps/post/tests/views/test_post.py',
    'server/apps/post/tests/views/__init__.py',
    'server/templates',
    'server/templates/post',
    'server/templates/post/post_detail.html',
    'server/templates/post/post_list.html'
  ];

  beforeEach(function (done) {
    var generatorsDir = path.dirname(path.dirname(__dirname));

    helpers.testDirectory(path.join(__dirname, 'tmp'), function (err) {
      if (err) {
        done(err);
      }

      var djangoApp = helpers.createGenerator(
        'bro:app',
        [path.join(generatorsDir, 'app')],
        ['blog']
      );
      helpers.mockPrompt(djangoApp, mockPrompts);

      process.chdir(path.join(__dirname, 'tmp'));

      djangoApp.run(function () {
        process.chdir(path.join(__dirname, 'tmp', 'blog'));

        newApp = helpers.createGenerator(
          'bro:singleapp',
          [path.join(generatorsDir, 'singleapp')],
          ['post'],
          {force: true}
        );
        done();
      });
    });
  });

  afterEach(function(done) {
    done();
  });

  it('File Creation', function (done) {
    newApp.run(function(){
      helpers.assertFile(expectedFiles);
      done();
    });
  });

  it('File Customization', function (done) {
    newApp.run(function(){
      helpers.assertFileContent(
          'server/config/urls.py',
          'url(r\'^post/\', include(\'apps.post.urls\')),'
      );
      helpers.assertFileContent(
          'server/config/settings/installed_apps.py',
          '\'apps.post\','
      );
      done();
    });
  });
});
