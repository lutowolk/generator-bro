# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.forms import ModelForm
from apps.{{lower appName}}.models import {{modelName}}


class {{modelName}}Form(ModelForm):
    class Meta:
        model = {{modelName}}
        fields = '__all__'
