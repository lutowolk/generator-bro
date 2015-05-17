# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from rest_framework import viewsets
from {{pyapp}}.models.{{lower modelName}} import {{modelName}}
from {{pyapp}}.serializers.{{lower modelName}} import {{modelName}}Serializer


class {{modelName}}ViewSet(viewsets.ModelViewSet):
    serializer_class = {{modelName}}Serializer
    queryset = {{modelName}}.objects.all()