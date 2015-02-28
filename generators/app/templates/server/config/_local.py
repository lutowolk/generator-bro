# -*- coding: utf-8 -*-
# Local settings template for {{ appname }} project.

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.{{ dbType }}',
        'NAME': '{{ appname }}',
        'USER': '{{ dbUser }}',
        'PASSWORD': '{{ dbPass }}',
    }
}

