'use strict';

var path = require('path');
var fs = require('fs');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('bro:model', function () {
  var model;
  var mockPrompts = {
    dbType: 'postgresql_psycopg2',
    dbUser: 'postgres',
    dbPass: '1'
  };
  var expectedFiles = [
    'server/apps/post/models/comment.py',
    'server/apps/post/admin/comment.py'
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

        var newApp = helpers.createGenerator(
          'bro:singleapp',
          [path.join(generatorsDir, 'singleapp')],
          ['post'],
          {force: true}
        );
        newApp.run(function(){
          model = helpers.createGenerator(
            'bro:model',
            [path.join(generatorsDir, 'model')],
            ['post:Comment'],
            {force: true}
          );
          done();
        });
      });
    });
  });

  afterEach(function(done) {
    done();
  });

  it('File Creation', function (done) {
    model.run(function(){
      helpers.assertFile(expectedFiles);
      done();
    });
  });

  it('File Customization', function (done) {
    model.run(function(){
      helpers.assertFileContent(
        'server/apps/post/models/__init__.py',
        'from apps.post.models.comment import *'
      );
      helpers.assertFileContent(
        'server/apps/post/admin/__init__.py',
        'from apps.post.admin.comment import *'
      );
      done();
    });
  });
});
