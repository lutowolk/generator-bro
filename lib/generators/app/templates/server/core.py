# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django import template
from django.template.loader import render_to_string
from django.contrib.contenttypes.models import ContentType

register = template.Library()

@register.simple_tag
def list_tag(model_path=None, limit=None, order=None,
             template_name='list_tag.html'):

    app, model = model_path.split('.')

    ModelClass = ContentType.objects.get(
        app_label=app, model=model).model_class()

    model_items = ModelClass.objects.all()

    if order:
        model_items = model_items.order_by(*order.split(','))

    if limit:
        model_items = model_items[:limit]

    return render_to_string(template_name, {'items': model_items})