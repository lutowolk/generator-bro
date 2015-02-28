# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib import admin
from apps.{{appname}}.models import {{_.capitalize(appname)}}


class {{_.capitalize(appname)}}Admin(admin.ModelAdmin):
    """Override this class or remove"""
    pass


admin.site.register({{_.capitalize(appname)}}, {{_.capitalize(appname)}}Admin)
