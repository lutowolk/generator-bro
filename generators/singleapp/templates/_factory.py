# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from factory import fuzzy, DjangoModelFactory
from apps.{{appname}}.models import {{_.capitalize(appname)}}


class {{_.capitalize(appname)}}Factory(DjangoModelFactory):
    name = fuzzy.FuzzyText(length=50)
    slug = fuzzy.FuzzyText(length=20)

    class Meta:
        model = {{_.capitalize(appname)}}
