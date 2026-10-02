# Expense Tracker

Expense Tracker is a web application for managing daily expenses.
Users can add, edit, delete, and filter expenses, while summary cards show the total amount, number of expenses, and highest expense. The data is stored in a PostgreSQL database.

## How to run

### Backend

1. Open the project folder in VS Code.

2. Open the PostgreSQL application and create a database named:

```text
expense_tracker
```

3. Open the `schema.sql` file located in the backend folder.

4. Run the SQL commands in `schema.sql` inside the `expense_tracker` database to create the `expenses` table and insert the sample data.

5. Create a `.env` file inside the `backend` folder.

6. Add the database connection information to the `.env` file:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=YOUR_POSTGRES_PASSWORD
DB_NAME=expense_tracker
```

Replace `YOUR_POSTGRES_PASSWORD` with your PostgreSQL password.

7. Open the VS Code terminal and move to the backend folder:

```bash
cd backend
```

8. Install the required packages:

```bash
npm install
```

9. Start the backend server:

```bash
node server.js
```

The backend should run on:

```text
http://localhost:3000
```

### Frontend

1. Open the `frontend` folder.

2. Open `index.html` using VS Code Live Server.

3. The Expense Tracker application will open in the browser.

4. Make sure the backend server is running while using the frontend.

## Features

* [x] Add an expense with validation
* [x] Delete an expense
* [x] Edit an expense
* [x] Filter by category
* [x] Summary cards (total, count, highest)
* [x] Data is saved in a PostgreSQL database
* [x] Responsive design for desktop and mobile
* [x] CSS Grid for summary cards
* [x] Loading spinner
* [x] User-friendly error messages
* [x] Bootstrap modal for editing expenses

## Screenshots

### Desktop

Add a screenshot of the application on a desktop screen here.

![Expense Tracker Desktop](screenshots/desktop.png)

### Mobile

Add a screenshot of the application on a mobile screen here.

![Expense Tracker Mobile](screenshots/mobile.png)

## What was the hardest part?

The hardest part was connecting the frontend to the backend and making sure that the data was correctly sent to and received from the PostgreSQL database. I also had some issues while testing the API and running the backend from the correct folder.

I solved these problems by checking the browser console and the backend terminal, testing each API endpoint separately, and making sure that the frontend was using the correct API URL. I also tested GET, POST, PUT, and DELETE operations one by one before connecting everything together.
