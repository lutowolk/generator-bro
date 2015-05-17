# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from {{apps}}.{{app}}.models import {{modelName}}


class {{modelName}}Serializer(serializers.ModelSerializer):
    class Meta:
        model = {{modelName}}