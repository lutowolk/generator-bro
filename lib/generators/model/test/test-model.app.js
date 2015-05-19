'use strict';

var fs = require('fs');
var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var f = require('../../../utils/generateFilesStruct').f;

describe('bro:model', function () {
  describe('When packages with model and admin exists', function () {
    beforeEach(function (done) {
      var generatorsDir = path.dirname(path.dirname(__dirname));

      helpers.run(path.join(generatorsDir, 'model'))
        .inDir(path.join(__dirname, './tmp'), function (dir) {
          var content = fs.readFileSync(
            path.join(__dirname, '../../app/templates/_yo-rc.json'));

          var empty = fs.readFileSync(
              path.join(__dirname, '../templates/init.py'));

          fs.writeFileSync(
              path.join(dir, '.yo-rc.json'),
              f(content.toString(), {drf: false}));

          fs.mkdirSync('server');
          fs.mkdirSync('server/apps');
          fs.mkdirSync('server/apps/blog');
          fs.mkdirSync('server/apps/blog/models');
          fs.mkdirSync('server/apps/blog/admin');

          fs.writeFileSync('server/apps/blog/models/__init__.py', empty);
          fs.writeFileSync('server/apps/blog/admin/__init__.py', empty);
        })
        .withArguments(['blog:Post', 'title:char', 'content:text'])
        .on('end', done);
    });

    it('File model create', function () {
      helpers.assertFile('server/apps/blog/models/post.py');

      assert.fileContent('server/apps/blog/models/post.py',
          /title = models.CharField/);

      assert.fileContent('server/apps/blog/models/post.py',
          /content = models.TextField/);
    });

    it('Model imported', function () {
      assert.fileContent('server/apps/blog/models/__init__.py',
        /from apps\.blog\.models\.post import Post/);
    });

    it('File admin create', function () {
      helpers.assertFile('server/apps/blog/admin/post.py');
    });

    it('Admin imported', function () {
      assert.fileContent('server/apps/blog/admin/__init__.py',
        /from apps\.blog\.admin\.post import PostAdmin/);
    });
  });
  describe('When models.py and admin.py exists', function () {
    beforeEach(function (done) {
      var generatorsDir = path.dirname(path.dirname(__dirname));

      helpers.run(path.join(generatorsDir, 'model'))
          .inDir(path.join(__dirname, './tmp'), function (dir) {
            var yoRc = fs.readFileSync(
                path.join(__dirname, '../../app/templates/_yo-rc.json'));

            var empty = fs.readFileSync(
                path.join(__dirname, '../templates/init.py'));

            fs.writeFileSync(
                path.join(dir, '.yo-rc.json'),
                f(yoRc.toString(), {drf: false}));

            fs.mkdirSync('server');
            fs.mkdirSync('server/apps');
            fs.mkdirSync('server/apps/blog');

            fs.writeFileSync('server/apps/blog/models.py', empty);
            fs.writeFileSync('server/apps/blog/admin.py', empty);
          })
          .withArguments(['blog:Post'])
          .on('end', done);
    });

    it('File models.py updated', function () {
      assert.fileContent('server/apps/blog/models.py', /class Post/);
    });

    it('File admin.py updated', function () {
      assert.fileContent('server/apps/blog/admin.py', /class PostAdmin/);
    });
  });
  describe('When model and admin options use', function () {
    beforeEach(function (done) {
      var generatorsDir = path.dirname(path.dirname(__dirname));

      helpers.run(path.join(generatorsDir, 'model'))
          .inDir(path.join(__dirname, './tmp'), function (dir) {
            var yoRc = fs.readFileSync(
                path.join(__dirname, '../../app/templates/_yo-rc.json'));

            var empty = fs.readFileSync(
                path.join(__dirname, '../templates/init.py'));

            fs.writeFileSync(
                path.join(dir, '.yo-rc.json'),
                f(yoRc.toString(), {drf: false}));

            fs.mkdirSync('server');
            fs.mkdirSync('server/apps');
            fs.mkdirSync('server/apps/blog');
            fs.mkdirSync('server/apps/blog/models');
            fs.mkdirSync('server/apps/blog/admin');

            fs.writeFileSync('server/apps/blog/models/blog.py', empty);
            fs.writeFileSync('server/apps/blog/admin/blog.py', empty);
          })
          .withArguments(['blog:Post'])
          .withOptions({model: 'Blog', admin: 'Blog'})
          .on('end', done);
    });

    it('User file models updated', function () {
      assert.fileContent('server/apps/blog/models/blog.py', /class Post/);
    });

    it('User file admin updated', function () {
      assert.fileContent('server/apps/blog/admin/blog.py', /class PostAdmin/);
    });
  });
});
