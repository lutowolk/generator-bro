'use strict';

var fs = require('fs');
var path = require('path');
var f = require('../../../utils/generateFilesStruct').f;
var mockery = require('mockery');

mockery.enable({
    warnOnReplace: false,
    warnOnUnregistered: false
});

mockery.registerMock('findup-sync', function(patterns, options) {
    return false;
});

var helpers = require('yeoman-generator').test;
var assert = require('yeoman-generator').assert;

mockery.disable();

describe('bro:config', function () {
    describe('Run config with all options', function () {
        beforeEach(function (done) {
            var generatorsDir = path.dirname(path.dirname(__dirname));
            helpers.run(path.join(generatorsDir, 'config'))
                .inDir(path.join(__dirname, './tmp'), function (dir) {
                    fs.mkdirSync('server');
                    fs.mkdirSync('server/apps');
                    fs.mkdirSync('server/templates');
                    fs.mkdirSync('server/config');
                    fs.mkdirSync('server/config/settings');
                    fs.writeFileSync('server/config/urls.py', '');
                })
                .withOptions({
                    apps: 'server/apps',
                    templates: 'server/templates',
                    settings: 'server/config/settings',
                    urls: 'server/config/urls.py'
                })
                .on('end', done);
        });
        it('.yo-rc.json created', function () {
            assert.file('.yo-rc.json');
            assert.fileContent('.yo-rc.json', /"apps": "server\/apps"/);
            assert.fileContent('.yo-rc.json', /"templates": "server\/templates"/);
            assert.fileContent('.yo-rc.json', /"installedAppsPath": "server\/config\/settings\/installed_apps.py"/);
            assert.fileContent('.yo-rc.json', /"rootUrlConfPath": "server\/config\/urls\.py"/);
        });
        it('installed_apps.py created', function () {
            assert.file('server/config/settings/installed_apps.py');
        });
    });
    describe('Run config without templates option', function () {
        beforeEach(function (done) {
            var generatorsDir = path.dirname(path.dirname(__dirname));

            helpers.run(path.join(generatorsDir, 'config'))
                .inDir(path.join(__dirname, './tmp'), function (dir) {
                    fs.mkdirSync('server');
                    fs.mkdirSync('server/apps');
                    fs.mkdirSync('server/config');
                    fs.mkdirSync('server/config/settings');
                    fs.writeFileSync('server/config/urls.py', '');
                })
                .withOptions({
                    apps: 'server/apps',
                    settings: 'server/config/settings',
                    urls: 'server/config/urls.py'
                })
                .on('end', done);
        });
        it('.yo-rc.json created', function () {
            assert.file('.yo-rc.json');
            assert.fileContent('.yo-rc.json', /"apps": "server\/apps"/);
            assert.fileContent('.yo-rc.json', /"installedAppsPath": "server\/config\/settings\/installed_apps.py"/);
            assert.fileContent('.yo-rc.json', /"rootUrlConfPath": "server\/config\/urls\.py"/);
            assert.noFileContent('.yo-rc.json', /"templates"/);
        });
        it('installed_apps.py created', function () {
            assert.file('server/config/settings/installed_apps.py');
        });
    });
    describe('Run config with invalid paths for options', function () {
        before(function (done) {
            var generatorsDir = path.dirname(path.dirname(__dirname));

            helpers.run(path.join(generatorsDir, 'config'))
                .inDir(path.join(__dirname, './tmp'), function (dir) {
                    fs.mkdirSync('bad_path');
                    fs.mkdirSync('bad_path/apps');
                    fs.mkdirSync('bad_path/config');
                    fs.mkdirSync('bad_path/config/settings');
                })
                .withOptions({
                    apps: 'server/apps',
                    settings: 'server/config/settings',
                    urls: 'server/config/urls.py'
                })
                .on('end', done);
        });
        it('.yo-rc.json not created', function () {
            assert.noFile('.yo-rc.json');
        });
        it('installed_apps.py not created', function () {
            assert.noFile('server/config/settings/installed_apps.py');
        });
    });
});
