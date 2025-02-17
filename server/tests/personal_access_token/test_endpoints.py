import pytest
from httpx import AsyncClient

from polar.config import settings
from polar.kit.db.postgres import AsyncSession


@pytest.mark.asyncio
@pytest.mark.http_auto_expunge
async def test_create(auth_jwt: str, client: AsyncClient) -> None:
    response = await client.post(
        "/api/v1/personal_access_tokens",
        json={"comment": "hello world"},
        cookies={settings.AUTH_COOKIE_KEY: auth_jwt},
    )

    assert response.status_code == 200
    assert response.json()["expires_at"] is not None
    assert len(response.json()["token"]) > 20
    assert response.json()["comment"] == "hello world"


@pytest.mark.asyncio
@pytest.mark.skip_db_asserts
async def test_list(auth_jwt: str, client: AsyncClient, session: AsyncSession) -> None:
    t1 = await client.post(
        "/api/v1/personal_access_tokens",
        json={"comment": "one"},
        cookies={settings.AUTH_COOKIE_KEY: auth_jwt},
    )

    t2 = await client.post(
        "/api/v1/personal_access_tokens",
        json={"comment": "two"},
        cookies={settings.AUTH_COOKIE_KEY: auth_jwt},
    )

    response = await client.get(
        "/api/v1/personal_access_tokens",
        cookies={settings.AUTH_COOKIE_KEY: auth_jwt},
    )

    assert response.status_code == 200
    assert len(response.json()["items"]) == 2
    ids = [t["id"] for t in response.json()["items"]]
    assert t1.json()["id"] in ids
    assert t2.json()["id"] in ids


@pytest.mark.asyncio
@pytest.mark.skip_db_asserts
async def test_delete(auth_jwt: str, client: AsyncClient) -> None:
    t1 = await client.post(
        "/api/v1/personal_access_tokens",
        json={"comment": "one"},
        cookies={settings.AUTH_COOKIE_KEY: auth_jwt},
    )

    t2 = await client.post(
        "/api/v1/personal_access_tokens",
        json={"comment": "two"},
        cookies={settings.AUTH_COOKIE_KEY: auth_jwt},
    )

    response = await client.delete(
        f"/api/v1/personal_access_tokens/{t1.json()['id']}",
        cookies={settings.AUTH_COOKIE_KEY: auth_jwt},
    )

    response = await client.get(
        "/api/v1/personal_access_tokens",
        cookies={settings.AUTH_COOKIE_KEY: auth_jwt},
    )

    assert response.status_code == 200
    assert len(response.json()["items"]) == 1
    ids = [t["id"] for t in response.json()["items"]]
    assert t1.json()["id"] not in ids
    assert t2.json()["id"] in ids


@pytest.mark.asyncio
@pytest.mark.skip_db_asserts
async def test_auth(auth_jwt: str, client: AsyncClient) -> None:
    response = await client.post(
        "/api/v1/personal_access_tokens",
        json={"comment": "hello world"},
        cookies={settings.AUTH_COOKIE_KEY: auth_jwt},
    )

    assert response.status_code == 200
    token = response.json()["token"]

    response = await client.get(
        "/api/v1/users/me",
        headers={"Authorization": "Bearer " + token},
    )

    assert response.status_code == 200
    assert len(response.json()["username"]) > 3


@pytest.mark.asyncio
@pytest.mark.skip_db_asserts
async def test_create_scoped(auth_jwt: str, client: AsyncClient) -> None:
    response = await client.post(
        "/api/v1/personal_access_tokens",
        json={"comment": "rss", "scopes": ["articles:read"]},
        cookies={settings.AUTH_COOKIE_KEY: auth_jwt},
    )

    assert response.status_code == 200
    assert response.json()["expires_at"] is not None
    assert len(response.json()["token"]) > 20
    assert response.json()["comment"] == "rss"

    response = await client.get(
        "/api/v1/users/me/scopes",
        headers={"Authorization": "Bearer " + response.json()["token"]},
    )

    assert response.json() == {"scopes": ["articles:read"]}


@pytest.mark.asyncio
@pytest.mark.skip_db_asserts
async def test_incorrect_scope(auth_jwt: str, client: AsyncClient) -> None:
    response = await client.post(
        "/api/v1/personal_access_tokens",
        json={"comment": "rss", "scopes": ["articles:read"]},
        cookies={settings.AUTH_COOKIE_KEY: auth_jwt},
    )

    assert response.status_code == 200
    assert response.json()["expires_at"] is not None
    assert len(response.json()["token"]) > 20
    assert response.json()["comment"] == "rss"

    response = await client.get(
        "/api/v1/users/me",
        headers={"Authorization": "Bearer " + response.json()["token"]},
    )

    assert (
        response.text
        == '{"detail":"Missing required scope: have=articles:read requires=web_default,user:read"}'
    )
    assert response.status_code == 403


@pytest.mark.asyncio
@pytest.mark.skip_db_asserts
async def test_correct_scope(auth_jwt: str, client: AsyncClient) -> None:
    response = await client.post(
        "/api/v1/personal_access_tokens",
        json={"comment": "rss", "scopes": ["user:read"]},
        cookies={settings.AUTH_COOKIE_KEY: auth_jwt},
    )

    assert response.status_code == 200
    assert response.json()["expires_at"] is not None
    assert len(response.json()["token"]) > 20
    assert response.json()["comment"] == "rss"

    response = await client.get(
        "/api/v1/users/me",
        headers={"Authorization": "Bearer " + response.json()["token"]},
    )

    assert response.status_code == 200
