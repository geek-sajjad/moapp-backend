# Accounting Application - دفترمعین (Daftarmoein)

## Overview

This is a complete accounting application backend built with NestJS, TypeORM, and PostgreSQL. The application allows users to manage their contacts and track financial transactions with them.

## Features

### 1. User Management
- User registration with username, password, phone number, and full name
- User authentication via JWT tokens
- User profile management
- Support for multiple users with isolated data

### 2. Contact Management (مخاطبین)
- Create, read, update, and delete contacts
- Each contact has:
  - Name (not unique - multiple contacts can have the same name)
  - Optional phone number
  - Association with a specific user
- View all contacts with balance information
- Automatic ownership verification

### 3. Transaction Management (معاملات)
- Create, read, update, and delete transactions
- Each transaction has:
  - **Amount**: Monetary value
  - **Date**: Transaction date
  - **Type**: 
    - `CREDIT` (بستانکار): They owe me
    - `DEBIT` (بدهکار): I owe them
  - **Description**: Optional note about the transaction
  - **Contact**: Associated contact
- View all transactions for a specific contact
- Automatic ownership verification through contact

### 4. Financial Summaries
- Contact-level summary:
  - Total credit (money they owe you)
  - Total debit (money you owe them)
  - Net balance
  - Transaction count
- User-level summary:
  - Total across all contacts
  - Overall financial position

## Database Schema

### Users Table
```sql
- id (UUID, Primary Key)
- username (Unique)
- email (Unique, Optional)
- phoneNumber (Unique)
- fullName
- password (Hashed)
- role (Default: USER)
- isActive (Default: true)
- firebaseToken (Optional)
- createdAt
- updatedAt
```

### Contacts Table
```sql
- id (UUID, Primary Key)
- name
- phoneNumber (Optional)
- user_id (Foreign Key → users.id, CASCADE DELETE)
- createdAt
- updatedAt
```

### Transactions Table
```sql
- id (UUID, Primary Key)
- amount (Decimal 15,2)
- date (Date)
- type (ENUM: 'DEBIT' | 'CREDIT')
- description (Text, Optional)
- contact_id (Foreign Key → contacts.id, CASCADE DELETE)
- createdAt
- updatedAt
```

## API Endpoints

### User Endpoints

#### Create User
```
POST /users
Body: {
  "username": "john_doe",
  "email": "john@example.com",
  "phoneNumber": "+989123456789",
  "fullName": "John Doe",
  "password": "StrongPass123!"
}
```

#### Get Current User Profile
```
GET /users/me
Headers: Authorization: Bearer {token}
```

#### Update Current User
```
PATCH /users/me
Headers: Authorization: Bearer {token}
Body: {
  "fullName": "John Updated Doe"
}
```

#### Delete Current User
```
DELETE /users/me
Headers: Authorization: Bearer {token}
```

### Contact Endpoints

#### Create Contact
```
POST /contacts
Headers: Authorization: Bearer {token}
Body: {
  "name": "Ahmad Rezaei",
  "phoneNumber": "+989121234567"
}
```

#### Get All Contacts
```
GET /contacts
Headers: Authorization: Bearer {token}
```

#### Get All Contacts With Balance
```
GET /contacts/with-balance
Headers: Authorization: Bearer {token}
Response: {
  "success": true,
  "message": "message.CONTACT.RETRIEVED",
  "data": [
    {
      "id": "uuid",
      "name": "Ahmad Rezaei",
      "phoneNumber": "+989121234567",
      "balance": 15000,  // Positive: they owe you, Negative: you owe them
      "transactionCount": 5
    }
  ]
}
```

#### Get Contact By ID
```
GET /contacts/:id
Headers: Authorization: Bearer {token}
```

#### Update Contact
```
PATCH /contacts/:id
Headers: Authorization: Bearer {token}
Body: {
  "name": "Ahmad Updated"
}
```

#### Delete Contact
```
DELETE /contacts/:id
Headers: Authorization: Bearer {token}
```

### Transaction Endpoints

#### Create Transaction
```
POST /transactions
Headers: Authorization: Bearer {token}
Body: {
  "amount": 50000,
  "date": "2024-01-15",
  "type": "CREDIT",  // or "DEBIT"
  "description": "Payment for lunch",
  "contactId": "contact-uuid"
}
```

#### Get All Transactions for a Contact
```
GET /transactions/contact/:contactId
Headers: Authorization: Bearer {token}
```

#### Get Transaction Summary for a Contact
```
GET /transactions/contact/:contactId/summary
Headers: Authorization: Bearer {token}
Response: {
  "success": true,
  "message": "message.TRANSACTION.SUMMARY_RETRIEVED",
  "data": {
    "totalCredit": 100000,    // Total they owe you
    "totalDebit": 50000,      // Total you owe them
    "balance": 50000,         // Net balance
    "totalTransactions": 15
  }
}
```

#### Get Total Summary for Current User (All Contacts)
```
GET /transactions/summary
Headers: Authorization: Bearer {token}
```

#### Get Transaction By ID
```
GET /transactions/:id/contact/:contactId
Headers: Authorization: Bearer {token}
```

#### Update Transaction
```
PATCH /transactions/:id/contact/:contactId
Headers: Authorization: Bearer {token}
Body: {
  "amount": 60000,
  "description": "Updated description"
}
```

#### Delete Transaction
```
DELETE /transactions/:id/contact/:contactId
Headers: Authorization: Bearer {token}
```

## Security Features

1. **JWT Authentication**: All endpoints (except user creation) require authentication
2. **Ownership Verification**: 
   - Users can only access their own contacts
   - Users can only access transactions for their contacts
3. **Password Hashing**: User passwords are hashed using bcrypt
4. **Cascade Deletion**: 
   - Deleting a user deletes all their contacts and transactions
   - Deleting a contact deletes all its transactions

## Understanding Balance Calculations

### Transaction Types (نوع معامله)

- **CREDIT (بستانکار)**: When someone owes YOU money
  - Example: You lent 1000 to Ahmad → Create CREDIT transaction
  
- **DEBIT (بدهکار)**: When YOU owe someone money
  - Example: You borrowed 500 from Ahmad → Create DEBIT transaction

### Balance Formula
```
Balance = Total CREDIT - Total DEBIT
```

- **Positive Balance**: They owe you money
- **Negative Balance**: You owe them money
- **Zero Balance**: All settled

### Example Scenario

Ahmad's Transactions:
1. CREDIT: 10000 (Ahmad owes you)
2. CREDIT: 5000 (Ahmad owes you more)
3. DEBIT: 3000 (You owe Ahmad)

Balance = (10000 + 5000) - 3000 = 12000
Result: Ahmad owes you 12,000

## File Structure

```
src/
├── modules/
│   ├── user/
│   │   ├── entities/
│   │   │   ├── user.entity.ts
│   │   │   └── user-profile.entity.ts
│   │   ├── dto/
│   │   │   ├── requests/
│   │   │   │   ├── create-user.dto.ts
│   │   │   │   └── update-user.dto.ts
│   │   │   └── responses/
│   │   │       └── user-response.dto.ts
│   │   ├── repositories/
│   │   │   └── user.repository.ts
│   │   ├── services/
│   │   │   └── user.service.ts
│   │   ├── controllers/
│   │   │   └── user.controller.ts
│   │   └── user.module.ts
│   │
│   ├── contact/
│   │   ├── entities/
│   │   │   └── contact.entity.ts
│   │   ├── dto/
│   │   │   ├── requests/
│   │   │   │   ├── create-contact.dto.ts
│   │   │   │   └── update-contact.dto.ts
│   │   │   └── responses/
│   │   │       ├── contact-response.dto.ts
│   │   │       └── contact-with-balance.dto.ts
│   │   ├── repositories/
│   │   │   └── contact.repository.ts
│   │   ├── services/
│   │   │   └── contact.service.ts
│   │   ├── controllers/
│   │   │   └── contact.controller.ts
│   │   └── contact.module.ts
│   │
│   └── transaction/
│       ├── entities/
│       │   └── transaction.entity.ts
│       ├── enums/
│       │   └── transaction-type.enum.ts
│       ├── dto/
│       │   ├── requests/
│       │   │   ├── create-transaction.dto.ts
│       │   │   └── update-transaction.dto.ts
│       │   └── responses/
│       │       ├── transaction-response.dto.ts
│       │       └── transaction-summary.dto.ts
│       ├── repositories/
│       │   └── transaction.repository.ts
│       ├── services/
│       │   └── transaction.service.ts
│       ├── controllers/
│       │   └── transaction.controller.ts
│       └── transaction.module.ts
│
├── i18n/
│   ├── en/
│   │   └── message.json
│   └── ar/
│       └── message.json
│
└── database/
    └── migration/
        └── 1765189342874-CreateAccountingTables.ts
```

## Installation & Setup

### 1. Environment Variables

Create a `.env` file:

```env
# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_DB=daftarmoein_db

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRATION=7d

# Server
PORT=3000
NODE_ENV=local
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Migrations

```bash
npm run typeorm migration:run
```

### 4. Start the Application

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## Testing the API

### 1. Create a User
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "ahmad",
    "phoneNumber": "+989123456789",
    "fullName": "Ahmad Rezaei",
    "password": "StrongPass123!"
  }'
```

### 2. Login (get token from auth endpoint)

### 3. Create a Contact
```bash
curl -X POST http://localhost:3000/contacts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mohammad",
    "phoneNumber": "+989121234567"
  }'
```

### 4. Create a Transaction
```bash
curl -X POST http://localhost:3000/transactions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50000,
    "date": "2024-01-15",
    "type": "CREDIT",
    "description": "Borrowed money",
    "contactId": "CONTACT_UUID"
  }'
```

### 5. View Summary
```bash
curl -X GET http://localhost:3000/transactions/summary \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Internationalization (i18n)

The application supports both English and Arabic messages:

- English: `src/i18n/en/message.json`
- Arabic: `src/i18n/ar/message.json`

All success and error messages are internationalized and can be controlled via the `Accept-Language` header.

## Architecture Patterns

1. **Repository Pattern**: Data access layer abstraction
2. **Service Layer**: Business logic implementation
3. **DTO Pattern**: Data transfer objects for validation
4. **Guard Pattern**: Authentication and authorization
5. **Decorator Pattern**: Custom parameter decorators for user context

## Key Design Decisions

1. **Contact Names Not Unique**: Multiple contacts can have the same name (real-world scenario)
2. **Cascade Deletion**: Deleting parent entities automatically removes children
3. **Balance Calculation**: Done at query time for accuracy
4. **Transaction Types**: Clear DEBIT/CREDIT terminology matching Persian accounting
5. **Ownership Verification**: Automatic security checks in service layer

## Future Enhancements

Potential features to add:
- Transaction categories
- File attachments for transactions
- Recurring transactions
- Multi-currency support
- Reports and analytics
- Export to PDF/Excel
- Search and filtering
- Notifications for due payments

## License

MIT

