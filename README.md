# DataStraw Support CRM

A fully functional, responsive Customer Support Ticketing CRM System designed for support management, ticket tracking, and internal team collaboration. Built with a FastAPI backend (SQLite) and a React frontend styled with Tailwind CSS.

## 🚀 Key Features

* **Create Tickets**: Submit support requests with customer names, emails, subjects, and descriptions.
* **Sequential Ticket IDs**: Tickets automatically receive formatted sequential tracking IDs (e.g. `TKT-001`, `TKT-002`).
* **Interactive Ticket List**: View all tickets dynamically in a sidebar.
* **Search-as-you-type**: Live search matching customer name, email, subject, or Ticket ID (debounced to optimize API performance).
* **Status Filtering**: Filter tickets instantly using quick status tabs (*All*, *Open*, *In Progress*, *Closed*).
* **Ticket Workspace**: View complete ticket description and metadata.
* **Status Updates**: Instantly transition ticket statuses using a drop-down selector.
* **Internal Team Notes**: Post timestamps and messages to a collaboration log timeline for internal communication.
* **Responsive Layout**: Seamless transition between desktop split-pane and mobile stacked layout.

---

## 🛠️ Tech Stack

* **Backend**: FastAPI (Python 3), SQLAlchemy (ORM), Pydantic v2 (Validation & Schemas), Uvicorn (ASGI Server)
* **Frontend**: React.js, Tailwind CSS v3, Vite, React Context API
* **Database**: SQLite (2 tables: `tickets` and `ticket_notes`)

---

## 📂 Project Structure

```text
datastraw__crm/
├── backend/
│   ├── app/
│   │   ├── database.py   # SQLite Connection Setup
│   │   ├── models.py     # SQLAlchemy DB Models (tickets, ticket_notes)
│   │   ├── schemas.py    # Pydantic Schemas
│   │   ├── crud.py       # DB Create/Retrieve/Update Actions
│   │   └── main.py       # FastAPI Routers & CORS Middleware
│   ├── requirements.txt  # Python Dependencies
│   └── venv/             # Python Virtual Environment
└── frontend/
    ├── src/
    │   ├── context/
    │   │   └── TicketContext.jsx   # Global Ticketing State & API Client
    │   ├── components/
    │   │   ├── TicketList.jsx      # Left Sidebar & Filter Controls
    │   │   ├── TicketDetails.jsx   # Collaboration Logs & Workspace
    │   │   └── CreateTicketModal.jsx # New Ticket Scaffolding Dialogue
    │   ├── App.jsx                 # Navbar and Layout coordinator
    │   ├── index.css               # Fonts & Tailwind directives
    │   └── main.jsx                # DOM Mounting
    ├── tailwind.config.js          # Tailwind Configuration
    └── package.json                # Frontend Dependencies
```

---

## 💾 Database Schema

The SQLite database (`tickets_crm.db`) is normalized into exactly two tables:

### 1. `tickets`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INTEGER (PK) | Auto-incrementing row ID |
| `ticket_id` | TEXT (Unique, Index) | Human-readable ID (e.g. `TKT-001`) |
| `customer_name` | TEXT | Customer full name |
| `customer_email` | TEXT | Customer contact email |
| `subject` | TEXT | Brief topic summary |
| `description` | TEXT | Detailed support issue report |
| `status` | TEXT | Ticket state (`Open`, `In Progress`, `Closed`) |
| `created_at` | TIMESTAMP | Ticket opening time |
| `updated_at` | TIMESTAMP | Last modification time |

### 2. `ticket_notes`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INTEGER (PK) | Auto-incrementing note ID |
| `ticket_id` | TEXT (FK -> `tickets.ticket_id`) | Associated Ticket ID |
| `note_text` | TEXT | Collaboration note or update message |
| `created_at` | TIMESTAMP | Note submission timestamp |

---

## ⚡ API Endpoints

| Method | Endpoint | Request Body | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/tickets` | `{ customer_name, customer_email, subject, description }` | Create new ticket |
| **GET** | `/api/tickets` | *None* (Optional query: `?status=Open&search=query`) | Retrieve/search filtered ticket list |
| **GET** | `/api/tickets/{ticket_id}`| *None* | Get ticket details and all associated notes |
| **PUT** | `/api/tickets/{ticket_id}`| `{ status, notes }` | Update ticket status and/or append a new note |
| **GET** | `/api/health` | *None* | Retrieve API server health status |

---

## ⚙️ Development Setup

Follow these commands to start the backend and frontend servers locally:

### 1. Backend Setup

From the root directory, navigate to `backend`, activate the virtual environment, install requirements, and run the FastAPI server:

```bash
# Navigate to backend
cd backend

# Create Virtual Environment (if not already created)
python -m venv venv

# Activate Virtual Environment
# On Windows (Command Prompt/PowerShell):
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start local server (Runs on http://localhost:8000)
python -m uvicorn app.main:app --reload
```

### 2. Frontend Setup

From the root directory, navigate to `frontend`, install dependencies, and start the Vite server:

```bash
# Navigate to frontend
cd ../frontend

# Install dependencies
npm install

# Start development server (Runs on http://localhost:5173)
npm run dev
```
