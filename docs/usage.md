# Usage

Package contain next generators:

## [bro]()

Main generator for creating django project file structure. Generator create
project file structure, create file with dependencies, create stub for local
settings and complete file with you local settings such as database driver,
name, user and password data.

## [bro:sub]()

Generator for creating django application. This generator create file structure
for your app in directory with your other apps. Include this application to your
settings file and include urls patterns for this app to root url conf.

## [bro:model]()

Generator for creating django models. Create models for application and register
this in admin panel. This is very easy way for creating your models. Your can
create model with fields which you want from console usage short name for django
fields types.

**Example:**

```bash
$ yo bro:model news:News title:char content:text hidden:bool:default=False created:datetime
```

This command create next code:

```python
class News(models.Model):
    title = models.CharField(max_length=255, verbose_name=_('title'))
    content = models.TextField(verbose_name=_('content'))
    hidden = models.CharField(default=False, verbose_name=_('hidden'))
    created = models.DateTimeField(verbose_name=_('created'))

    class Meta:
        verbose_name = _('News')
        verbose_name_plural = _('Newss')
```

For more information about this generator read this [section]().

## [bro:view]()

Generator for creating generic views. With help this generator you can very fast
create views for your model. Just enter your model name and tell what kind of views
you want and generator create them for you.

**Example:**

```bash
$ yo bro:view news:News --list
```

This command create next code:

```python
class NewsListView(ListView):
    model = News
    paginate_by = 5

    def get_queryset(self):
        """Override this method or remove."""
        return super(NewsListView, self).get_queryset()

    def get_context_data(self, **kwargs):
        """Override this method or remove."""
        context = super(NewsListView, self).get_context_data(**kwargs)
        context.update({})
        return context
```

Also generator create urlpatterns and base templates for your views.

After generator complete your works you can run django server and check that
views works.

For more information about this generator read this [section]().