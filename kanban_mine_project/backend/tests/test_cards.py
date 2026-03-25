import pytest


@pytest.fixture
def todo_column_id(client, auth_headers):
    resp = client.get("/api/board", headers=auth_headers)
    cols = resp.json()["columns"]
    return next(c["id"] for c in cols if c["name"] == "To Do")


@pytest.fixture
def done_column_id(client, auth_headers):
    resp = client.get("/api/board", headers=auth_headers)
    cols = resp.json()["columns"]
    return next(c["id"] for c in cols if c["name"] == "Done")


def test_create_card(client, auth_headers, todo_column_id):
    resp = client.post(
        "/api/cards",
        json={"column_id": todo_column_id, "title": "Test card", "description": "desc", "position": 0},
        headers=auth_headers,
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["title"] == "Test card"
    assert data["column_id"] == todo_column_id


def test_move_card_between_columns(client, auth_headers, todo_column_id, done_column_id):
    # Create a card in To Do
    create_resp = client.post(
        "/api/cards",
        json={"column_id": todo_column_id, "title": "Move me", "position": 0},
        headers=auth_headers,
    )
    card_id = create_resp.json()["id"]

    # Move it to Done
    patch_resp = client.patch(
        f"/api/cards/{card_id}",
        json={"column_id": done_column_id, "position": 0},
        headers=auth_headers,
    )
    assert patch_resp.status_code == 200
    assert patch_resp.json()["column_id"] == done_column_id

    # Verify via board
    board = client.get("/api/board", headers=auth_headers).json()
    done_col = next(c for c in board["columns"] if c["id"] == done_column_id)
    card_ids = [c["id"] for c in done_col["cards"]]
    assert card_id in card_ids


def test_update_card_title(client, auth_headers, todo_column_id):
    create_resp = client.post(
        "/api/cards",
        json={"column_id": todo_column_id, "title": "Original", "position": 0},
        headers=auth_headers,
    )
    card_id = create_resp.json()["id"]

    patch_resp = client.patch(
        f"/api/cards/{card_id}",
        json={"title": "Updated"},
        headers=auth_headers,
    )
    assert patch_resp.status_code == 200
    assert patch_resp.json()["title"] == "Updated"


def test_delete_card(client, auth_headers, todo_column_id):
    create_resp = client.post(
        "/api/cards",
        json={"column_id": todo_column_id, "title": "Delete me", "position": 0},
        headers=auth_headers,
    )
    card_id = create_resp.json()["id"]

    del_resp = client.delete(f"/api/cards/{card_id}", headers=auth_headers)
    assert del_resp.status_code == 204

    # Should no longer appear on the board
    board = client.get("/api/board", headers=auth_headers).json()
    all_card_ids = [c["id"] for col in board["columns"] for c in col["cards"]]
    assert card_id not in all_card_ids


def test_patch_nonexistent_card(client, auth_headers):
    resp = client.patch("/api/cards/999999", json={"title": "Ghost"}, headers=auth_headers)
    assert resp.status_code == 404
