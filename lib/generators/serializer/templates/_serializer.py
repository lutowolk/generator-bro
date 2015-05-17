# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from rest_framework import serializers
from {{pyapp}}.models.{{lower modelName}} import {{modelName}}


class {{modelName}}Serializer(serializers.ModelSerializer):
    class Meta:
        model = {{modelName}}