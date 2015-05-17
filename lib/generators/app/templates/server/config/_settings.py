# -*- coding: utf-8 -*-

import logging


# Secret key
# This is used to provide cryptographic signing, and should be set
# to a unique, unpredictable value.
SECRET_KEY = '{{ secret }}'

ANONYMOUS_USER_ID = -1
SITE_ID = 1
ROOT_URLCONF = 'config.urls'
WSGI_APPLICATION = 'config.wsgi.application'

TEST_RUNNER = 'django.test.runner.DiscoverRunner'

##################################################################
# Debug settings
##################################################################

# Set debug
DEBUG = True

# Turns on/off template debug mode.
TEMPLATE_DEBUG = DEBUG

##################################################################
# Databases settings (for docker)
##################################################################

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'postgres',
        'USER': 'postgres',
        'PASSWORD': '',
        'HOST': 'db_1',
        'PORT': '',
    },
}

##################################################################
# Logging settings
##################################################################

LOG_DATE_FORMAT = '%d %b %Y %H:%M:%S'

LOG_FORMATTER = logging.Formatter(
    u'%(asctime)s | %(levelname)-7s | %(name)s | %(message)s',
    datefmt=LOG_DATE_FORMAT)

CONSOLE_HANDLER = logging.StreamHandler()

CONSOLE_HANDLER.setFormatter(LOG_FORMATTER)

CONSOLE_HANDLER.setLevel(logging.DEBUG)

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}

##################################################################
# Locale and timezone settings
##################################################################

TIME_ZONE = 'Greenwich'
LANGUAGE_CODE = 'RU-ru'
USE_I18N = True
USE_L10N = True

##################################################################
# Assets settings
##################################################################

from os.path import dirname, basename, join

SETTINGS_PATH = dirname(__file__)
PROJECT_PATH = dirname(SETTINGS_PATH)
PROJECT_NAME = basename(PROJECT_PATH)
SERVER_PATH = dirname(PROJECT_PATH)
ROOT_PATH = dirname(SERVER_PATH)

FILE_UPLOAD_PERMISSIONS = 0644

STATIC_ROOT = join(ROOT_PATH, 'static')
STATIC_URL = '/static/'
ADMIN_MEDIA_PREFIX = STATIC_URL
MEDIA_ROOT = join(ROOT_PATH, 'media')
MEDIA_URL = '/media/'
STATICFILES_DIRS = ('static',)
TEMPLATE_DIRS = ('templates',)

##################################################################
# Finders, loaders, middleware and context processors
##################################################################

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)

TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

TEMPLATE_CONTEXT_PROCESSORS = (
    'django.contrib.auth.context_processors.auth',
    'django.contrib.messages.context_processors.messages',
    'django.core.context_processors.debug',
    'django.core.context_processors.i18n',
    'django.core.context_processors.media',
    'django.core.context_processors.static',
    'django.core.context_processors.request',
)

{{#if drf}}
##################################################################
# Django rest framework
##################################################################

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly'
    ]
}
{{/if}}