from django.conf.urls import patterns, include, url
from apps.{{appname}}.views import {{_.capitalize(appname)}}ListView, {{_.capitalize(appname)}}DetailView


urlpatterns = patterns(
    '',
    url(r'^$', {{_.capitalize(appname)}}ListView.as_view(), name='{{appname}}.list'),
    url(r'^(?P<slug>[-_\w]+)/$', {{_.capitalize(appname)}}DetailView.as_view(), name='{{appname}}.detail'),
)
