# Quick Start Guide - Accounting App

## 🚀 Get Started in 5 Minutes

### Step 1: Setup Database

```bash
# Create PostgreSQL database
createdb daftarmoein_db

# Or using psql
psql -U postgres
CREATE DATABASE daftarmoein_db;
\q
```

### Step 2: Configure Environment

Create/update `.env`:

```env
# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=daftarmoein_db

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=7d

# Server
PORT=3000
NODE_ENV=local
```

### Step 3: Run Migration

```bash
npm run typeorm migration:run
```

### Step 4: Start Server

```bash
npm run start:dev
```

Server will start at `http://localhost:3000`

---

## 📋 Test API Flow

### 1️⃣ Create User

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "ahmad",
    "phoneNumber": "+989123456789",
    "fullName": "Ahmad Rezaei",
    "email": "ahmad@example.com",
    "password": "Test123456"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "uuid-here",
    "username": "ahmad",
    "fullName": "Ahmad Rezaei",
    ...
  }
}
```

### 2️⃣ Login (Get Token)

Use your existing auth endpoint to login and get JWT token.

```bash
# Example (adjust to your auth endpoint)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+989123456789",
    "password": "Test123456"
  }'
```

Save the `accessToken` from response.

### 3️⃣ Create a Contact

```bash
export TOKEN="your-jwt-token-here"

curl -X POST http://localhost:3000/contacts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mohammad Ali",
    "phoneNumber": "+989121234567"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Contact created successfully",
  "data": {
    "id": "contact-uuid",
    "name": "Mohammad Ali",
    "phoneNumber": "+989121234567",
    "userId": "your-user-uuid"
  }
}
```

Save the contact `id`.

### 4️⃣ Create Transactions

#### They owe you 50,000 (CREDIT / بستانکار)

```bash
export CONTACT_ID="contact-uuid-from-step-3"

curl -X POST http://localhost:3000/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50000,
    "date": "2024-01-15",
    "type": "CREDIT",
    "description": "Loan given to Mohammad",
    "contactId": "'$CONTACT_ID'"
  }'
```

#### You owe them 20,000 (DEBIT / بدهکار)

```bash
curl -X POST http://localhost:3000/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 20000,
    "date": "2024-01-20",
    "type": "DEBIT",
    "description": "Borrowed from Mohammad",
    "contactId": "'$CONTACT_ID'"
  }'
```

### 5️⃣ View Contact Summary

```bash
curl http://localhost:3000/transactions/contact/$CONTACT_ID/summary \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Transaction summary retrieved successfully",
  "data": {
    "totalCredit": 50000,     // They owe you
    "totalDebit": 20000,      // You owe them
    "balance": 30000,         // Net: They owe you 30,000
    "totalTransactions": 2
  }
}
```

### 6️⃣ View All Contacts with Balances

```bash
curl http://localhost:3000/contacts/with-balance \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Contacts retrieved successfully",
  "data": [
    {
      "id": "contact-uuid",
      "name": "Mohammad Ali",
      "phoneNumber": "+989121234567",
      "balance": 30000,
      "transactionCount": 2,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 7️⃣ View Total Summary (All Contacts)

```bash
curl http://localhost:3000/transactions/summary \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Transaction summary retrieved successfully",
  "data": {
    "totalCredit": 150000,
    "totalDebit": 75000,
    "balance": 75000,        // Total across all your contacts
    "totalTransactions": 8
  }
}
```

---

## 🎯 Understanding Balance

### Transaction Types

| Type | Persian | Meaning | Effect on Balance |
|------|---------|---------|-------------------|
| **CREDIT** | بستانکار | They owe you | **+** (Positive) |
| **DEBIT** | بدهکار | You owe them | **-** (Negative) |

### Balance Calculation

```
Balance = Total CREDIT - Total DEBIT
```

**Examples:**

1. **Positive Balance (+30,000)**
   - Total CREDIT: 50,000 (they owe you)
   - Total DEBIT: 20,000 (you owe them)
   - Balance: +30,000 → They owe you 30,000

2. **Negative Balance (-10,000)**
   - Total CREDIT: 15,000 (they owe you)
   - Total DEBIT: 25,000 (you owe them)
   - Balance: -10,000 → You owe them 10,000

3. **Zero Balance (0)**
   - All settled, no one owes anyone

---

## 📝 Common Operations

### List All Contacts
```bash
curl http://localhost:3000/contacts \
  -H "Authorization: Bearer $TOKEN"
```

### List All Transactions for a Contact
```bash
curl http://localhost:3000/transactions/contact/$CONTACT_ID \
  -H "Authorization: Bearer $TOKEN"
```

### Update a Transaction
```bash
curl -X PATCH http://localhost:3000/transactions/$TRANSACTION_ID/contact/$CONTACT_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 55000,
    "description": "Updated loan amount"
  }'
```

### Delete a Transaction
```bash
curl -X DELETE http://localhost:3000/transactions/$TRANSACTION_ID/contact/$CONTACT_ID \
  -H "Authorization: Bearer $TOKEN"
```

### Update a Contact
```bash
curl -X PATCH http://localhost:3000/contacts/$CONTACT_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mohammad Updated",
    "phoneNumber": "+989129999999"
  }'
```

### Delete a Contact (⚠️ Deletes all transactions too)
```bash
curl -X DELETE http://localhost:3000/contacts/$CONTACT_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔧 Troubleshooting

### Migration Fails
```bash
# Revert migration
npm run typeorm migration:revert

# Run again
npm run typeorm migration:run
```

### Can't Connect to Database
1. Check PostgreSQL is running: `pg_isready`
2. Verify credentials in `.env`
3. Test connection: `psql -U postgres -d daftarmoein_db`

### 401 Unauthorized
- Make sure you're using a valid JWT token
- Token might be expired (check JWT_EXPIRATION in .env)
- Re-login to get a fresh token

### 403 Forbidden
- You're trying to access another user's data
- Each user can only access their own contacts and transactions

---

## 📚 Next Steps

1. **Explore Swagger UI**: Visit `http://localhost:3000/api` for interactive API docs
2. **Read Full Documentation**: Check `ACCOUNTING_APP_DOCUMENTATION.md`
3. **Review Implementation**: See `IMPLEMENTATION_SUMMARY.md`

---

## 🎉 You're Ready!

Your accounting application is now running and ready to use. Create users, add contacts, track transactions, and monitor balances!

**Happy Accounting! 💰📊**

