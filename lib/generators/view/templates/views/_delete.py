

class {{modelName}}DeleteView(DeleteView):
    model = {{modelName}}Model
    success_url = ''
    template_name = ''

    def get_object(self, queryset=None):
        """Override this method or remove."""
        return super({{modelName}}DeleteView, self).get_object(queryset=queryset)
