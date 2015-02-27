# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.core.urlresolvers import reverse
from factories import <%= appname %>Factory
from django.test import TestCase


class <%= appname %>ListViewTestCase(TestCase):
    def setUp(self):
        <%= appname %>Factory()

    def test_200(self):
        response = self.client.get(reverse('<%= appname %>.list'))
        self.assertEqual(response.status_code, 200)


class <%= appname %>DetailViewTestCase(TestCase):
    def setUp(self):
        self.item = <%= appname %>Factory()

    def test_200(self):
        response = self.client.get(
            reverse('<%= appname %>.detail', kwargs={'slug': self.item.slug}))
        self.assertEqual(response.status_code, 200)
