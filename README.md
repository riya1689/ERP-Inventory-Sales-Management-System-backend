# Backend - ERP Inventory and Sales Management System

This is the server behind the application. Follow these simple steps to run it on your computer.

## How to Run the Backend

### Step 1: Download the Code
Open your terminal (or Command Prompt) and run the following command to download the code:
```bash
git clone https://github.com/riya1689/ERP-Inventory-Sales-Management-System-backend.git
```

### Step 2: Open the Folder
Go inside the downloaded folder:
```bash
cd ERP-Inventory-Sales-Management-System-backend
```

### Step 3: Install Required Files
Run this command to install all the necessary files for the server to work:
```bash
npm install
```

### Step 4: Add Your Settings
Create a new text file inside the folder and name it `.env`. Open this file and paste the following configuration inside it:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```
Replace the placeholder values with your actual database and image hosting details.

### Step 5: Start the Server
Run this command to turn on the backend server:
```bash
npm run dev
```
The server will now be running and listening for requests from the frontend!

---

## API Documentation
Check out the full API endpoints in the [API Documentation](API_DOCUMENT.md).
