from django.urls import path
from . import views

urlpatterns = [
    # Todo list endpoints — static string segments before int captures
    path('todolists/', views.CreateTodoList.as_view(), name='todolist-list'),
    path('todolists/delete/<int:pk>/', views.DeleteTodoList.as_view(), name='todolist-delete'),

    # Task endpoints — more specific paths before generic ones
    path('todolists/<int:todolist_id>/tasks/<int:pk>/', views.UpdateTask.as_view(), name='task-update'),
    path('todolists/<int:todolist_id>/remove/<int:pk>/', views.RemoveTask.as_view(), name='task-remove'),
    path('todolists/<int:todolist_id>/', views.AddTask.as_view(), name='task-list'),
]
