# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.core.urlresolvers import reverse
from apps.{{appname}}.factories import {{_.capitalize(appname)}}Factory
from django.test import TestCase


class {{_.capitalize(appname)}}ListViewTestCase(TestCase):
    def setUp(self):
        {{_.capitalize(appname)}}Factory()

    def test_200(self):
        response = self.client.get(reverse('{{appname}}.list'))
        self.assertEqual(response.status_code, 200)


class {{_.capitalize(appname)}}DetailViewTestCase(TestCase):
    def setUp(self):
        self.item = {{_.capitalize(appname)}}Factory()

    def test_200(self):
        response = self.client.get(
            reverse('{{appname}}.detail', kwargs={'slug': self.item.slug}))
        self.assertEqual(response.status_code, 200)
