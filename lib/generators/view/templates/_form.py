# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.forms import ModelForm


class {{modelName}}Form(ModelForm):
    class Meta:
        model = {{modelName}}Model
