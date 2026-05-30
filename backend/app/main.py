from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import datetime
from database import engine, Base, get_db
import schemas, crud
        
# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Customer Support Ticketing CRM API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://support-crm-1-ji9j.onrender.com"],  # In production, specify the actual frontend domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/tickets", response_model=schemas.TicketCreateResponse, status_code=201)
def create_ticket(ticket: schemas.TicketCreate, db: Session = Depends(get_db)):
    db_ticket = crud.create_ticket(db=db, ticket=ticket)
    return db_ticket

@app.get("/api/tickets", response_model=List[schemas.TicketListResponse])
def get_tickets(
    status: Optional[str] = Query(None, description="Filter by status (Open, In Progress, Closed)"),
    search: Optional[str] = Query(None, description="Search term for customer name, email, subject, or ID"),
    db: Session = Depends(get_db)
):
    return crud.get_tickets(db=db, status=status, search=search)

@app.get("/api/tickets/{ticket_id}", response_model=schemas.TicketDetailsResponse)
def get_ticket(ticket_id: str, db: Session = Depends(get_db)):
    db_ticket = crud.get_ticket_by_id(db=db, ticket_id=ticket_id)
    if not db_ticket:
        raise HTTPException(status_code=404, detail=f"Ticket {ticket_id} not found")
    return db_ticket

@app.put("/api/tickets/{ticket_id}")
def update_ticket(ticket_id: str, ticket_update: schemas.TicketUpdate, db: Session = Depends(get_db)):
    # Validate status values
    allowed_statuses = ["Open", "In Progress", "Closed"]
    if ticket_update.status not in allowed_statuses:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid status. Must be one of: {', '.join(allowed_statuses)}"
        )
        
    db_ticket = crud.update_ticket(db=db, ticket_id=ticket_id, ticket_update=ticket_update)
    if not db_ticket:
        raise HTTPException(status_code=404, detail=f"Ticket {ticket_id} not found")
        
    return {
        "success": True,
        "updated_at": db_ticket.updated_at
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.datetime.utcnow()}
