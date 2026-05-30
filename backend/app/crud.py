from sqlalchemy.orm import Session
from sqlalchemy import or_
import datetime
import models, schemas

def generate_next_ticket_id(db: Session) -> str:
    # Find the latest ticket created
    latest_ticket = db.query(models.Ticket).order_by(models.Ticket.id.desc()).first()
    latest_num = 0
    if latest_ticket and latest_ticket.ticket_id.startswith("TKT-"):
        try:
            latest_num = int(latest_ticket.ticket_id.split("-")[1])
        except (ValueError, IndexError):
            pass
    next_num = latest_num + 1
    return f"TKT-{next_num:03d}"

def get_tickets(db: Session, status: str = None, search: str = None):
    query = db.query(models.Ticket)
    
    if status and status.strip() != "":
        query = query.filter(models.Ticket.status == status)
        
    if search and search.strip() != "":
        search_term = f"%{search}%"
        # Search by customer name, subject, or ticket_id
        query = query.filter(
            or_(
                models.Ticket.customer_name.ilike(search_term),
                models.Ticket.customer_email.ilike(search_term),
                models.Ticket.subject.ilike(search_term),
                models.Ticket.ticket_id.ilike(search_term)
            )
        )
    
    # Return sorted by newest first
    return query.order_by(models.Ticket.created_at.desc()).all()

def get_ticket_by_id(db: Session, ticket_id: str):
    return db.query(models.Ticket).filter(models.Ticket.ticket_id == ticket_id).first()

def create_ticket(db: Session, ticket: schemas.TicketCreate):
    ticket_id = generate_next_ticket_id(db)
    db_ticket = models.Ticket(
        ticket_id=ticket_id,
        customer_name=ticket.customer_name,
        customer_email=ticket.customer_email,
        subject=ticket.subject,
        description=ticket.description,
        status="Open"
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

def update_ticket(db: Session, ticket_id: str, ticket_update: schemas.TicketUpdate):
    db_ticket = get_ticket_by_id(db, ticket_id)
    if not db_ticket:
        return None
    
    # Update status
    db_ticket.status = ticket_update.status
    db_ticket.updated_at = datetime.datetime.utcnow()
    
    # Add note if provided
    if ticket_update.notes and ticket_update.notes.strip() != "":
        db_note = models.TicketNote(
            ticket_id=ticket_id,
            note_text=ticket_update.notes.strip()
        )
        db.add(db_note)
        
    db.commit()
    db.refresh(db_ticket)
    return db_ticket
