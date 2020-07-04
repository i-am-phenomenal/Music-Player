"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include 
from rest_framework import routers
from todo import views
from django.conf import settings
from django.conf.urls.static import static 
from graphene_django.views import GraphQLView
from .schema import schema

# router = routers.DefaultRouter()
# router.register(r'todos', views.TodoView, 'todo')

urlpatterns = [
    path('graphql/', GraphQLView.as_view(schema=schema, graphiql=True)),
    path('admin/', admin.site.urls),
    path('api/all_events/', views.get_all_events),
    path('api/todos/', views.todo_view),
    path('api/todos/create/', views.create_todo),
    path('api/upload_file/', views.process_and_upload),
    path('api/all_files/', views.all_files),
    path('api/play/', views.play_song),
    path('api/delete/', views.delete_specific),
    path('api/get_info/', views.get_info_for_specific),
    path('api/signup/', views.register_user),
    path('api/admin/', views.admin_login),
    path('api/get_all_users/', views.fetch_all_users),
    path('api/load_seed_data/', views.load_seed_data),
    path('api/fetch_user/', views.fetch_user),
    path('api/update_profile/', views.update_user_profile),
    path('api/change_login_status/', views.change_user_login_status),
    path('api/search/', views.search),
]

if settings.DEBUG: 
    urlpatterns += static(settings.MEDIA_URL, document_root= settings.MEDIA_ROOT)