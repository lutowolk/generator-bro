

class {{modelName}}CreateView(CreateView):
    model = {{modelName}}
    success_url = ''
    form_class = {{modelName}}Form

    def get(self, request, *args, **kwargs):
        """Override this method or remove."""
        return super({{modelName}}CreateView, self).get(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        """Override this method or remove."""
        return super({{modelName}}CreateView, self).post(request, *args, **kwargs)

    def form_valid(self, form):
        """Override this method or remove."""
        return super({{modelName}}CreateView, self).form_valid(form)

    def form_invalid(self, form):
        """Override this method or remove."""
        return super({{modelName}}CreateView, self).form_invalid(form)
