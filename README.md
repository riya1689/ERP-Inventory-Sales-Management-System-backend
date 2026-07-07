# ERP-Inventory & Sales Management System - Backend

This is the backend server for the **ERP - Inventory & Sales Management System**. Built with a strong modular architecture, it handles role-based authorization, inventory calculations, image uploads in cloudinary, and deep database aggregation for the dashboard.

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **File Uploads:** Multer & Cloudinary
- **Security:** Helmet, CORS, bcrypt

##  Project Structure
```
backend/
├── src/
│   ├── config/           # Database and environment configurations
│   ├── middlewares/      # Auth, Role guards, Error handling, Multer
│   ├── modules/          # Feature-based modular logic (Vertical slicing)
│   │   ├── category/     # Category CRUD & model
│   │   ├── customer/     # Customer tracking logic
│   │   ├── dashboard/    # Aggregations & statistics
│   │   ├── product/      # Inventory CRUD, upload logic
│   │   ├── sale/         # POS transaction handling
│   │   └── user/         # Authentication & seeders
│   ├── utils/            # Global AppError, helpers
│   └── server.ts         # Application entry point
├── seedAll.ts            # Realistic data seeder script
├── Dockerfile            # Container configuration
└── tsconfig.json         # TypeScript configurations
```

##  Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file in the root of the `backend` folder:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_cluster_url
   JWT_SECRET=super_secret_jwt_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```

4. **Seed Database:**
   ```bash
   npx ts-node seedAll.ts
   ```
   *Default Admin Creds: admin@erp.com / password123*

##  Docker Setup (Optional)
To run this backend individually via Docker:
```bash
docker build -t erp-backend .
docker run -p 5000:5000 erp-backend
```

##  API Documentation

### Authentication (`/api/users`)
- `POST /login` - Login to get JWT Token.

### Products (`/api/products`)
- `GET /` - Fetch all products (Supports `?searchTerm=...`, `?page=...`, `?category=...`). [Roles: All]
- `GET /:id` - Get single product details. [Roles: All]
- `POST /` - Create a new product. **Requires `multipart/form-data` with `image` file.** [Roles: Admin, Manager]
- `PATCH /:id` - Update existing product. **Can include new `image` file.** [Roles: Admin, Manager]
- `DELETE /:id` - Delete product. [Roles: Admin, Manager]

### Categories (`/api/categories`)
- `GET /` - Fetch all categories. [Roles: All]
- `POST /` - Add category. [Roles: Admin]
- `PUT /:id` - Update category name (cascades to products). [Roles: Admin]
- `DELETE /:id` - Delete category. [Roles: Admin]

### Sales (`/api/sales`)
- `GET /` - Fetch sale history with pagination and search. [Roles: All]
- `POST /` - Create a new sale. Decrements stock and links to a customer. [Roles: Admin, Manager, Employee]

### Dashboard (`/api/dashboard`)
- `GET /` - Fetch aggregated metrics (Total Revenue, Total Products, Total Categories, Low Stock alerts, Recent Sales, 8-day graph data). [Roles: All]

### Customers (`/api/customers`)
- `GET /` - Fetch customer list. [Roles: Admin]
