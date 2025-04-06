from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

import src.flow.service as service
from src.auth.dependencies import get_current_user
from src.auth.models import User
from src.database import get_db
from src.flow.schemas import FlowStart, FlowOut, FlowEdit

flow_router = APIRouter()

@flow_router.post("/start_flow", response_model=FlowStart)
async def start_flow(flow_info: FlowStart, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await service.start_flow(flow_info.card_id, user.id, db)

@flow_router.get("/get", response_model=list[FlowOut])
async def get_flows(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await service.get_flows(user.id, db)

@flow_router.post("/edit", response_model=FlowStart)
async def get_flows(flow: FlowEdit, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if flow.start >= flow.end:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Start time must not be after end time.")


    return await service.edit_flow(user.id, flow.card_id, flow.start, flow.end, db)

