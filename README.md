# 🐾 Pet Shelter Pro - Full Stack Application

A comprehensive pet adoption management system built with the MERN stack (MongoDB, Express, React, Node.js) featuring user authentication, pet management, application tracking, and email notifications.



## 🌟 Project Overview

Pet Shelter Pro is a full-stack web application designed to streamline the pet adoption process. It connects potential pet adopters with available pets while providing administrators with powerful tools to manage the adoption workflow.

### Key Highlights

- **Multi-User Application System**: Multiple users can apply for the same pet until an admin approves one application
- **Email Notifications**: Automated emails for password resets and application status updates
- **Role-Based Access Control**: Separate interfaces and permissions for users and administrators
- **Real-Time Updates**: Toast notifications for all user actions
- **Image Management**: Cloudinary integration for pet image uploads
- **Interactive API Documentation**: Swagger UI for complete API reference
- **Modern UI/UX**: Responsive design with Tailwind CSS and smooth animations

## 🛠️ Technology Stack

### Frontend
- **React 19** - Latest React with improved performance
- **TypeScript** - Type-safe development
- **Redux Toolkit** - Efficient state management
- **React Router v7** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **react-hot-toast** - Beautiful notifications
- **Lucide React** - Modern icon library
- **Vite** - Lightning-fast build tool

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Secure authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email service
- **Cloudinary** - Image hosting
- **Swagger** - API documentation


## ✨ Features

### For Users
- ✅ Register and login
- ✅ Browse available pets with detailed information
- ✅ Submit adoption applications with personalized messages
- ✅ Track application status (Pending/Approved/Rejected)
- ✅ View approval/rejection details including admin reviewer
- ✅ Password reset via email
- ✅ Responsive design for all devices

### For Administrators
- ✅ Comprehensive dashboard with statistics
- ✅ Manage pets (Create, Read, Update, Delete)
- ✅ Image upload with Cloudinary integration
- ✅ View all applications across all pets
- ✅ Approve/reject applications 
- ✅ Automatic email notifications to applicants
- ✅ Track which admin reviewed each application


### Technical Features
- ✅ JWT-based authentication with automatic token refresh
- ✅ Protected routes with role-based access control
- ✅ RESTful API with comprehensive Swagger documentation
- ✅ Toast notifications for all user actions
- ✅ Form validation on both client and server
- ✅ Error handling with meaningful messages
- ✅ Professional HTML email templates
- ✅ Secure password reset with time-limited tokens
- ✅ MongoDB schema with proper relationships

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account
- Gmail account (for email service)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AkshayPanchivala/pet-shelter-pro.git
   cd pet-shelter-pro
   ```

2. **Set up Backend**
   ```bash
   cd backend
   npm install

   # Create .env file
   cp .env.example .env
   # Edit .env with your configuration

   # Start backend server
   npm run dev
   ```
   Backend runs on `http://localhost:3000`

3. **Set up Frontend**
   ```bash
   cd ../frontend
   npm install

   # Create .env file
   cp .env.example .env
   # Edit .env with your configuration

   # Start frontend server
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

4. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000`
   - API Documentation: `http://localhost:3000/api-docs`

## 📖 Documentation

- **[Backend Documentation](backend/README.md)** - Complete backend setup, API endpoints, and architecture
- **[Frontend Documentation](frontend/README.md)** - Frontend structure, components, and state management
- **[Swagger API Docs](backend/SWAGGER_DOCS.md)** - Interactive API documentation guide

## 🗂️ Project Structure

```
demo/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   └── server.js       # Entry point
│   ├── .env               # Environment variables
│   ├── package.json       # Dependencies
│   └── README.md          # Backend documentation
│
├── frontend/               # Frontend application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── routes/        # Route configuration
│   │   ├── services/      # API services
│   │   ├── store/         # Redux store
│   │   ├── types/         # TypeScript types
│   │   └── App.tsx        # Root component
│   ├── .env              # Environment variables
│   ├── package.json      # Dependencies
│   └── README.md         # Frontend documentation
│
└── README.md             # This file
```

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_MODE_ENV=development || production
```

## 🧪 Testing

### Test Credentials

**Admin Account:**
```
Email: akshaypanchivala@gmail.com
Password: akshaypanchivala@gmail.com
```

**User Account:**
```
Register a new account at /register
```

### API Testing
- **Swagger UI**: `http://localhost:3000/api-docs`
- **Postman**: Import endpoints from Swagger
- **cURL**: Examples provided in backend README

## 📊 Database Schema

### Collections

**Users**
- Authentication and authorization
- Role-based access (user/admin)
- Password reset tokens

**Pets**
- Pet information and images
- Status tracking (Available/Pending/Adopted)

**Applications**
- User adoption applications
- Status tracking (Pending/Approved/Rejected)
- Admin reviewer information

See detailed schemas in [Backend README](backend/README.md)

## 🎯 Core Workflows

### Adoption Application Flow
1. User browses available pets
2. User clicks on a pet to view details
3. User submits application with a message
4. Application appears in admin dashboard
5. Admin reviews and approves/rejects
6. Email sent to applicant
7. Application status updated in user's dashboard

### Pet Management Flow
1. Admin navigates to Pet Management
2. Admin adds new pet with details and image
3. Image uploaded to Cloudinary
4. Pet appears in public listing
5. Admin can edit or delete pets as needed

### Password Reset Flow
1. User clicks "Forgot Password"
2. Enters email address
3. Backend generates secure token
4. Email sent with reset link
5. User clicks link and enters new password
6. Password updated in database

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Role-Based Authorization**: Protected routes and endpoints
- **CORS Protection**: Configured CORS middleware
- **Input Validation**: Client and server-side validation
- **Secure Password Reset**: Time-limited, cryptographic tokens
- **XSS Protection**: Input sanitization
- **MongoDB Injection Prevention**: Mongoose schema validation

## 📧 Email Templates

Professional HTML email templates for:
- Password reset with branded design
- Application approval with next steps
- Application rejection with encouragement

All emails include:
- Pet Shelter Pro branding
- Responsive design
- Clear call-to-action buttons
- Professional formatting

## 🎨 UI/UX Highlights

- **Responsive Design**: Mobile-first approach
- **Color Scheme**: Emerald and teal gradients
- **Animations**: Smooth transitions and hover effects
- **Loading States**: Skeletons and spinners
- **Toast Notifications**: Real-time feedback
- **Custom Dialogs**: Beautiful confirmation modals
- **Accessibility**: Keyboard navigation and ARIA labels

## 📈 Future Enhancements

- [ ] Chat system between users and admins
- [ ] Advanced pet search and filtering
- [ ] Appointment scheduling for pet visits
- [ ] User reviews and ratings
- [ ] Social media integration
- [ ] Multi-language support
- [ ] Progressive Web App (PWA)
- [ ] Payment integration for adoption fees
- [ ] Pet medical history tracking
- [ ] Automated matching algorithm

## 🐛 Known Issues

None currently. Please report issues via GitHub.

## 🤝 Contributing

This is a portfolio/interview project. Feedback and suggestions are welcome!

## 📄 License

This project is created for educational and portfolio purposes.

## 👨‍💻 Author

**Akshay Panchivala**
- Email: akshaypanchivala@gmail.com
- GitHub: [AkshayPanchivala](https://github.com/AkshayPanchivala)
- Repository: [pet-shelter-pro](https://github.com/AkshayPanchivala/pet-shelter-pro)
