from django.db import models
from django.contrib.auth.models import User


class TasksList(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)  # TextField for open-ended user content
    owner = models.ForeignKey(User, related_name='todolists', on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class Task(models.Model):
    class Priority(models.TextChoices):
        LOW = 'L', 'Low'
        MEDIUM = 'M', 'Medium'
        HIGH = 'H', 'High'

    task = models.CharField(max_length=255)
    priority = models.CharField(
        max_length=1,
        choices=Priority.choices,
        default=Priority.MEDIUM,
    )
    state = models.BooleanField(default=False)
    category = models.CharField(max_length=100, blank=True, default='Unspecified')
    todo_list = models.ForeignKey(TasksList, related_name="tasks", on_delete=models.CASCADE)

    def __str__(self):
        return self.task