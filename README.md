# project-backend(Finance Dashboard Backend API)
Backend API for a finance dashboard with authentication, role-based access, transaction management, and analytics.

---

## Features

### User & Role Management

* User registration and login (JWT authentication)
* Role-based access control:

  * Viewer → View own data
  * Analyst → View all data and analytics
  * Admin → Full access (CRUD and user management)
* User status management (Active / Inactive)

---

### Transaction Management

* Create, update, and soft delete transactions
* Fields:

  * Amount
  * Type (INCOME / EXPENSE)
  * Category
  * Date
  * Notes
* Ownership restriction:

  * Users can only access their own data (unless Admin or Analyst)

---

### Dashboard Analytics

* Monthly trends (Income vs Expense)
* Net balance calculation
* Category-wise analytics
* Aggregation using MongoDB pipelines

---

### Security & Access Control

* JWT-based authentication
* Role-based authorization middleware
* Ownership validation for sensitive operations

---

### Validation & Error Handling

* Request validation using express-validator
* Proper error messages and HTTP status codes
* Input sanitization and normalization

---

### Pagination & Search

* Pagination support (page, limit)
* Filtering:

  * Type
  * Category
* Search support for improved data retrieval

---

### Soft Delete

* Transactions are not permanently deleted
* Uses `isDeleted` flag
* Excluded from all read and analytics APIs

---

### Rate Limiting

* Applied on login API to prevent brute-force attacks
* Configured using express-rate-limit

---

## Tech Stack

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT (Authentication)
* express-validator
* express-rate-limit

---

## Project Structure

```
src/
│
├── controllers/
├── models/
├── routes/
├── middleware/
├── validators/
├── utils/
└── app.js
```

---

## API Endpoints

### Auth

* POST /api/auth/register
* POST /api/auth/login

### Users (Admin)

* Update user role/status

### Transactions

* POST /api/transactions → Create
* GET /api/transactions → List (pagination and filters)
* PUT /api/transactions/:id → Update
* DELETE /api/transactions/:id → Soft delete

### Dashboard

* GET /api/dashboard/monthly-trends
* GET /api/dashboard/category-analytics

---

## Sample Query Parameters

```
/api/transactions?page=1&limit=5&type=EXPENSE&category=food
```

---

## Access Control Logic

| Role    | Permissions                         |
| ------- | ----------------------------------- |
| Viewer  | View own transactions               |
| Analyst | View all transactions and analytics |
| Admin   | Full access                         |

---

## Testing

Use Postman or Thunder Client.

Recommended test scenarios:

* Role-based access
* Soft delete behavior
* Pagination and filters
* Rate limiting on login

---

## Setup Instructions

```
git clone https://github.com/jdkatti/project-backend.git
cd project-backend
npm install
npm run dev
```

---

## Environment Variables

Create a `.env` file in the root directory:

```
PORT=3000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
```

Note: Do not commit the `.env` file to version control.

---

## Key Design Decisions

* Used soft delete instead of hard delete for data safety
* Implemented role-based and ownership-based access control
* Used MongoDB aggregation pipelines for analytics
* Added rate limiting to improve security
* Designed APIs with scalability and clarity in mind
