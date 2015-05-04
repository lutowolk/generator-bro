'use strict';

var fs = require('fs');
var path = require('path');
var f = require('../../../utils/generateFilesStruct').f;
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('bro:view', function () {
  describe('When views package exists', function () {
    beforeEach(function (done) {
      var generatorsDir = path.dirname(path.dirname(__dirname));

      helpers.run(path.join(generatorsDir, 'view'))
          .inDir(path.join(__dirname, './tmp'), function (dir) {
            var content = fs.readFileSync(
                path.join(__dirname, '../../app/templates/_yo-rc.json'));

            var empty = fs.readFileSync(
                path.join(__dirname, '../templates/init.py'));

            var models = fs.readFileSync(
                path.join(__dirname, '../../model/templates/_models.py'));

            var urls = fs.readFileSync(
                path.join(__dirname, '../../sub/templates/_urls.py'));

            var modelContext = {
              modelName: 'Post',
              fields: [
                'title = models.CharField(max_length=255)',
                'content = models.TextField()'
              ],
              isNameOrSlug: 'title'
            };

            var compiliedModels = f(models.toString(), modelContext);

            fs.writeFileSync(path.join(dir, '.yo-rc.json'), content);

            fs.mkdirSync('server');
            fs.mkdirSync('server/apps');
            fs.mkdirSync('server/apps/blog');
            fs.mkdirSync('server/apps/blog/forms');
            fs.mkdirSync('server/apps/blog/models');
            fs.mkdirSync('server/apps/blog/views');
            fs.mkdirSync('server/apps/blog/admin');
            fs.mkdirSync('server/templates');

            fs.writeFileSync('server/apps/blog/urls.py', urls);
            fs.writeFileSync('server/apps/blog/forms/__init__.py', empty);
            fs.writeFileSync('server/apps/blog/views/__init__.py', empty);
            fs.writeFileSync('server/apps/blog/models/__init__.py', empty);
            fs.writeFileSync('server/apps/blog/admin/__init__.py', empty);

            fs.writeFileSync('server/apps/blog/models/post.py', compiliedModels);
          })
          .withArguments(['blog:Post'])
          .withOptions({
            list: true, detail: true, create: true, update: true, del: true})
          .on('end', done);
    });

    it('views/*.py created', function () {
      helpers.assertFile('server/apps/blog/views/post.py');

      assert.fileContent('server/apps/blog/views/post.py',
          /class PostDetailView/);

      assert.fileContent('server/apps/blog/views/post.py',
          /class PostListView/);

      assert.fileContent('server/apps/blog/views/post.py',
          /class PostCreateView/);

      assert.fileContent('server/apps/blog/views/post.py',
          /class PostUpdateView/);

      assert.fileContent('server/apps/blog/views/post.py',
          /class PostDeleteView/);
    });
    it('forms/__init__.py updated', function () {
        assert.fileContent('server/apps/blog/forms/__init__.py',
            /from apps\.blog\.forms\.post import PostForm/);
    });
    it('forms/*.py created', function () {
        helpers.assertFile('server/apps/blog/forms/post.py');

        assert.fileContent('server/apps/blog/forms/post.py',
            /class PostForm/);
    });
    it('templates/*_list.html created', function () {
        helpers.assertFile('server/templates/post_list.html');
    });
    it('templates/*_detail.html created', function () {
        helpers.assertFile('server/templates/post_detail.html');
    });
    it('templates/*_form.html created', function () {
        helpers.assertFile('server/templates/post_form.html');
    });
  });
  describe('When views.py exists', function () {
    beforeEach(function (done) {
      var generatorsDir = path.dirname(path.dirname(__dirname));

      helpers.run(path.join(generatorsDir, 'view'))
        .inDir(path.join(__dirname, './tmp'), function (dir) {
          var content = fs.readFileSync(
            path.join(__dirname, '../../app/templates/_yo-rc.json'));

          var empty = fs.readFileSync(
            path.join(__dirname, '../templates/init.py'));

          var models = fs.readFileSync(
            path.join(__dirname, '../../model/templates/_models.py'));

          var urls = fs.readFileSync(
            path.join(__dirname, '../../sub/templates/_urls.py'));

          var modelContext = {
            modelName: 'Post',
            fields: [
                'title = models.CharField(max_length=255)',
                'content = models.TextField()'
            ],
            isNameOrSlug: 'title'
          };

          var compiliedModels = f(models.toString(), modelContext);

          fs.writeFileSync(path.join(dir, '.yo-rc.json'), content);

          fs.mkdirSync('server');
          fs.mkdirSync('server/apps');
          fs.mkdirSync('server/apps/blog');
          fs.mkdirSync('server/apps/blog/forms');
          fs.mkdirSync('server/apps/blog/models');
          fs.mkdirSync('server/apps/blog/admin');
          fs.mkdirSync('server/templates');

          fs.writeFileSync('server/apps/blog/views.py', empty);
          fs.writeFileSync('server/apps/blog/urls.py', urls);
          fs.writeFileSync('server/apps/blog/forms/__init__.py', empty);
          fs.writeFileSync('server/apps/blog/models/__init__.py', empty);
          fs.writeFileSync('server/apps/blog/admin/__init__.py', empty);

          fs.writeFileSync('server/apps/blog/models/post.py', compiliedModels);
        })
        .withArguments(['blog:Post'])
        .withOptions({
            list: true, detail: true, create: true, update: true, del: true})
        .on('end', done);
    });

    it('views.py updated', function () {
      assert.fileContent('server/apps/blog/views.py',
          /class PostDetailView/);

      assert.fileContent('server/apps/blog/views.py',
          /class PostListView/);

      assert.fileContent('server/apps/blog/views.py',
          /class PostCreateView/);

      assert.fileContent('server/apps/blog/views.py',
          /class PostUpdateView/);

      assert.fileContent('server/apps/blog/views.py',
          /class PostDeleteView/);
    });
    it('forms/__init__.py updated', function () {
          assert.fileContent('server/apps/blog/forms/__init__.py',
              /from apps\.blog\.forms\.post import PostForm/);
      });
    it('forms/*.py created', function () {
          helpers.assertFile('server/apps/blog/forms/post.py');

          assert.fileContent('server/apps/blog/forms/post.py',
              /class PostForm/);
      });
    it('templates/*_list.html created', function () {
          helpers.assertFile('server/templates/post_list.html');
      });
    it('templates/*_detail.html created', function () {
          helpers.assertFile('server/templates/post_detail.html');
      });
    it('templates/*_form.html created', function () {
          helpers.assertFile('server/templates/post_form.html');
      });
  });
  //describe('When model and admin options use', function () {
  //  beforeEach(function (done) {
  //    var generatorsDir = path.dirname(path.dirname(__dirname));
  //
  //    helpers.run(path.join(generatorsDir, 'model'))
  //        .inDir(path.join(__dirname, './tmp'), function (dir) {
  //          var yoRc = fs.readFileSync(
  //              path.join(__dirname, '../../app/templates/_yo-rc.json'));
  //
  //          var empty = fs.readFileSync(
  //              path.join(__dirname, '../templates/init.py'));
  //
  //          fs.writeFileSync(path.join(dir, '.yo-rc.json'), yoRc);
  //
  //          fs.mkdirSync('server');
  //          fs.mkdirSync('server/apps');
  //          fs.mkdirSync('server/apps/blog');
  //          fs.mkdirSync('server/apps/blog/models');
  //          fs.mkdirSync('server/apps/blog/admin');
  //
  //          fs.writeFileSync('server/apps/blog/models/blog.py', empty);
  //          fs.writeFileSync('server/apps/blog/admin/blog.py', empty);
  //        })
  //        .withArguments(['blog:Post'])
  //        .withOptions({model: 'Blog', admin: 'Blog'})
  //        .on('end', done);
  //  });
  //
  //  it('User file models updated', function () {
  //    assert.fileContent('server/apps/blog/models/blog.py', /class Post/);
  //  });
  //
  //  it('User file admin updated', function () {
  //    assert.fileContent('server/apps/blog/admin/blog.py', /class PostAdmin/);
  //  });
  //});
});
