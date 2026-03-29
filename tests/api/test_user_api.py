import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from django.contrib.auth import get_user_model



User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.mark.django_db

def test_register_user(api_client):
    user = {
        "username" : "ayoub77",
        "email" : "ayoub@tech.ma",
        "password" : "12345ayoub",
        "password2" : "12345ayoub"
    }

    response = api_client.post(reverse("register"), user)

    assert response.data.get("username") == user["username"]
    assert response.data.get("email") == user["email"]
    assert response.status_code == 201

@pytest.mark.django_db
def test_user_login(api_client, user):

    response = api_client.post(reverse('get_token'), {"username" : user.username, "password" : "12345ayoub"})

    assert response.status_code == 200


@pytest.mark.django_db
def test_wrong_login(api_client):


    response = api_client.post(reverse('get_token'), {"username" : "qwq", "password" : "12345ayoub"})

    assert response.status_code == 401



@pytest.mark.django_db
def test_user_logout(auth_client):

    response = auth_client.post(reverse("auth_logout"), {"refresh_token" : auth_client.refresh_token})

    assert response.status_code == 205
    
    

    

    
    