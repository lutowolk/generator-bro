class {{capitalize modelName}}(models.Model):
    {{#each fields}}
        {{{this}}}
    {{else}}
    # your database fields
    {{/each}}

    class Meta:
        verbose_name = _("{{capitalize modelName}}")
        verbose_name_plural = _("{{capitalize modelName}}s")

    def __unicode__(self):
        {{#if isNameOrSlug}}
        return self.{{isNameOrSlug}}
        {{else}}
        return str(self.pk)
        {{/if}}

        {{#defSave}}
        def save(self, force_insert=False,
                 force_update=False, using=None, update_fields=None):
            """Override this method"""
            super({{capitalize modelName}}, self).save(
                force_insert, force_update, using, update_fields)

        {{/defSave}}
        # your custom methods
