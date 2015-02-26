# -*- coding: utf-8 -*-
# Local settings template for <%= projectName %> project.

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.<%= dbType %>',
        'NAME': '<%= projectName %>',
        'USER': '<%= dbUser %>',
        'PASSWORD': '<%= dbPass %>',
    }
}

