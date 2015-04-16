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
    'server/templates/post_detail.html',
    'server/templates/post_list.html'
  ];

  beforeEach(function (done) {
    var generatorsDir = path.dirname(path.dirname(__dirname));

    helpers.run(path.join(generatorsDir, 'singleapp'), {inDirSet: true})
      .withOptions({force: true})
      .withArguments(['post'])
      .withPrompts(mockPrompts)
      .on('ready', function (generator) {
        helpers.run(path.join(generatorsDir, 'app'))
          .withArguments(['blog'])
          .withPrompts(mockPrompts)
          .on('end', done);
      })
      .on('end', done);
  });

  it('File Creation', function () {
    helpers.assertFile(expectedFiles);
  });
});
