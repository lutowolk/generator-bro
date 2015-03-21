# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from factory import fuzzy, DjangoModelFactory
from apps.{{appName}}.models import {{capitalize modelName}}


class {{capitalize modelName}}Factory(DjangoModelFactory):
    {{#each factoryFields}}
    {{this}}
    {{/factoryFields}}

    class Meta:
        model = {{capitalize modelName}}
