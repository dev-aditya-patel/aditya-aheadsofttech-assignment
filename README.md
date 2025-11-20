
# AheadSoftTech Dynamic Form Builder

## Project Setup

This repository contains a **frontend** and **backend** setup for a dynamic form builder application.

```
aditya-aheadsofttech-assignment/
├── frontend/     # React application
└── server/       # Express + Mongoose backend
```

---

## Prerequisites

- Node.js (v14 or above recommended)  
- MongoDB  

---

## Installation

1. Clone the repo:
   ```bash
   git clone <your-repo-url>
   cd aditya-aheadsofttech-assignment
   ```

2. Install dependencies in both folders:
   ```bash
   cd frontend
   npm install

   cd ../server
   npm install
   ```

3. Create a `.env` file in the **server** folder with the following variables:
   ```
   DATABASE_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   ```

---

## Running the Applications

Run both front-end and back-end in development mode:

```bash
# In server folder
npm run dev

# In frontend folder
npm run dev
```

- Frontend: `http://localhost:5173`  
- Backend: `http://localhost:3500`

---

## Usage

### Public Forms (User)

- Go to `http://localhost:5173`  
- You will see a list of all published forms  
- Fill the forms and submit — your responses will be stored along with your IP

---

### Admin Panel

- Go to `http://localhost:5173/admin`  
- Here you can **create**, **edit**, **delete**, and **reorder** form fields  
- You can also **search** by title or description  
- Pagination: 10 forms per page

#### Create Form

- Navigate to `http://localhost:5173/admin/form-create`  
- Use the dropdown to choose input types (text, number, select, etc.)  
- Enter title and description for the form  
- Drag to reorder inputs  
- Delete any input if needed  

#### Edit Form

- Navigate to `http://localhost:5173/admin/form-edit/<form_id>`  
- You can drag to reorder fields  
- Change labels, names, options, and validation for each field  
- Save changes

---

## Security & Validation

- JWT-based authentication for admin routes  
- Inputs are validated on both backend and frontend  
- File uploads (if any) are handled securely by `multer`  
- NoSQL injection is prevented by sanitizing incoming payloads  

---

## Notes for Developers

- Allowed CORS origins are configured in `server/config/allowedOrigins.js`  
- Save your uploaded files in `server/public/uploads` (ensure this directory is created)  
- API responses include pagination metadata for listing forms  

---

