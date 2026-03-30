import pytest
from django.urls import reverse


@pytest.mark.django_db
def test_todolist_create(auth_client):
    

    """
        Ensures a 201 status code is returned if a todolist is created,
        returned data should meets the payload's.
    """
    payload = {
        "title" : "My testing todolist.",
        "description" : "This is a good description for testing purposes",
        "tasks" : []
    }

    response = auth_client.post(reverse('todolist-list'), payload)

    assert response.status_code == 201
    assert response.data["title"] == payload["title"]
    assert response.data["description"] == payload["description"]


@pytest.mark.django_db
def test_todolist_create_authorization(api_client):

    """
        Ensures a 401 Unauthorized status code is returned
    """
    payload = {
        "title" : "My testing todolist.",
        "description" : "This is a good description for testing purposes",
        "tasks" : []
    }
    response = api_client.post(reverse("todolist-list"), payload)
    

    assert response.status_code == 401

@pytest.mark.django_db
def test_todolist_delete(todolist_data_client):

    " Ensure a 204 No Content status code is returned "
    
    todolist_id = todolist_data_client.todolist["id"]
    response = todolist_data_client.delete(f"/api/todolists/delete/{todolist_id}/")

    assert response.status_code == 204

@pytest.mark.django_db

def test_todolist_delete_authorization(api_client):

    """
        Ensures restricted access to the deletion endpoint,

        should return 401 Unauthorized status code.
    """

    response = api_client.delete(f"/api/todolists/delete/{1}/")

    assert response.status_code == 401

    

@pytest.mark.django_db

def test_task_create(todolist_data_client):

    todolist_id = todolist_data_client.todolist["id"]

    payload = {
        "task" : "Document my code",
        "priority" : "M",
        "category" : "coding"
    }

    response = todolist_data_client.post(f"/api/todolists/{todolist_id}/", payload)

    assert response.status_code == 201

@pytest.mark.django_db
    