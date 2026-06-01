from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional

class NoteBase(BaseModel):
    note_text: str

class NoteCreate(NoteBase):
    pass

class NoteResponse(NoteBase):
    id: int
    ticket_id: str
    created_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True


class TicketCreate(BaseModel):
    customer_name: str
    customer_email: EmailStr
    subject: str
    description: str

class TicketCreateResponse(BaseModel):
    ticket_id: str
    created_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True

class TicketListResponse(BaseModel):
    ticket_id: str
    customer_name: str
    subject: str
    status: str
    created_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True

class TicketDetailsResponse(BaseModel):
    ticket_id: str
    customer_name: str
    customer_email: EmailStr
    subject: str
    description: str
    status: str
    notes: List[NoteResponse]
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True

class TicketUpdate(BaseModel):
    status: str  
    notes: Optional[str] = None  
