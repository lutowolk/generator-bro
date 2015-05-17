'use strict';

var _ = require('lodash');
var yeoman = require('yeoman-generator');
var format = require('util').format;
var colors = require('colors');
var path = require('path');
var fs = require('fs');
var helpers = require('../../core/helpers');
var core = require('../../core/generators/core');
var gHelper = require('../../core/generators/helper');

var selfGenerator = {
  _setArguments: function () {
    this.argument('appName', {
      type: String,
      required: false
    });
  },

  _setOptions: function () {
    this.option('force', {
      desc: 'Overwrite files that already exist',
      type: Boolean, defaults: false});
  },

  _setContext: function () {
    return {
      apps: this.config.get('apps'),
      app: path.join(this.config.get('apps'), this.appName),
      appName: this.appName,
      rootUrlConfPath: this.config.get('rootUrlConfPath'),
      installedAppsPath: this.config.get('installedAppsPath')
    };
  },

  _afterInit: function () {
    this.conflicter.force = this.options.force;
  },

  creating: {
    // installed_apps.py
    installedApps: {
      dst: '{{installedAppsPath}}',
      isRun: function(self, src, dst) {
        if(!self.fs.exists(dst)) {
          self.warning(format(
              'File %s not found, include new app to settings manually', dst));
          return false;
        }
        return true;
      },
      replacement: function(self, content) {
        var appsDir = _.last(self.config.get('apps').split('/'));
        return content.replace(/(LOCAL_APPS = \([()\n\s'\w.,]+)\)/,
          format('$1    \'%s.%s\',\n)', appsDir, self.appName));
      }
    },

    // config/urls.py
    configUrls: {
      dst: '{{rootUrlConfPath}}',
      isRun: function(self, src, dst) {
        if(!self.fs.exists(dst)) {
          self.warning(format(
            'File %s not found, include urls for new app to root url conf ' +
            'manually', dst));
          return false;
        }
        return true;
      },
      replacement: function(self, content) {
        var contentWithPattern = _.first(content
          .match(/urlpatterns \+= patterns\((\n|.)*/));

        if (!contentWithPattern) {
          return false;
        }

        var urlpattern = _.last(
          self.getFunctionCall('patterns', contentWithPattern));

        if (!urlpattern) {
          return false;
        }

        var appsDir = _.last(self.config.get('apps').split('/'));
        var changedUrlPattern = urlpattern.replace(
          /(patterns\(\n?(\s*)'[\w_.]*?',(\s|.)+)\)/,
            format('$1$2url(r\'^%s/\', include(\'%s.%s.urls\', namespace=\'%s\')),\n)',
              self.appName, appsDir, self.appName, self.appName));

        return content
          .replace(urlpattern, changedUrlPattern.replace(/\$/g, '$$$'));
      }
    },

    // serializersInit.py
    serializersInit: {
      src: 'init.py',
      dst: '{{app}}/serializers/__init__.py',
      isRun: function(self, src, dst) {
        return self.config.get('drf');
      }
    },

    // viewsetsInit.py
    viewsetsInit: {
      src: 'init.py',
      dst: '{{app}}/viewsets/__init__.py',
      isRun: function(self, src, dst) {
        return self.config.get('drf');
      }
    },

    // router.py
    router: {
      src: 'router.py',
      dst: '{{app}}/router.py',
      isRun: function(self, src, dst) {
        return self.config.get('drf');
      }
    }
  }
};

module.exports = helpers.extendOf(gHelper, core, selfGenerator);