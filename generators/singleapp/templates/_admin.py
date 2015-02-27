# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib import admin
from models import <%= appname %>


class <%= appname %>Admin(admin.ModelAdmin):
    """Override this class or remove"""
    pass


admin.site.register(<%= appname %>, <%= appname %>Admin)
