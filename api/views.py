from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from .serializers import UserSerializer, TaskSerializer, ListSerializer
from .models import TasksList, Task


class UserRegistrationView(generics.CreateAPIView):
    """
    Register a new user account.
    POST: Create a new user with username, email and password.
    No authentication required.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class LogoutView(generics.GenericAPIView):
    """
    Logout by blacklisting the refresh token.
    POST: Blacklist the provided refresh token. Requires authentication.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")

            if not refresh_token:
                return Response(
                    {"error": "refresh_token field is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(
                {"message": "Successfully logged out"},
                status=status.HTTP_205_RESET_CONTENT
            )

        except TokenError:
            return Response(
                {"error": "Invalid or expired refresh token"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception:
            return Response(
                {"error": "An error occurred during logout"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CreateTodoList(generics.ListCreateAPIView):
    """
    GET: Returns all todo lists owned by the current user.
    POST: Creates a new todo list owned by the current user.
    """
    serializer_class = ListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TasksList.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class DeleteTodoList(generics.DestroyAPIView):
    """
    DELETE: Removes the specified todo list if owned by current user.
    """
    serializer_class = ListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TasksList.objects.filter(owner=self.request.user)


class AddTask(generics.ListCreateAPIView):
    """
    GET: Returns all tasks in the specified todo list.
    POST: Creates a new task in the specified todo list.
    """
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_todolist(self):
        return get_object_or_404(
            TasksList,
            id=self.kwargs['todolist_id'],
            owner=self.request.user
        )

    def get_queryset(self):
        return Task.objects.filter(todo_list=self.get_todolist())

    def perform_create(self, serializer):
        serializer.save(todo_list=self.get_todolist())


class RemoveTask(generics.DestroyAPIView):
    """
    DELETE: Removes the specified task if it belongs to a todo list
    owned by the current user.
    """
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        todolist = get_object_or_404(
            TasksList,
            id=self.kwargs['todolist_id'],
            owner=self.request.user
        )
        return Task.objects.filter(todo_list=todolist)


class UpdateTask(generics.UpdateAPIView):
    """
    PATCH/PUT: Updates the specified task if it belongs to a todo list
    owned by the current user.
    """
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_todolists = TasksList.objects.filter(owner=self.request.user)
        return Task.objects.filter(todo_list__in=user_todolists)