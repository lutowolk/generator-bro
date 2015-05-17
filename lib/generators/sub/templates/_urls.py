# -*- coding: utf-8 -*-
from django.conf.urls import patterns, include, url
{{#if drf}}
from {{apps}}.{{app}}.router import router
{{/if}}


urlpatterns = patterns(
    '',
    {{#if drf}}
    url(r'^', include(router.urls)),
    {{/if}}
)
