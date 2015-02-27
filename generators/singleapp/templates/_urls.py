from django.conf.urls import patterns, include, url
from views import <%= appname %>ListView, <%= appname %>DetailView


urlpatterns = patterns(
    '',
    url(r'^/$', <%= appname %>ListView.as_view(), name='<%= appname %>.list'),
    url(r'^/(?P<slug>[-_\w]+)/$', <%= appname %>DetailView.as_view(), name='<%= appname %>.detail'),
)
