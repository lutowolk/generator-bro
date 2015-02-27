# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.views.generic import ListView, DetailView


class <%= appname %>ListView(ListView):
    model = <%= appname %>

    def get_queryset(self):
        """Override this method or remove"""
        return self.model.objects.all()

    def get_context_data(self, **kwargs):
        """Override this method or remove"""
        context = super(<%= appname %>ListView, self).get_context_data(**kwargs)
        return context


class <%= appname %>DetailView(DetailView):
    model = <%= appname %>

    def get_queryset(self):
        """Override this method or remove"""
        return self.model.objects.all()

    def get_context_data(self, **kwargs):
        """Override this method or remove"""
        context = super(<%= appname %>DetailView, self).get_context_data(**kwargs)
        return context
