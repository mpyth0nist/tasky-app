from django.contrib.auth.models import User
from .models import TasksList, Task
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}
        read_only_fields = ["id"]

    def create(self, validated_data):
        """Create user with properly hashed password."""
        user = User.objects.create_user(**validated_data)
        return user


class TaskSerializer(serializers.ModelSerializer):
    """
    Serializer for tasks.
    
    Note: todo_list is read-only and must be set by the view's perform_create() method.
    This prevents users from assigning tasks to todolists they don't own.
    """
    
    class Meta:
        model = Task
        fields = ["id", "task", "priority", "state", "category", "todo_list"]
        read_only_fields = ["id", "todo_list"]


class ListSerializer(serializers.ModelSerializer):
    """
    Serializer for todo lists.
    
    Note: owner is not included in fields and must be set by the view's perform_create() method.
    This prevents users from creating todolists for other users.
    """
    
    class Meta:
        model = TasksList   
        fields = ["id", "title", "description"]
        read_only_fields = ["id"]
