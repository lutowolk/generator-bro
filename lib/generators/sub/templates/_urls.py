# -*- coding: utf-8 -*-
from django.conf.urls import patterns, include, url
{{#if drf}}
from rest_framework import routers
{{/if}}


urlpatterns = patterns(
    '',
)
{{#if drf}}
################################################################
# api urls
################################################################

router = routers.DefaultRouter()

urlpatterns += patterns('', url(r'^api/', include(router.urls)))
{{/if}}