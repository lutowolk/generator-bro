

class {{modelName}}DeleteView(DeleteView):
    model = {{modelName}}

    def get_success_url(self):
        return {{{deleteSuccessUrl}}}

    def get(self, request, *args, **kwargs):
        return self.delete(request, *args, **kwargs)

    def get_object(self, queryset=None):
        """Override this method or remove."""
        return super({{modelName}}DeleteView, self).get_object(queryset=queryset)
