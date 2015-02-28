# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.test import TestCase
from apps.{{appname}}.factories import {{_.capitalize(appname)}}Factory


class {{_.capitalize(appname)}}ModelTestCase(TestCase):
    def setUp(self):
        self.{{appname}} = {{_.capitalize(appname)}}Factory()

    def test_ok(self):
        self.assertTrue(self.{{appname}}.__unicode__())
