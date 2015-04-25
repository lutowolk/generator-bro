# Usage

Package contain next generators:

## App

Main generator for creating django project file structure. Generator create
project file structure, create file with dependencies, create stub for local
settings and complete file with you local settings such as database driver,
name, user and password data.

**Example:**

```bash
$ yo bro my_project
```

After this command will been complete, you get next file structure:

```
my_project
├─ .yo-rc.json
├─ client
└─ server
   ├─ apps
   |  └─ __init__.py
   ├─ libs
   ├─ contrib
   ├─ config
   |  ├─ settings
   |  |  ├─ installed_apps.py
   |  |  ├─ local.py
   |  |  ├─ settings.py
   |  |  ├─ __local.py
   |  |  └─ __init__.py
   |  ├─ urls.py
   |  ├─ wsgi.py
   |  └─ __init__.py
   ├─ templates
   |  └─ base.html
   ├─ manage.py
   ├─ requirments.txt
   └─ __init__.py
```

Description for this structure: |
----  | -----------
.yo-rc.json| Configure file for generator, do not remove this.
client| Directory for your static files such as css, js, images and others.
server| Directory for your django project.
server/apps | Python package for your django apps.
server/libs | Directory for your python libraries.
server/contrib | Directory for application that you fork and will be support.
server/config | This package contain that what you see.
server/config/settings | This package contain your project settings.
server/config/settings/installed_apps.py | File contain tuple with your apps. Sub generator will update this file and append to it new apps names.
server/config/urls.py | File contain root url conf for your apps. Sub generator will update this file and include to it new urlpatterns.

!!! danger "Do not remove file .yo-rc.json"
    If you remove this file then others sub generators will not work for you project.

## Sub

Generator for creating django application. This generator create file structure
for your app in directory with your other apps. Include this application to your
settings file and include urls patterns for this app to root url conf.

**Example:**

```bash
$ yo bro:sub news
```

After completion of commands, will create the following files:

```
news
├─ models
|  ├─ mixins
|  |  └─ __init__.py
|  └─ __init__.py
├─ views
|  ├─ mixins
|  |  └─ __init__.py
|  └─ __init__.py
├─ factories
|  └─ __init__.py
├─ forms
|  └─ __init__.py
├─ admin
|  ├─ mixins
|  |  └─ __init__.py
|  └─ __init__.py
├─ tests
|  ├─ models
|  |  └─ __init__.py
|  ├─ views
|  |  └─ __init__.py
|  └─ __init__.py
├─ urls.py
└─ __init__.py
```

Next files will be update:|
----- | ------
server/config/settings/installed_apps.py|To this file will be append string with name for new app.
server/config/urls.py|To this file will be include urlpatterns from new app **server/apps/news/urls.py**.

## Model

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

## View

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