def test_rename_column(client, auth_headers):
    resp = client.get("/api/board", headers=auth_headers)
    col_id = resp.json()["columns"][0]["id"]

    rename_resp = client.put(
        f"/api/columns/{col_id}",
        json={"name": "Backlog"},
        headers=auth_headers,
    )
    assert rename_resp.status_code == 200
    assert rename_resp.json()["name"] == "Backlog"

    # Restore original name so other tests aren't affected
    client.put(f"/api/columns/{col_id}", json={"name": "To Do"}, headers=auth_headers)


def test_rename_nonexistent_column(client, auth_headers):
    resp = client.put("/api/columns/999999", json={"name": "Ghost"}, headers=auth_headers)
    assert resp.status_code == 404
