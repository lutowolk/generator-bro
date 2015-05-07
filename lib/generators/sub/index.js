'use strict';

var _ = require('lodash');
var yeoman = require('yeoman-generator');
var helpers = require('../../core/helpers');
var format = require('util').format;
var colors = require('colors');
var path = require('path');
var fs = require('fs');
var Core = require('../../core/core');

module.exports = Core.extend({
  constructor: function () {
    yeoman.Base.apply(this, arguments);

    this.argument('appName', {
      type: String,
      required: false
    });

    this.option('force', {
      desc: 'Overwrite files that already exist',
      type: Boolean, defaults: false});

    this.conflicter.force = this.options.force;
  },

  context: function () {
    return {
      apps: this.config.get('apps'),
      app: path.join(this.config.get('apps'), this.appName),
      appName: this.appName,
      rootUrlConfPath: this.config.get('rootUrlConfPath'),
      installedAppsPath: this.config.get('installedAppsPath')
    };
  },

  writing: function() {
    this._writing();
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
        return content.replace(/(LOCAL_APPS = \([()\n\s'\w.,]+)\)/,
          format('$1    \'apps.%s\',\n)', self.appName));
      }
    },

    // urls.py
    urls: {
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

        var changedUrlPattern = urlpattern.replace(
          /(patterns\(\n?(\s*)'[\w_.]*?',(\s|.)+)\)/,
            format('$1$2url(r\'^%s/\', include(\'apps.%s.urls\', namespace=\'%s\')),\n)',
              self.appName, self.appName, self.appName));

        return content
          .replace(urlpattern, changedUrlPattern.replace(/\$/g, '$$$'));
      }
    }
  }
});
