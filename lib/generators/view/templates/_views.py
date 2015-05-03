# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.views.generic import {{viewImports}}
from django.core.urlresolvers import reverse
from apps.{{appName}}.models import {{modelName}}
{{#if includeForm}}
from apps.{{appName}}.forms.{{lower modelName}} import {{modelName}}Form
{{/if}}
{{#each viewsCode}}
{{{this}}}
{{/each}}
