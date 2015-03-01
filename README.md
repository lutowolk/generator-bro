# generator-bro

Generate your django project and django apps.

## Install

coming soon...

## Usage

Package contain next generators:

* `bro`

* `bro:singleapp`

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

**Note: Before running this command move to project directory.**

#### Run

```
$ yo bro:singleapp <app_name>
```

*Note: arg app_name is required*

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
