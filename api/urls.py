from django.urls import path
from . import views

urlpatterns = [
    path('todolists/', views.CreateTodoList.as_view(), name='create-list'),
    path('todolists/delete/<int:pk>/', views.DeleteTodoList.as_view(), name='delete-list'),
    path('todolists/<int:todolist_id>/', views.AddTask.as_view(), name='show-todolists'),
    path('todolists/<int:todolist_id>/add/', views.AddTask.as_view(), name='add-task'),
    path('todolists/<int:todolist_id>/remove/<int:pk>/', views.RemoveTask.as_view(), name='remove-task'),
    path('todolists/<int:todolist_id>/<int:pk>/', views.UpdateTask.as_view(), name='update-task')
    
]