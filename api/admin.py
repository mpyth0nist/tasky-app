from django.contrib import admin
from .models import TasksList, Task


@admin.register(TasksList)
class TasksListAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'owner')
    list_filter = ('owner',)
    search_fields = ('title', 'owner__username')


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'task', 'priority', 'state', 'category', 'todo_list')
    list_filter = ('priority', 'state')
    search_fields = ('task', 'category')
