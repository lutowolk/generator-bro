'use strict';

var fs = require('fs');
var path = require('path');
var f = require('../../../utils/generateFilesStruct').f;
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('bro:view', function () {
  describe('Config creating', function () {
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

    it('.yo-rc.json created', function () {
      helpers.assertFile('.yo-rc.json');

      //assert.fileContent('server/apps/blog/views/post.py',
      //    /class PostDetailView/);
    });
    it('installed_apps.py updated', function () {
      helpers.assertFile('server/config/settings/installed_apps.py');

      //assert.fileContent('server/apps/blog/urls.py',
      //  /url\(r'\^post\/\$', PostListView.as_view\(\), name='post\.list'\),/);
    });
  });
});
