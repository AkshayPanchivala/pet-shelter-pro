# Pet Shelter Pro - Backend API

A comprehensive RESTful API for managing pet adoptions, applications, and user authentication built with Node.js, Express, and MongoDB.

## 🚀 Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (User/Admin)
  - Password reset with email verification
  - Secure password hashing with bcrypt

- **Pet Management**
  - CRUD operations for pets
  - Pet status tracking (Available, Pending, Adopted)
  - Image upload integration with Cloudinary
  - Public access to view pets

- **Adoption Application System**
  - Users can apply for multiple pets
  - Admins can approve/reject applications
  - Email notifications for application status changes
  - Automatic status updates when applications are approved

- **Email Service**
  - Password reset emails with secure tokens
  - Application approval/rejection notifications
  - Professional HTML email templates
  - Powered by Nodemailer

- **API Documentation**
  - Interactive Swagger documentation
  - Try-it-out feature for all endpoints
  - Complete request/response examples

## 🛠️ Technologies Used

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Email Service**: Nodemailer
- **File Upload**: Cloudinary, Multer
- **API Documentation**: Swagger UI, swagger-jsdoc
- **Environment Variables**: dotenv
- **Security**: cors, crypto

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (for image uploads)
- Gmail account (for email service) or any SMTP service

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AkshayPanchivala/pet-shelter-pro.git
   cd pet-shelter-pro/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the backend root directory:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Database
   MONGODB_URI=mongodb://localhost:27017/pet-shelter-pro
   # OR use MongoDB Atlas
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pet-shelter-pro

   # JWT Secret
   JWT_SECRET=your_super_secret_jwt_key_here_change_in_production

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Email Configuration (Gmail)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password

   # Frontend URL (for email links)
   FRONTEND_URL=http://localhost:5173
   ```

4. **Set up Gmail App Password** (if using Gmail)
   - Go to Google Account Settings
   - Enable 2-Step Verification
   - Generate App Password
   - Use the app password in `EMAIL_PASSWORD`

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
Server will run on `http://localhost:3000`

### Production Mode
```bash
npm start
```

## 📚 API Documentation

Once the server is running, access the interactive API documentation at:

```
http://localhost:3000/api-docs
```

The Swagger UI provides:
- Complete API reference
- Interactive testing interface
- Request/response examples
- Authentication support

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password with token

### Pets
- `GET /api/pets` - Get all pets
- `GET /api/pets/:id` - Get pet by ID
- `POST /api/pets` - Create pet (Admin only)
- `PUT /api/pets/:id` - Update pet (Admin only)
- `DELETE /api/pets/:id` - Delete pet (Admin only)

### Applications
- `GET /api/applications` - Get all applications (Admin only)
- `GET /api/applications/my` - Get user's applications (Protected)
- `GET /api/applications/pet/:petId` - Get applications for a pet (Admin only)
- `POST /api/applications` - Submit application (Protected)
- `PATCH /api/applications/:id/status` - Update application status (Admin only)
- `DELETE /api/applications/:id` - Delete application (Protected)

### Upload
- `GET /api/upload/signature` - Get Cloudinary upload signature (Admin only)
- `POST /api/upload/image` - Upload image (Admin only)
- `DELETE /api/upload/image` - Delete image (Admin only)

## 🗂️ Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── cloudinary.js      # Cloudinary configuration
│   │   ├── database.js        # MongoDB connection
│   │   └── swagger.js         # Swagger documentation config
│   ├── controllers/
│   │   ├── authController.js       # Authentication logic
│   │   ├── petController.js        # Pet management logic
│   │   ├── applicationController.js # Application logic
│   │   └── uploadController.js     # File upload logic
│   ├── middleware/
│   │   └── auth.js            # Authentication & authorization
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Pet.js             # Pet schema
│   │   └── Application.js     # Application schema
│   ├── routes/
│   │   ├── authRoutes.js      # Auth endpoints
│   │   ├── petRoutes.js       # Pet endpoints
│   │   ├── applicationRoutes.js # Application endpoints
│   │   └── uploadRoutes.js    # Upload endpoints
│   ├── utils/
│   │   ├── emailService.js    # Email sending utility
│   │   └── jwt.js             # JWT utility functions
│   └── server.js              # Application entry point
├── .env                       # Environment variables
├── .env.example              # Environment variables template
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Role-Based Access Control**: Admin and User roles
- **CORS Protection**: Configured CORS middleware
- **Password Reset Tokens**: Time-limited, cryptographically secure tokens
- **Input Validation**: Server-side validation for all inputs

## 📧 Email Features

The application sends professional HTML emails for:

1. **Password Reset**
   - Secure reset link with 1-hour expiration
   - Professional template with branding

2. **Application Approved**
   - Congratulatory email to approved applicant
   - Next steps information
   - Reviewed by admin name

3. **Application Rejected**
   - Polite rejection notice
   - Link to browse other pets
   - Encouragement to apply again

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['user', 'admin']),
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: Date
}
```

### Pet Model
```javascript
{
  name: String,
  species: String,
  breed: String,
  age: Number,
  description: String,
  image: String (URL),
  status: String (enum: ['Available', 'Pending', 'Adopted']),
  createdAt: Date
}
```

### Application Model
```javascript
{
  userId: ObjectId (ref: User),
  userName: String,
  userEmail: String,
  petId: ObjectId (ref: Pet),
  petName: String,
  message: String,
  status: String (enum: ['Pending', 'Approved', 'Rejected']),
  reviewedBy: ObjectId (ref: User),
  reviewedByName: String,
  createdAt: Date
}
```

## 🧪 Testing the API

### Using Swagger UI
1. Navigate to `http://localhost:3000/api-docs`
2. Click "Authorize" and enter: `Bearer YOUR_JWT_TOKEN`
3. Test any endpoint using the "Try it out" button

### Using Postman/Thunder Client
1. Import the endpoints from Swagger
2. Add Authorization header: `Bearer YOUR_JWT_TOKEN`
3. Make requests

### Example: Register and Login
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

## 📝 Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 3000 |
| `NODE_ENV` | Environment mode | No | development |
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | JWT signing secret | Yes | - |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes | - |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes | - |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes | - |
| `EMAIL_HOST` | SMTP host | Yes | smtp.gmail.com |
| `EMAIL_PORT` | SMTP port | Yes | 587 |
| `EMAIL_USER` | Email address | Yes | - |
| `EMAIL_PASSWORD` | Email password/app password | Yes | - |
| `FRONTEND_URL` | Frontend application URL | Yes | - |

## 🚨 Error Handling

The API uses consistent error responses:

```javascript
{
  "message": "Error description"
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 👥 Default Admin Account

For testing, you can create an admin account by:
1. Registering a normal user
2. Manually updating the role in MongoDB:
   ```javascript
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin" } }
   )
   ```

## 📦 Dependencies

### Production Dependencies
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT implementation
- `bcryptjs` - Password hashing
- `nodemailer` - Email sending
- `cloudinary` - Image hosting
- `multer` - File upload handling
- `cors` - CORS middleware
- `dotenv` - Environment variables
- `swagger-jsdoc` - Swagger documentation
- `swagger-ui-express` - Swagger UI

### Development Dependencies
- `nodemon` - Auto-restart on file changes


## 📄 License

This project is created for educational and portfolio purposes.

## 👨‍💻 Author

**Akshay Panchivala**
- Email: akshaypanchivala@gmail.com



