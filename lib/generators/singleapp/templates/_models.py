# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models
from django.utils.translation import ugettext as _
from django.core.urlresolvers import reverse


class {{capitalize appName}}(models.Model):
    name = models.CharField(max_length=255, verbose_name=_("Name"))
    slug = models.CharField(max_length=255, verbose_name=_("Slug"))

    # your database fields

    class Meta:
        verbose_name = _("{{ capitalize appName }}")
        verbose_name_plural = _("{{ capitalize appName }}s")

    def __unicode__(self):
        return self.name

    def save(self, force_insert=False,
             force_update=False, using=None, update_fields=None):
        """Override this method"""
        super({{ capitalize appName }}, self).save(
            force_insert, force_update, using, update_fields)

    def get_absolute_url(self):
        return reverse('{{ appName }}.detail', kwargs={'slug': self.slug})

        # your custom methods
