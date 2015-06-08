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


@register.simple_tag
def form_tag(form_path=None, url=None, template_name='form_tag.html'):

    form_path_split = form_path.split('.')

    class_name = form_path_split.pop()
    module = importlib.import_module('.'.join(form_path_split))

    FormClass = getattr(module, class_name)

    if url is None:
        namespace = first(form_path_split)
        model_name = FormClass.Meta.model.__name__
        url = '{namespace}:{model}-list'.format(
            namespace=namespace, model=model_name.lower())

    return render_to_string(template_name, {'form': FormClass(), 'url': url})