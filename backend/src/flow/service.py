import datetime

from sqlalchemy import select, or_
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


async def edit_flow(
        user_id: int,
        card_id: int,
        start_time: datetime.datetime,
        end_time: datetime.datetime,
        db: AsyncSession
) -> Flow:
    start_time = start_time.replace(tzinfo=None)
    end_time = end_time.replace(tzinfo=None)

    flow_end_only_result = await db.execute(select(Flow)
    .where(
        Flow.user_id == user_id,
        Flow.start < start_time,
        Flow.end >= start_time,
        Flow.end <= end_time
    ))

    flow_end_only = flow_end_only_result.scalar_one_or_none()

    flows_start_end_result = await db.execute(select(Flow)
    .where(
        Flow.user_id == user_id,
        Flow.start >= start_time,
        Flow.start <= end_time,
        Flow.end >= start_time,
        Flow.end <= end_time
    ))
    flows_start_end = flows_start_end_result.scalars().all()

    flow_start_only_result = await db.execute(
        select(Flow).where(
            Flow.user_id == user_id,
            Flow.start >= start_time,
            Flow.start <= end_time,
            or_(
                Flow.end == None,
                Flow.end > end_time
            )
        )
    )
    flow_start_only = flow_start_only_result.scalar_one_or_none()

    flow_to_divide_result = await db.execute(
        select(Flow).where(
            Flow.user_id == user_id,
            Flow.start < start_time,
            or_(Flow.end > end_time,
                Flow.end == None)
        )
    )
    flow_to_divide = flow_to_divide_result.scalar_one_or_none()

    # print("-------------------------------------------------------------------------------------")
    # print(flows_start_end)
    # print(flow_start_only)
    # print(flow_end_only)
    # print(flow_to_divide)
    # print("-------------------------------------------------------------------------------------")

    for flow in flows_start_end:
        await db.delete(flow)

    if flow_start_only:
        flow_start_only.start = end_time

    if flow_end_only:
        flow_end_only.end = start_time

    if flow_to_divide:
        ftd_new = Flow(card_id=flow_to_divide.card_id, user_id=user_id, start=end_time, end=flow_to_divide.end)
        flow_to_divide.end = start_time
        db.add(ftd_new)

    new_flow = Flow(card_id=card_id, user_id=user_id, start=start_time, end=end_time)

    db.add(new_flow)
    await db.commit()
    await db.refresh(new_flow)
    return new_flow