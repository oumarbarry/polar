import contextlib
from collections.abc import AsyncIterator
from typing import cast

import pytest
from arq import ArqRedis

from polar.kit.db.postgres import AsyncEngine, AsyncSession, AsyncSessionMaker
from polar.kit.utils import utc_now
from polar.worker import JobContext, PolarWorkerContext


@pytest.fixture
def job_context(engine: AsyncEngine, session: AsyncSession) -> JobContext:
    @contextlib.asynccontextmanager
    async def sessionmaker() -> AsyncIterator[AsyncSession]:
        yield session

    return {
        "redis": ArqRedis(),
        "async_engine": engine,
        "async_sessionmaker": cast(AsyncSessionMaker, sessionmaker),
        "job_id": "fake_job_id",
        "job_try": 1,
        "enqueue_time": utc_now(),
        "score": 0,
    }


@pytest.fixture
def polar_worker_context() -> PolarWorkerContext:
    return PolarWorkerContext()
