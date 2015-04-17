# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.core.urlresolvers import reverse
from apps.{{appName}}.factories import {{capitalize appName}}Factory
from django.test import TestCase


class {{capitalize appName}}ListViewTestCase(TestCase):
    def setUp(self):
        {{capitalize appName}}Factory()

    def test_200(self):
        response = self.client.get(reverse('{{appName}}.list'))
        self.assertEqual(response.status_code, 200)


class {{capitalize appName}}DetailViewTestCase(TestCase):
    def setUp(self):
        self.item = {{capitalize appName}}Factory()

    def test_200(self):
        response = self.client.get(
            reverse('{{appName}}.detail', kwargs={'slug': self.item.slug}))
        self.assertEqual(response.status_code, 200)
