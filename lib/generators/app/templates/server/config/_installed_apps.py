# -*- coding: utf-8 -*-
from __future__ import unicode_literals

INSTALLED_APPS = (
  'django.contrib.auth',
  'django.contrib.contenttypes',
  'django.contrib.sessions',
  'django.contrib.sites',
  'django.contrib.messages',
  'django.contrib.staticfiles',
  'django.contrib.admin',
  {{#if drf}}'rest_framework',{{/if}}
)

LOCAL_APPS = (
)

INSTALLED_APPS += LOCAL_APPS
