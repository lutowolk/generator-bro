# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from factory import fuzzy, DjangoModelFactory
from models import <%= appname %>


class <%= appname %>Factory(DjangoModelFactory):
    name = fuzzy.FuzzyText(length=50)
    slug = fuzzy.FuzzyText(length=20)

    class Meta:
        model = <%= appname %>
