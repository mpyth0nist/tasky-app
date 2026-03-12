from django.contrib.auth.models import User
from .models import TasksList, Task
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user registration with email and password confirmation."""

    email = serializers.EmailField(required=True)
    password2 = serializers.CharField(write_only=True, label="Confirm password")

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "password2"]
        extra_kwargs = {"password": {"write_only": True}}
        read_only_fields = ["id"]

    def validate(self, data):
        """Ensure both passwords match."""
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return data

    def create(self, validated_data):
        """Create user with properly hashed password."""
        validated_data.pop('password2')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
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
    Nested tasks are returned read-only to reduce frontend round-trips.
    """

    tasks = TaskSerializer(many=True, read_only=True)

    class Meta:
        model = TasksList
        fields = ["id", "title", "description", "tasks"]
        read_only_fields = ["id"]
