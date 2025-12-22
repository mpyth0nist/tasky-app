from django.contrib.auth.models import User
from .models import TasksList, Task
from rest_framework import serializers
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ["id", "task", "priority","state", "category", "todo_list"]

class ListSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = TasksList   
        fields = ["id", "title", "description"]
        
