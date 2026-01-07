# Cloud Luxury Beauty API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

Most endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Endpoints

### Auth

#### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CUSTOMER"
  },
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token"
}
```

#### POST /api/auth/login
Login user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Same as register

#### POST /api/auth/refresh
Refresh access token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

**Response:**
```json
{
  "accessToken": "new_jwt_token"
}
```

#### POST /api/auth/logout
Logout user (requires auth).

### Products

#### GET /api/products
Get all products with optional filters.

**Query Parameters:**
- `categoryId` - Filter by category
- `search` - Search in name/description
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `featured` - Filter featured products (true/false)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Response:**
```json
{
  "products": [...],
  "total": 100,
  "page": 1,
  "limit": 20,
  "totalPages": 5
}
```

#### GET /api/products/:id
Get single product by ID.

**Response:**
```json
{
  "id": "uuid",
  "name": "Product Name",
  "description": "Description",
  "price": 29.99,
  "category": {...},
  "variants": [...],
  "images": [...],
  "stock": 100,
  "featured": true
}
```

#### POST /api/products (Admin only)
Create new product.

#### PUT /api/products/:id (Admin only)
Update product.

#### DELETE /api/products/:id (Admin only)
Delete product.

### Categories

#### GET /api/categories
Get all categories.

#### GET /api/categories/:id
Get single category with products.

#### POST /api/categories (Admin only)
Create category.

#### PUT /api/categories/:id (Admin only)
Update category.

#### DELETE /api/categories/:id (Admin only)
Delete category.

### Coupons

#### GET /api/coupons
Get all active coupons (public).

#### GET /api/coupons/:code
Get coupon by code.

#### POST /api/coupons (Admin only)
Create coupon.

#### PUT /api/coupons/:id (Admin only)
Update coupon.

#### DELETE /api/coupons/:id (Admin only)
Delete coupon.

### Orders

#### GET /api/orders (Auth required)
Get user's orders.

#### GET /api/orders/:id (Auth required)
Get single order.

#### POST /api/orders (Auth required)
Create new order.

**Request Body:**
```json
{
  "items": [
    {
      "productId": "uuid",
      "variantId": "uuid",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "City",
    "state": "State",
    "zipCode": "12345",
    "country": "Country"
  },
  "couponCode": "DISCOUNT10"
}
```

**Response:**
```json
{
  "id": "uuid",
  "status": "PENDING",
  "total": 59.98,
  "items": [...],
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### PUT /api/orders/:id/status (Admin only)
Update order status.

### Users

#### GET /api/users/profile (Auth required)
Get current user profile.

#### PUT /api/users/profile (Auth required)
Update user profile.

#### GET /api/users/wishlist (Auth required)
Get user wishlist.

#### POST /api/users/wishlist (Auth required)
Add product to wishlist.

#### DELETE /api/users/wishlist/:productId (Auth required)
Remove product from wishlist.

### Admin

#### GET /api/admin/stats
Get dashboard statistics (Admin only).

#### GET /api/admin/users
Get all users (Admin only).

#### PUT /api/admin/users/:id
Update user (Admin only).

#### DELETE /api/admin/users/:id
Delete user (Admin only).

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "statusCode": 400
}
```

Common status codes:
- 200 - Success
- 201 - Created
- 400 - Bad Request
- 401 - Unauthorized
- 403 - Forbidden
- 404 - Not Found
- 500 - Internal Server Error
