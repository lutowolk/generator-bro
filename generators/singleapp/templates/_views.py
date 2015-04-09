# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.views.generic import ListView, DetailView
from apps.{{appName}}.models import {{capitalize appName}}


class {{capitalize appName}}ListView(ListView):
    model = {{capitalize appName}}

    def get_queryset(self):
        """Override this method or remove"""
        return self.model.objects.all()

    def get_context_data(self, **kwargs):
        """Override this method or remove"""
        context = super({{capitalize appName}}ListView, self)\
            .get_context_data(**kwargs)
        return context


class {{capitalize appName}}DetailView(DetailView):
    model = {{capitalize appName}}

    def get_queryset(self):
        """Override this method or remove"""
        return self.model.objects.all()

    def get_context_data(self, **kwargs):
        """Override this method or remove"""
        context = super({{capitalize appName}}DetailView, self).get_context_data(**kwargs)
        return context
