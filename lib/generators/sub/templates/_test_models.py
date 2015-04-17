# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.test import TestCase
from apps.{{appName}}.factories import {{capitalize appName}}Factory


class {{capitalize appName}}ModelTestCase(TestCase):
    def setUp(self):
        self.{{appName}} = {{capitalize appName}}Factory()

    def test_ok(self):
        self.assertTrue(self.{{appName}}.__unicode__())
