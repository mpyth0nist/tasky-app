from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, TaskSerializer, ListSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import TasksList, Task



# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class LogoutView(generics.GenericAPIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(status=status.HTTP_205_RESET_CONTENT)

        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    

class CreateTodoList(generics.ListCreateAPIView):
    serializer_class = ListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        return TasksList.objects.filter(owner=user)

    def perform_create(self, serializer):

        if serializer.is_valid():
            serializer.save(owner=self.request.user)
        else:
            print(serializer.errors)



class DeleteTodoList(generics.DestroyAPIView):
    serializer_class = ListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        return TasksList.objects.filter(owner=user)


class AddTask(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        todolist = TasksList.objects.get(id=self.kwargs['todolist_id'])

        return Task.objects.filter(todo_list = todolist )

    def perform_create(self, serializer):
        todolist = TasksList.objects.get(id=self.kwargs['todolist_id'])
        if serializer.is_valid():
            serializer.save(todo_list = todolist)
        else:
            print(serializer.errors)

class RemoveTask(generics.DestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        todolist = TasksList.objects.get(id=self.kwargs['todolist_id'])

        return Task.objects.filter(todo_list = todolist)


class UpdateTask(generics.UpdateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]


