import datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.flow.models import Flow


async def start_flow(card_id: int, user_id: int, db: AsyncSession) -> Flow:
    result = await db.execute(select(Flow).where(Flow.user_id == user_id, Flow.end == None))
    previous_active_flow = result.scalar()
    if previous_active_flow:
        if previous_active_flow.card_id == card_id:
            return previous_active_flow
        previous_active_flow.end = datetime.datetime.now()

    flow = Flow(card_id=card_id, user_id=user_id)
    db.add(flow)
    await db.commit()
    await db.refresh(flow)
    return flow

async def get_flows(user_id: int, db: AsyncSession) -> list[Flow]:
    result = await db.execute(select(Flow).where(Flow.user_id == user_id).options(selectinload(Flow.card)))
    flows = result.scalars()
    return list(flows)