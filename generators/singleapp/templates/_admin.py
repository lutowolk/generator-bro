# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib import admin
from apps.{{appName}}.models import {{capitalize appName}}


class {{capitalize appName}}Admin(admin.ModelAdmin):
    """Override this class or remove"""
    pass


admin.site.register({{capitalize appName}}, {{capitalize appName}}Admin)
