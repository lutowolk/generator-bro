# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.config import settings

INSTALLED_APPS += getattr(settings, 'INSTALLED_APPS')

LOCAL_APPS = (
)

INSTALLED_APPS += LOCAL_APPS
