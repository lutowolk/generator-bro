

class {{modelName}}DetailView(DetailView):
    model = {{modelName}}
    slug_field = 'slug'

    def get_object(self, queryset=None):
        """Override this method or remove."""
        return super({{modelName}}DetailView, self).get_object(queryset=queryset)

    def get_context_data(self, **kwargs):
        """Override this method or remove."""
        context = super({{modelName}}DetailView, self).get_context_data(**kwargs)
        context.update({})
        return context
