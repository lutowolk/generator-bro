class {{capitalize modelName}}Admin(admin.ModelAdmin):
    {{#if isPrepopulated}}
        prepopulated_fields = {"slug": ("{{prepopulated}}",)}
    {{else}}
    """Override this class or remove"""
    pass
    {{/if}}


    admin.site.register({{capitalize modelName}}, {{capitalize modelName}}Admin)
