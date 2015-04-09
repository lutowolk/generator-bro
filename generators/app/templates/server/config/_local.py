# -*- coding: utf-8 -*-
# Local settings template for {{ appName }} project.

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.{{ dbType }}',
        'NAME': '{{ appName }}',
        'USER': '{{ dbUser }}',
        'PASSWORD': '{{ dbPass }}',
    }
}

