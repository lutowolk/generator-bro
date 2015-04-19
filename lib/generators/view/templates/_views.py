# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.views.generic import {{viewImports}}
{{#if includeForm}}
from apps.{{lower appName}}.forms.{{lower modelName}} import {{modelName}}Form
{{/if}}
{{#if options.list}}
{{> listView}}
{{/if}}
{{#if options.detail}}
{{> detailView}}
{{/if}}
{{#if options.create}}
{{> createView}}
{{/if}}
{{#if options.update}}
{{> updateView}}
{{/if}}
{{#if options.del}}
{{> deleteView}}
{{/if}}