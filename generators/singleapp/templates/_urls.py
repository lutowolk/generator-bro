from django.conf.urls import patterns, include, url
from apps.{{appName}}.views import {{capitalize appName}}ListView, {{capitalize appName}}DetailView


urlpatterns = patterns(
    '',
    url(r'^$', {{capitalize appName}}ListView.as_view(), name='{{appName}}.list'),
    url(r'^(?P<slug>[-_\w]+)/$', {{capitalize appName}}DetailView.as_view(), name='{{appName}}.detail'),
)
