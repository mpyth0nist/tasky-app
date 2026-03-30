from django.urls import reverse
import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model



@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user(db):
    User = get_user_model()

    registered_user = User.objects.create_user(
        username="ayoub77",
        email="ayoub@tech.ma",
        password="12345ayoub",
    )

    return registered_user


@pytest.fixture
def auth_client(api_client, user):

    response = api_client.post(reverse("get_token"), {"username" : user.username, "password" : "12345ayoub"})

    assert response.status_code == 200

    access_token = response.data.get("access")
    refresh_token = response.data.get("refresh")
    
    api_client.refresh_token = refresh_token
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")


    return api_client


@pytest.fixture

def todolist_data_client(auth_client, db):
        
    payload = {
        "title" : "My testing todolist.",
        "description" : "This is a good description for testing purposes",
        "tasks" : []
    }

    response = auth_client.post(reverse('todolist-list'), payload)

    auth_client.todolist = response.data

    return auth_client


