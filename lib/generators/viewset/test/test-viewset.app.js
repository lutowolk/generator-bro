'use strict';

var fs = require('fs');
var path = require('path');
var f = require('../../../utils/generateFilesStruct').f;
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('bro:viewset', function () {
    describe('Create viewset', function () {
        beforeEach(function (done) {
            var generatorsDir = path.dirname(path.dirname(__dirname));

            helpers.run(path.join(generatorsDir, 'viewset'))
                .inDir(path.join(__dirname, './tmp'), function (dir) {
                    var content = fs.readFileSync(
                        path.join(__dirname, '../../app/templates/_yo-rc.json'));

                    var empty = fs.readFileSync(
                        path.join(__dirname, '../templates/init.py'));

                    fs.writeFileSync(path.join(dir, '.yo-rc.json'),
                        f(content.toString(), {drf: false}));

                    fs.mkdirSync('server');
                    fs.mkdirSync('server/apps');
                    fs.mkdirSync('server/apps/blog');
                    fs.mkdirSync('server/apps/blog/models');
                    fs.mkdirSync('server/apps/blog/viewsets');

                    fs.writeFileSync('server/apps/blog/models/__init__.py', empty);
                    fs.writeFileSync('server/apps/blog/viewsets/__init__.py', empty);

                    fs.writeFileSync('server/apps/blog/models/post.py', '');
                })
                .withArguments(['blog.Post'])
                .on('end', done);
        });

        it('viewsets/*.py created', function () {
            helpers.assertFile('server/apps/blog/viewsets/post.py');
        });

        it('viewsets/__init__.py updated', function () {
            assert.fileContent('server/apps/blog/viewsets/__init__.py',
                /from apps\.blog\.viewsets\.post import PostViewSet/);
        });
    });
    describe('Create viewset with file option', function () {
        beforeEach(function (done) {
            var generatorsDir = path.dirname(path.dirname(__dirname));

            helpers.run(path.join(generatorsDir, 'viewset'))
                .inDir(path.join(__dirname, './tmp'), function (dir) {
                    var content = fs.readFileSync(
                        path.join(__dirname, '../../app/templates/_yo-rc.json'));

                    var empty = fs.readFileSync(
                        path.join(__dirname, '../templates/init.py'));

                    fs.writeFileSync(path.join(dir, '.yo-rc.json'),
                        f(content.toString(), {drf: false}));

                    fs.mkdirSync('server');
                    fs.mkdirSync('server/apps');
                    fs.mkdirSync('server/apps/blog');
                    fs.mkdirSync('server/apps/blog/models');
                    fs.mkdirSync('server/apps/blog/viewsets');

                    fs.writeFileSync('server/apps/blog/models/__init__.py', empty);
                    fs.writeFileSync('server/apps/blog/viewsets/__init__.py', empty);

                    fs.writeFileSync('server/apps/blog/models/post.py', '');
                })
                .withArguments(['blog.Post'])
                .withOptions({file: 'viewsets/custom.py'})
                .on('end', done);
        });

        it('viewsets/*.py created', function () {
            helpers.assertFile('server/apps/blog/viewsets/custom.py');

            assert.fileContent('server/apps/blog/viewsets/custom.py',
                /from apps\.blog\.models\.post import Post/);

            assert.fileContent('server/apps/blog/viewsets/custom.py',
                /from rest_framework import viewsets/);
        });

        it('viewsets/__init__.py updated', function () {
            assert.fileContent('server/apps/blog/viewsets/__init__.py',
                /from apps\.blog\.viewsets\.custom import PostViewSet/);
        });
    });
    describe('Create viewset - update existing file', function () {
        beforeEach(function (done) {
            var generatorsDir = path.dirname(path.dirname(__dirname));

            helpers.run(path.join(generatorsDir, 'viewset'))
                .inDir(path.join(__dirname, './tmp'), function (dir) {
                    var content = fs.readFileSync(
                        path.join(__dirname, '../../app/templates/_yo-rc.json'));

                    var empty = fs.readFileSync(
                        path.join(__dirname, '../templates/init.py'));

                    fs.writeFileSync(path.join(dir, '.yo-rc.json'),
                        f(content.toString(), {drf: false}));

                    fs.mkdirSync('server');
                    fs.mkdirSync('server/apps');
                    fs.mkdirSync('server/apps/blog');
                    fs.mkdirSync('server/apps/blog/models');
                    fs.mkdirSync('server/apps/blog/viewsets');

                    fs.writeFileSync('server/apps/blog/models/__init__.py', empty);
                    fs.writeFileSync('server/apps/blog/viewsets/__init__.py', empty);

                    fs.writeFileSync('server/apps/blog/models/post.py', '');
                    fs.writeFileSync('server/apps/blog/viewsets/custom.py', empty);
                })
                .withArguments(['blog.Post'])
                .withOptions({file: 'viewsets/custom.py'})
                .on('end', done);
        });

        it('viewsets/*.py updated', function () {
            assert.fileContent('server/apps/blog/viewsets/custom.py',
                /class PostViewSet/);

            assert.fileContent('server/apps/blog/viewsets/custom.py',
                /from apps\.blog\.models\.post import Post/);

            assert.fileContent('server/apps/blog/viewsets/custom.py',
                /from rest_framework import viewsets/);
        });

        it('viewsets/__init__.py updated', function () {
            assert.fileContent('server/apps/blog/viewsets/__init__.py',
                /from apps\.blog\.viewsets\.custom import PostViewSet/);
        });
    });
});
