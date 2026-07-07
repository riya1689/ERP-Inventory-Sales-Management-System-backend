##  API Endpoints Specification

###  Authentication Module

### 1. User Login

**Access:** Public  
**Endpoint:** `POST /api/users/login`

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Success Response (200 OK)**
```json
{
  "status": "success",
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "_id": "60d0fe4f5311236168a109ca",
      "name": "Admin User",
      "email": "user@example.com",
      "role": "Admin"
    }
  }
}
```

---

###  Products Module

### 2. Get All Products

**Access:** Authenticated Users (`Admin`, `Manager`, `Employee`)  
**Endpoint:** `GET /api/products`

**Success Response (200 OK)**
```json
{
  "status": "success",
  "results": 1,
  "data": {
    "products": [
      {
        "_id": "60d0fe4f5311236168a109cc",
        "name": "Wireless Mouse",
        "price": 25.99,
        "stock": 100,
        "category": {
          "_id": "60d0fe4f5311236168a109cd",
          "name": "Electronics"
        },
        "image": "https://res.cloudinary.com/.../image.jpg",
        "stockStatus": "In Stock"
      }
    ]
  }
}
```

---

### 3. Create Product

**Access:** Admin, Manager  
**Endpoint:** `POST /api/products`

**Request Format:** `multipart/form-data`

**Form Fields:**
- `name`: String
- `price`: Number
- `stock`: Number
- `category`: String (Category ID)
- `image`: File (Upload)

**Success Response (201 Created)**
```json
{
  "status": "success",
  "message": "Product created successfully",
  "data": {
    "product": {
      "_id": "60d0fe4f5311236168a109cc",
      "name": "Wireless Mouse",
      "price": 25.99,
      "stock": 100,
      "category": "60d0fe4f5311236168a109cd",
      "image": "https://res.cloudinary.com/.../image.jpg"
    }
  }
}
```

---

### 4. Update Product

**Access:** Admin, Manager  
**Endpoint:** `PATCH /api/products/:id`

**Request Format:** `multipart/form-data` (or JSON if no image)

**Success Response (200 OK)**
*(Returns the updated product object)*

---

### 5. Delete Product

**Access:** Admin, Manager  
**Endpoint:** `DELETE /api/products/:id`

**Success Response (200 OK)**
```json
{
  "status": "success",
  "message": "Product deleted successfully"
}
```

---

###  Categories Module

### 6. Get All Categories

**Access:** Authenticated Users  
**Endpoint:** `GET /api/categories`

**Success Response (200 OK)**
```json
{
  "status": "success",
  "results": 1,
  "data": {
    "categories": [
      {
        "_id": "60d0fe4f5311236168a109cd",
        "name": "Electronics",
        "createdAt": "2026-06-20T10:30:00Z"
      }
    ]
  }
}
```

---

### 7. Create Category

**Access:** Admin Only  
**Endpoint:** `POST /api/categories`

**Request Body**
```json
{
  "name": "Accessories"
}
```

**Success Response (201 Created)**
```json
{
  "status": "success",
  "message": "Category created successfully",
  "data": {
    "category": {
      "_id": "60d0fe4f5311236168a109ce",
      "name": "Accessories"
    }
  }
}
```

---

### 8. Update Category

**Access:** Admin Only  
**Endpoint:** `PUT /api/categories/:id`

**Request Body**
```json
{
  "name": "PC Accessories"
}
```

**Success Response (200 OK)**
*(Returns the updated category object)*

---

### 9. Delete Category

**Access:** Admin Only  
**Endpoint:** `DELETE /api/categories/:id`

**Success Response (200 OK)**
```json
{
  "status": "success",
  "message": "Category deleted successfully"
}
```

---

###  Sales & Customers Module

### 10. Create Sale

**Access:** Authenticated Users (`Admin`, `Manager`, `Employee`)  
**Endpoint:** `POST /api/sales`

**Request Body**
```json
{
  "customerName": "Alice Smith",
  "customerPhone": "1234567890",
  "items": [
    {
      "product": "60d0fe4f5311236168a109cc",
      "quantity": 2,
      "price": 25.99
    }
  ],
  "totalAmount": 51.98,
  "paymentMethod": "Cash",
  "discount": 0
}
```

**Success Response (201 Created)**
```json
{
  "status": "success",
  "message": "Sale completed successfully",
  "data": {
    "sale": {
      "_id": "60d0fe4f5311236168a109cf",
      "invoiceNumber": "INV-1718876400000",
      "customer": "60d0fe4f5311236168a109d0",
      "totalAmount": 51.98,
      "createdAt": "2026-06-20T15:30:00Z"
    }
  }
}
```
>  **Hint:** Creating a sale will automatically decrement the stock of the purchased products in the database.

---

### 11. Get Sales History

**Access:** Authenticated Users  
**Endpoint:** `GET /api/sales`

**Success Response (200 OK)**
*(Returns a paginated array of past sales, including customer and product details).*

---

### 12. Get All Customers

**Access:** Admin Only  
**Endpoint:** `GET /api/customers`

**Success Response (200 OK)**
```json
{
  "status": "success",
  "data": {
    "customers": [
      {
        "_id": "60d0fe4f5311236168a109d0",
        "name": "Alice Smith",
        "phone": "1234567890",
        "totalPurchases": 51.98
      }
    ]
  }
}
```

---

###  Dashboard Module

### 13. Get Dashboard Stats

**Access:** Authenticated Users  
**Endpoint:** `GET /api/dashboard`

**Success Response (200 OK)**
```json
{
  "status": "success",
  "data": {
    "totalRevenue": 15420.50,
    "totalSales": 125,
    "totalProducts": 45,
    "totalCategories": 8,
    "lowStockCount": 3,
    "recentSales": [...],
    "revenueData": [...]
  }
}
```

---

##  Common Response Patterns

**Standard Success Response Structure**
```json
{
  "status": "success",
  "message": "Operation description",
  "data": "Response data"
}
```

**Standard Error Response Structure**
```json
{
  "status": "error",
  "message": "Error description"
}
```

**HTTP Status Codes**

| Code | Reason Phrase | Usage |
| --- | --- | --- |
| `200` | OK | Successful GET, PATCH, PUT, DELETE |
| `201` | Created | Successful POST (resource created) |
| `400` | Bad Request | Validation errors, invalid input, missing file |
| `401` | Unauthorized | Missing, expired, or invalid JWT token |
| `403` | Forbidden | Valid token but insufficient role/permissions |
| `404` | Not Found | Requested resource does not exist |
| `500` | Internal Server Error | Unexpected server or database error |
