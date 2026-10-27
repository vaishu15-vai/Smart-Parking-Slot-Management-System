# Smart Parking Management System

A full-stack web application to manage a parking facility: park and remove vehicles, manage parking slots, search records and generate parking reports.

**Tech stack:** React.js · Node.js · Express.js · MySQL · REST APIs · Postman (API testing)
**Author:** Vaishnavi (solo project)
**Links:** [GitHub](https://github.com/vaishu15-vai/Smart-Parking-Slot-Management-System) · [Live demo](https://smart-parking-slot-management-syste-ten.vercel.app/)

> Items marked **«FILL»** must be completed or checked against your own code before you publish or share this document. Don't leave anything in that you can't explain.

---

## 1. Overview

Manual parking records are slow and error-prone. This system gives an operator one dashboard to see which slots are free or occupied, register a vehicle when it enters, release the slot when it leaves, look up past records and produce reports.

## 2. Features

- Park a vehicle and assign it a slot
- Remove a vehicle and free its slot
- View and manage parking slots
- Search vehicle and parking records
- Generate parking reports
- Responsive dashboard that works on desktop and mobile

## 3. Architecture

```
React.js frontend  ──HTTP/JSON──▶  Express.js REST API (Node.js)  ──SQL──▶  MySQL database
(dashboard, forms)                 (validation, business logic)             (slots, vehicles, records)
```

| Layer | Responsibility |
|---|---|
| Frontend (React.js) | Dashboard, forms for park/remove, search and report views |
| Backend (Node.js + Express.js) | REST endpoints, input validation, database queries |
| Database (MySQL) | Persistent storage for slots, vehicles and parking records |

## 4. Database design

**«FILL»** Copy the real table and column names from your SQL file. A typical structure for this kind of project is:

| Table | Purpose | Key columns **«FILL / correct»** |
|---|---|---|
| `slots` | Each parking slot and its status | slot id, slot number, status (free/occupied) |
| `vehicles` / `parking_records` | Vehicles parked and history | vehicle number, slot id, entry time, exit time |

## 5. API endpoints

**«FILL»** Replace with the exact routes from your Express code (check your `routes` folder or `server.js`) and the methods you tested in Postman.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `«/park»` | Park a vehicle in a slot |
| PUT/DELETE | `«/remove»` | Remove a vehicle and free the slot |
| GET | `«/slots»` | List all slots with status |
| GET | `«/search»` | Search records |
| GET | `«/reports»` | Generate parking report |

## 6. Setup and installation

**Prerequisites:** Node.js, npm, MySQL, Git

```bash
# 1. Clone the repository
git clone https://github.com/vaishu15-vai/Smart-Parking-Slot-Management-System.git
cd Smart-Parking-Slot-Management-System

# 2. Create the database (import your SQL file)
mysql -u root -p < «database.sql»

# 3. Backend
cd «backend-folder»
npm install
# create a .env file with: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, PORT
npm start

# 4. Frontend (new terminal)
cd «frontend-folder»
npm install
npm start
```

**«FILL»** Use your actual folder names, SQL file name and environment variable names.

## 7. Testing

- All REST endpoints were tested with **Postman** to confirm correct responses and to find faults.
- Test cases to document: parking in a free slot, parking in an occupied slot, removing a vehicle that isn't parked, searching for a missing record. **«FILL»** Add the results you actually observed.

## 8. Troubleshooting log

This section shows debugging across layers and matches the support-style skills employers look for. **«FILL»** Replace the examples with real problems you hit.

| Problem | Layer | Cause | Fix |
|---|---|---|---|
| «e.g. Frontend shows empty slot list» | Frontend/API | «e.g. wrong API URL or CORS error» | «what you changed» |
| «e.g. API returns 500 on park request» | API/Database | «e.g. SQL column mismatch» | «what you changed» |

## 9. Limitations and future improvements

- Add user login and role-based access (admin vs operator)
- Add automatic fee calculation based on parking duration
- Add real-time slot updates and notifications
- Add automated tests and deployment of the backend

## 10. Author

Vaishnavi · [GitHub](https://github.com/vaishu15-vai) · [LinkedIn](https://www.linkedin.com/in/vaishnavi-choudhary-a5337b343) · choudharyvaishnavi312@gmail.com
