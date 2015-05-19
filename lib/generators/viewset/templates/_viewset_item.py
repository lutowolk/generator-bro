
class {{modelName}}ViewSet(viewsets.ModelViewSet):
    serializer_class = {{modelName}}Serializer
    queryset = {{modelName}}.objects.all()