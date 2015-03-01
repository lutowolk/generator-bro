# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.views.generic import ListView, DetailView
from apps.{{appname}}.models import {{_.capitalize(appname)}}


class {{_.capitalize(appname)}}ListView(ListView):
    model = {{_.capitalize(appname)}}

    def get_queryset(self):
        """Override this method or remove"""
        return self.model.objects.all()

    def get_context_data(self, **kwargs):
        """Override this method or remove"""
        context = super({{_.capitalize(appname)}}ListView, self)\
            .get_context_data(**kwargs)
        return context


class {{_.capitalize(appname)}}DetailView(DetailView):
    model = {{_.capitalize(appname)}}

    def get_queryset(self):
        """Override this method or remove"""
        return self.model.objects.all()

    def get_context_data(self, **kwargs):
        """Override this method or remove"""
        context = super({{_.capitalize(appname)}}DetailView, self).get_context_data(**kwargs)
        return context
