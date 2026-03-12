from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
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
    
    POST: Create a new user with username and password.
    No authentication required.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class LogoutView(generics.GenericAPIView):
    """
    Logout by blacklisting the refresh token.
    
    POST: Blacklist the provided refresh token.
    Requires authentication.
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
        except Exception as e:
            return Response(
                {"error": "An error occurred during logout"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CreateTodoList(generics.ListCreateAPIView):
    """
    List all todo lists for authenticated user and create new ones.
    
    GET: Returns all todo lists owned by the current user.
    POST: Creates a new todo list owned by the current user.
    """
    serializer_class = ListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return only todo lists owned by the current user."""
        return TasksList.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        """Save the todo list with the current user as owner."""
        serializer.save(owner=self.request.user)


class DeleteTodoList(generics.DestroyAPIView):
    """
    Delete a todo list owned by the authenticated user.
    
    DELETE: Removes the specified todo list if owned by current user.
    """
    serializer_class = ListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return only todo lists owned by the current user."""
        return TasksList.objects.filter(owner=self.request.user)


class AddTask(generics.ListCreateAPIView):
    """
    List tasks in a todo list and add new tasks.
    
    GET: Returns all tasks in the specified todo list.
    POST: Creates a new task in the specified todo list.
    Only works if the todo list is owned by the current user.
    """
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_todolist(self):
        """
        Get the todo list and verify ownership.
        Caches the result to avoid duplicate queries.
        """
        if not hasattr(self, '_todolist'):
            self._todolist = get_object_or_404(
                TasksList,
                id=self.kwargs['todolist_id'],
                owner=self.request.user
            )
        return self._todolist

    def get_queryset(self):
        """Return tasks only from todo lists owned by the current user."""
        return Task.objects.filter(todo_list=self.get_todolist())

    def perform_create(self, serializer):
        """Save the task to the specified todo list."""
        serializer.save(todo_list=self.get_todolist())


class RemoveTask(generics.DestroyAPIView):
    """
    Remove a task from a todo list.
    
    DELETE: Removes the specified task if it belongs to a todo list
    owned by the current user.
    """
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return tasks only from todo lists owned by the current user."""
        todolist = get_object_or_404(
            TasksList,
            id=self.kwargs['todolist_id'],
            owner=self.request.user
        )
        return Task.objects.filter(todo_list=todolist)


class UpdateTask(generics.UpdateAPIView):
    """
    Update a task in a todo list.
    
    PATCH/PUT: Updates the specified task if it belongs to a todo list
    owned by the current user.
    """
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return only tasks from todo lists owned by the current user."""
        user_todolists = TasksList.objects.filter(owner=self.request.user)
        return Task.objects.filter(todo_list__in=user_todolists)
