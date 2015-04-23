

class {{modelName}}ListView(ListView):
    model = {{modelName}}
    paginate_by = {{paginateBy}}

    def get_queryset(self):
        """Override this method or remove."""
        return super({{modelName}}ListView, self).get_queryset()

    def get_context_data(self, **kwargs):
        """Override this method or remove."""
        context = super({{modelName}}ListView, self).get_context_data(**kwargs)
        context.update({})
        return context
