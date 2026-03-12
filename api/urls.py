from django.urls import path
from . import views

urlpatterns = [
    # Todo list endpoints
    path('todolists/', views.TodoListView.as_view(), name='todolist-list'),
    path('todolists/<int:pk>/', views.TodoListDetailView.as_view(), name='todolist-detail'),
    # Backwards-compatible delete alias used by the current frontend
    path('todolists/delete/<int:pk>/', views.TodoListDetailView.as_view(), name='todolist-delete'),

    # Task endpoints (nested under a todolist)
    path('todolists/<int:todolist_id>/tasks/', views.TaskView.as_view(), name='task-list'),
    path('todolists/<int:todolist_id>/tasks/<int:pk>/', views.TaskDetailView.as_view(), name='task-detail'),

    # Legacy task endpoints — kept for frontend compatibility
    path('todolists/<int:todolist_id>/', views.TaskView.as_view(), name='task-list-legacy'),
    path('todolists/<int:todolist_id>/add/', views.TaskView.as_view(), name='task-add-legacy'),
    path('todolists/<int:todolist_id>/remove/<int:pk>/', views.TaskDetailView.as_view(), name='task-remove-legacy'),
    path('todolists/<int:todolist_id>/<int:pk>/', views.TaskDetailView.as_view(), name='task-detail-legacy'),
]