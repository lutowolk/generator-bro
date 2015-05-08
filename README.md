# Generator-Bro

This generator help you create django projects, apps, models and views very faster. See [usage](#usage) section for more information. This project based on [yeoman](http://yeoman.io/) generator. 

## Docs

Read full documentation for usage generator in [http://generator-bro.readthedocs.org/en/latest](http://generator-bro.readthedocs.org/en/latest/).

## Install

```
npm install -g generator-bro
```

## Generators

Package contain next generators:

- [**`bro`**](http://generator-bro.readthedocs.org/en/latest/generators/#app)

- [**`bro:sub`**](http://generator-bro.readthedocs.org/en/latest/generators/#sub)

- [**`bro:model`**](http://generator-bro.readthedocs.org/en/latest/generators/#model) 

- [**`bro:view`**](http://generator-bro.readthedocs.org/en/latest/generators/#view)

- [**`bro:config`**](http://generator-bro.readthedocs.org/en/latest/generators/#config) 

## Usage

To start usage generator right now follow next steps:

### If you want start new project with generator

Go to dir where you want create project and just run next command:

```bash
$ yo bro my_project --dbType sqlite3 && cd my_project/server
```

*For see other db types read the [docs](http://generator-bro.readthedocs.org/en/latest/generators/#app)*

At now generator create empty project with settings. Change dir to `my_project` and create virtual env for this.

If you using [workon](http://virtualenvwrapper.readthedocs.org/en/latest/install.html)

```bash
$ mkvirtualenv my_project
```

If you don't using workon :)

```bash
$ virtualenv my_env && source my_env/bin/activate
```

Install dependencies 

```bash
$ pip install -r requirments.txt
```

Run migrations and create superuser

```bash
$ ./manage.py migrate && ./manage.py createsuperuser
```

At now create your first app with bro generator. Create empty app

```bash
$ yo bro:sub todo
```

Create model for this app

```bash
$ yo bro:model todo:Todo text:text created_at:datetime:auto_now_add=True
```

This command create simple model. See code above

```python
# server/apps/todo/models/todo.py

...

class Todo(models.Model):
    text = models.TextField(verbose_name=_("text"))
    created_at = models.DateTimeField(verbose_name=_("created_at"), auto_now_add=True)

    class Meta:
        verbose_name = _("Todo")
        verbose_name_plural = _("Todos")

    def __unicode__(self):
        return str(self.pk)

    # your custom methods
```

Create migrations and run it

```bash
$ ./manage.py makemigrations todo && ./manage.py migrate
```

For more info about **bro:model** generator see [docs](http://generator-bro.readthedocs.org/en/latest/generators#model)

At now creating views for this model. Generator **bro:view** support five generic views: list, detail, create, update and delete.

Creating for Todo model all views

```bash
$ yo bro:view todo:Todo --list --detail --create --update --del
```

Run django webserver and open your browser in this url [http://localhost:8000/todo/todo](http://localhost:8000/todo/todo) and see what you get. 

Also you can check that your model registered in django-admin [http://localhost:8000/admin/todo/todo](http://localhost:8000/admin/todo/todo)

### If you want continue develop existing project with generator

Go to root directory of your project and run next command for creating config file. This config file need for other generators.

```bash
$ yo bro:config --apps replative_path_to_apps_dir --settings relative_path_to_settings_dir --urls relative path_to_root_url_conf_file
```

More info about bro:config see in the [docs](http://generator-bro.readthedocs.org/en/latest/generators#config)

At now you can creating apps, models and views with bro generator. See [docs](http://generator-bro.readthedocs.org/en/latest/generators) for more info about generators. 

## Sponsors 

This project is developed with the financial support of [bro.agency](http://bro.agency/).

## Contributing

If you find errors or you know how improve this project please create issue in this [page](https://github.com/lutowolk/generator-bro/issues).
