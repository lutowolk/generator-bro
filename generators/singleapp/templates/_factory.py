# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from factory import fuzzy, DjangoModelFactory
from apps.{{appName}}.models import {{capitalize appName}}


class {{capitalize appName}}Factory(DjangoModelFactory):
    name = fuzzy.FuzzyText(length=50)
    slug = fuzzy.FuzzyText(length=20)

    class Meta:
        model = {{capitalize appName}}
