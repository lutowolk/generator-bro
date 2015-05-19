'use strict';

var fs = require('fs');
var path = require('path');
var f = require('../../../utils/generateFilesStruct').f;
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('bro:serializer', function () {
    describe('Create serializer', function () {
        beforeEach(function (done) {
            var generatorsDir = path.dirname(path.dirname(__dirname));

            helpers.run(path.join(generatorsDir, 'serializer'))
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
                    fs.mkdirSync('server/apps/blog/serializers');

                    fs.writeFileSync('server/apps/blog/models/__init__.py', empty);
                    fs.writeFileSync('server/apps/blog/serializers/__init__.py', empty);

                    fs.writeFileSync('server/apps/blog/models/post.py', '');
                })
                .withArguments(['blog.Post'])
                .on('end', done);
        });

        it('serializers/*.py created', function () {
            helpers.assertFile('server/apps/blog/serializers/post.py');
        });

        it('serializers/__init__.py updated', function () {
            assert.fileContent('server/apps/blog/serializers/__init__.py',
                /from apps\.blog\.serializers\.post import PostSerializer/);
        });
    });
    describe('Create serializer with file option', function () {
        beforeEach(function (done) {
            var generatorsDir = path.dirname(path.dirname(__dirname));

            helpers.run(path.join(generatorsDir, 'serializer'))
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
                    fs.mkdirSync('server/apps/blog/serializers');

                    fs.writeFileSync('server/apps/blog/models/__init__.py', empty);
                    fs.writeFileSync('server/apps/blog/serializers/__init__.py', empty);

                    fs.writeFileSync('server/apps/blog/models/post.py', '');
                })
                .withArguments(['blog.Post'])
                .withOptions({file: 'serializers/custom.py'})
                .on('end', done);
        });

        it('serializers/*.py created', function () {
            helpers.assertFile('server/apps/blog/serializers/custom.py');

            assert.fileContent('server/apps/blog/serializers/custom.py',
                /from apps\.blog\.models\.post import Post/);

            assert.fileContent('server/apps/blog/serializers/custom.py',
                /from rest_framework import serializers/);
        });

        it('serializers/__init__.py updated', function () {
            assert.fileContent('server/apps/blog/serializers/__init__.py',
                /from apps\.blog\.serializers\.custom import PostSerializer/);
        });
    });
    describe('Create serializer - update existing file', function () {
        beforeEach(function (done) {
            var generatorsDir = path.dirname(path.dirname(__dirname));

            helpers.run(path.join(generatorsDir, 'serializer'))
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
                    fs.mkdirSync('server/apps/blog/serializers');

                    fs.writeFileSync('server/apps/blog/models/__init__.py', empty);
                    fs.writeFileSync('server/apps/blog/serializers/__init__.py', empty);

                    fs.writeFileSync('server/apps/blog/models/post.py', '');
                    fs.writeFileSync('server/apps/blog/serializers/custom.py', empty);
                })
                .withArguments(['blog.Post'])
                .withOptions({file: 'serializers/custom.py'})
                .on('end', done);
        });

        it('serializers/*.py updated', function () {
            assert.fileContent('server/apps/blog/serializers/custom.py',
                /class PostSerializer/);

            assert.fileContent('server/apps/blog/serializers/custom.py',
                /from apps\.blog\.models\.post import Post/);

            assert.fileContent('server/apps/blog/serializers/custom.py',
                /from rest_framework import serializers/);
        });

        it('serializers/__init__.py updated', function () {
            assert.fileContent('server/apps/blog/serializers/__init__.py',
                /from apps\.blog\.serializers\.custom import PostSerializer/);
        });
    });
});
