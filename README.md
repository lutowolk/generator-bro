# generator-bro

Generate your django project and django apps.

## Install

coming soon...

## Usage

Package contain next generators:

* `bro`

* `bro:singleapp`

* `bro:model` 

### `bro`

This generator will create a django project.

#### Run

```
$ yo bro
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

### `bro:singleapp`

This generator will create a django app in `server.apps` directory. Also new app will be include to settings and root urlconf. 

By default with new app wil be created `model` with name `AppName` for this models will be created two generic view `DetailView` and `ListView`. Also `factory`, `tests` and `admin class`.

**Note: before running this command move to project directory.**

#### Run

```
$ yo bro:singleapp <app_name>
```

**Note: arg app_name is required.**

#### Example

This command create app with name `news` in .

```
$ yo bro:singleapp news
```

App will be have next file structure:  

```
news
├─ models
|  ├─ mixins
|  |  └─ __init__.py
|  ├─ news.py
|  └─ __init__.py
├─ views
|  ├─ mixins
|  |  └─ __init__.py
|  ├─ news.py
|  └─ __init__.py
├─ factories
|  ├─ news.py
|  └─ __init__.py
├─ admin
|  ├─ mixins
|  |  └─ __init__.py
|  ├─ news.py
|  └─ __init__.py
├─ tests
|  ├─ models
|  |  ├─ news.py
|  |  └─ __init__.py
|  ├─ views
|  |  ├─ news.py
|  |  └─ __init__.py
|  └─ __init__.py
└─ __init__.py
```

### `bro:model`

This generator will create a django model in `server.apps.your_app.models` directory. For new model will be created admin class. Admin and model classes will be imported in `__init__.py` files. 

**Note: before running this command move to project directory.**

#### Run

```
$ yo bro:model <app_name:model_name> [<field_name:field_type[:arg1,arg2=val,arg3=val]> ...]
```

**Note: arg app_name:model_name is required.**

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
