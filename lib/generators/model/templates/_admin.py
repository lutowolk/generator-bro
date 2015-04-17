# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib import admin
from apps.{{appName}}.models import {{capitalize modelName}}


class {{capitalize modelName}}Admin(admin.ModelAdmin):
    {{#if isPrepopulated}}
    prepopulated_fields = {"slug": ("{{prepopulated}}",)}
    {{else}}
    """Override this class or remove"""
    {{/if}}


admin.site.register({{capitalize modelName}}, {{capitalize modelName}}Admin)
