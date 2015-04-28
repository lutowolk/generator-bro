# Generator-Bro

This generator help you create django projects, apps, models and views very faster. See [usage](#usage) section for more information. This project based on [yeoman](http://yeoman.io/) generator. 

## Docs

Read full documentation for usage generator in [http://generator-bro.readthedocs.org/en/latest](http://generator-bro.readthedocs.org/en/latest/).

## Install

```
npm install -g generator-bro
```

## Usage

Package contain next generators:

- [**`bro`**](#bro)

- [**`bro:sub`**](#brosub)

- [**`bro:model`**](#bromodel) 

- [**`bro:view`**](#broview) 

### `bro`

This generator will create a django project.

#### Run

```
$ yo bro [<args>] [<options>]
```

#### Args

First arg - project name;

Second arg - django database backend. One of this: `postgresql_psycopg2`, `mysql`, `sqlite3`, `oracle`;

Third arg - database user.

Four arg - database user password.

All this args is `not required`.

#### Example

This command create project with name `blog`.

```
$ yo bro blog
```

Project will be have next file structure:  

```
blog
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

### `bro:sub`

This generator will create a django app in `server.apps` directory. Also new app will be include to settings and root urlconf. 

**Note: before running this command move to project directory.**

#### Run

```
$ yo bro:sub <app_name> [<options>]
```

#### Example

This command create app with name `news` in .

```
$ yo bro:sub news
```

App will be have next file structure:  

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
└─ __init__.py
```

### `bro:model`

This generator will create a django model in `server.apps.your_app.models` directory. For new model will be created admin class. If model containg field with name *slug* for this field will be created prepopulated field. 

Admin and model classes will be imported in `__init__.py` files. 

**Note: before running this command move to project directory.**

#### Run

```
$ yo bro:model <app_name:model_name> [<field_name:field_type[:arg1,arg2=val]> ...] [<options>]
```

#### Options

* `-s`,   `--def-save` Create model method save for next overriding.
* `-p`,   `--prepopulated` Set prepopulated field name for slug field. Use this option if field slug exist and prepopulated field name differs from *name* or *title*.

#### Example

This command create model `Blog` in app `blogs` in .

```
$ yo bro:model blogs:Blog title:char slug:slug content:text publish:bool:default=True
```

File content for new file `blogs.models.blog.py`:

```python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models
from django.utils.translation import ugettext as _


class Blog(models.Model):
    title = models.CharField(verbose_name=_("title"), max_length=255)
    slug = models.SlugField(verbose_name=_("slug"))
    content = models.TextField(verbose_name=_("content"))
    publish = models.BooleanField(verbose_name=_("publish"), default=True)

    class Meta:
        verbose_name = _("Blog")
        verbose_name_plural = _("Blogs")

    def __unicode__(self):
        return self.title

    # your custom methods
```

Structure `blogs` app after creating model:

```
blogs
├─ models
|  ├─ mixins
|  |  └─ __init__.py
|  ├─ blog.py
|  └─ __init__.py
├─ admin
|  ├─ mixins
|  |  └─ __init__.py
|  ├─ blog.py
|  └─ __init__.py
└─ __init__.py
```

### `bro:view`

With help this generator you may create generic view for your model. Just enter your model name and generator create views for this model. Generator support next generic view: `ListView`, `DetailView`, `CreateView`, `UpdateView` and `DeleteView`. You can tell the generator what kind of views you want to create with options. 

**Note: before running this command move to project directory.**

#### Run

```
$ yo bro:model <app_name:model_name> [<options>]
```

#### Options

* `--list` for create `ListView` 
* `--detail` for create `DetailView` 
* `--create` for create `CreateView` 
* `--update` for create `UpdateView` 
* `--del` for create `DeleteView` 
* `--paginate` set property paginate_by for class ListView usage this options with option `list`, default value `5`

#### Example

This command create all views for model `Blog` (see this model in above).

```
$ yo bro:view blogs:Blog --list --detail --create --update --del
```

After this command will be executed, will be created five classes in file `server/apps/blogs/views/blog.py`:

* `BlogListView`
* `BlogDetailView`
* `BlogCreateView`
* `BlogUpdateView`
* `BlogDeleteView`

Also will be created new form class `BlogForm` in file `server/apps/blogs/forms/blog.py` and include in `BlogCreateView` and `BlogUpdateView`. This views will be included in urls conf (`server/apps/blogs/urls.py`). With view `BlogDetailView` will be created method `get_absolute_url` in model `Blog`. For this views also will be created base templates witch contain data about models.

New files:

* `# server/apps/blogs/views/blog.py`
* `# server/apps/blogs/forms/blog.py`
* `# server/templates/blogs/blog_detail.html`
* `# server/templates/blogs/blog_form.html`
* `# server/templates/blogs/blog_list.html`

Changed files:

* `# server/apps/blogs/urls.py`
* `# server/apps/blogs/models/blog.py`
* `# server/apps/blogs/forms/__init__.py`

## Sponsors 

This project is developed with the financial support of [bro.agency](http://bro.agency/).

## Contributing

If you find errors or you know how improve this project please create issue in this [page](https://github.com/lutowolk/generator-bro/issues).
