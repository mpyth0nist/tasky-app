from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class TasksList(models.Model):
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255, blank=True)
    owner = models.ForeignKey(User, related_name='todolists', on_delete=models.CASCADE )
    
    def __str__(self):
        return self.title


class Task(models.Model):
    task = models.CharField(max_length=255)
    priority = models.CharField(max_length=1, default='M')
    state = models.BooleanField(default=False)
    category = models.CharField(max_length=100, default='Unspecified')
    todo_list = models.ForeignKey(TasksList, related_name="tasks", on_delete=models.CASCADE)

    def __str__(self):
        return self.task