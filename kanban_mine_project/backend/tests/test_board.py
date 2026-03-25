def test_get_board(client, auth_headers):
    resp = client.get("/api/board", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["name"] == "My Board"
    assert len(data["columns"]) == 3
    column_names = [c["name"] for c in data["columns"]]
    assert "To Do" in column_names
    assert "In Progress" in column_names
    assert "Done" in column_names
