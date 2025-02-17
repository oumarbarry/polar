import base64
from collections.abc import Mapping
from uuid import UUID

import httpx
import structlog
from arq import Retry
from standardwebhooks.webhooks import Webhook as StandardWebhook

from polar.kit.db.postgres import AsyncSession
from polar.kit.utils import utc_now
from polar.logging import Logger
from polar.models.webhook_delivery import WebhookDelivery
from polar.worker import (
    AsyncSessionMaker,
    JobContext,
    PolarWorkerContext,
    task,
)

from .service import webhook_service

log: Logger = structlog.get_logger()

MAX_RETRIES = 5
DELAY = 10


@task("webhook_event.send")
async def webhook_event_send(
    ctx: JobContext,
    webhook_event_id: UUID,
    polar_context: PolarWorkerContext,
) -> None:
    async with AsyncSessionMaker(ctx) as session:
        return await _webhook_event_send(
            session, ctx=ctx, webhook_event_id=webhook_event_id
        )


async def _webhook_event_send(
    session: AsyncSession,
    *,
    ctx: JobContext,
    webhook_event_id: UUID,
) -> None:
    event = await webhook_service.get_event(session, webhook_event_id)
    if not event:
        raise Exception(f"webhook event not found id={webhook_event_id}")

    # TODO: validate URL

    ts = utc_now()

    b64secret = base64.b64encode(event.webhook_endpoint.secret.encode("utf-8")).decode(
        "utf-8"
    )

    # Sign the payload
    wh = StandardWebhook(b64secret)
    signature = wh.sign(str(event.id), ts, event.payload)

    headers: Mapping[str, str] = {
        "user-agent": "polar.sh webhooks",
        "content-type": "application/json",
        "webhook-id": str(event.id),
        "webhook-timestamp": str(int(ts.timestamp())),
        "webhook-signature": signature,
    }

    r = httpx.post(
        event.webhook_endpoint.url,
        content=event.payload,
        headers=headers,
        timeout=20.0,
    )

    succeeded = r.status_code >= 200 and r.status_code <= 299

    if succeeded:
        event.succeeded = True

    event.last_http_code = r.status_code

    delivery = WebhookDelivery(
        webhook_event_id=webhook_event_id,
        webhook_endpoint_id=event.webhook_endpoint_id,
        http_code=r.status_code,
        succeeded=succeeded,
    )
    session.add(delivery)

    if not succeeded and ctx["job_try"] >= MAX_RETRIES:
        # Permanent failure
        event.succeeded = False
        session.add(event)
        return

    # Retry
    if not succeeded:
        raise Retry(DELAY ** ctx["job_try"])

    # Successful
