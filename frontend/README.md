# Pet Shelter Pro - Frontend

A modern, responsive React application for pet adoption management built with React 19, TypeScript, Redux Toolkit, and Tailwind CSS.

## 🚀 Features

- **User Authentication**
  - User registration and login
  - JWT-based authentication
  - Password reset functionality
  - Protected routes for authenticated users
  - Automatic token persistence

- **Pet Browsing & Adoption**
  - Browse available pets with filtering
  - View detailed pet information
  - Submit adoption applications
  - Track application status
  - Real-time toast notifications

- **User Dashboard**
  - View submitted applications
  - Track application status (Pending/Approved/Rejected)
  - See approval/rejection details
  - Admin reviewer information

- **Admin Panel**
  - Manage all pets (Add/Edit/Delete)
  - View all applications
  - Approve/reject applications with confirmation dialogs
  - Separate loading states for actions
  - Real-time statistics dashboard
  - Cloudinary image upload integration

- **Modern UI/UX**
  - Fully responsive design
  - Beautiful gradient themes
  - Smooth animations and transitions
  - Loading states and skeletons
  - Toast notifications for all actions
  - Custom confirmation dialogs
  - Mobile-friendly navigation

## 🛠️ Technologies Used

- **Framework**: React 19
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Routing**: React Router v7
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Notifications**: react-hot-toast
- **Icons**: Lucide React
- **Image Upload**: Cloudinary (client-side upload)
- **Build Tool**: Vite
- **Code Quality**: ESLint

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see backend README)

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AkshayPanchivala/pet-shelter-pro.git
   cd pet-shelter-pro/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the frontend root directory:
   ```env
   # API Base URL
   VITE_API_BASE_URL=http://localhost:3000/api
  VITE_MODE_ENV=development || production
   ```


## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
Application will run on `http://localhost:5173`

### Build for Production
```bash
npm run build
```


## 📁 Project Structure

```
frontend/
├── public/                    # Static assets
├── src/
│   ├── components/           # Reusable components
│   │   ├── ConfirmDialog.tsx     # Custom confirmation dialog
│   │   ├── CustomSelect.tsx      # Custom select dropdown
│   │   ├── ImageUpload.tsx       # Cloudinary image uploader
│   │   ├── Layout.tsx            # Main layout wrapper
│   │   ├── Navbar.tsx            # Navigation bar
│   │   └── ProtectedRoute.tsx    # Route protection HOC
│   ├── pages/                # Page components
│   │   ├── Home.tsx              # Landing page
│   │   ├── Login.tsx             # Login page
│   │   ├── Register.tsx          # Registration page
│   │   ├── ForgotPassword.tsx    # Password reset request
│   │   ├── ResetPassword.tsx     # Password reset form
│   │   ├── PetList.tsx           # Browse pets
│   │   ├── PetDetail.tsx         # Pet details & apply
│   │   ├── Applications.tsx      # User applications
│   │   ├── AdminDashboard.tsx    # Admin overview
│   │   └── PetManagement.tsx     # Admin pet management
│   ├── routes/               # Route configuration
│   │   └── index.tsx             # Route definitions
│   ├── services/             # API services
│   │   ├── api.ts                # Axios instance
│   │   ├── authService.ts        # Auth API calls
│   │   ├── petService.ts         # Pet API calls
│   │   └── applicationService.ts # Application API calls
│   ├── store/                # Redux store
│   │   ├── index.ts              # Store configuration
│   │   ├── hooks.ts              # Typed Redux hooks
│   │   └── slices/               # Redux slices
│   │       ├── authSlice.ts          # Auth state
│   │       ├── petSlice.ts           # Pet state
│   │       └── applicationSlice.ts   # Application state
│   ├── types/                # TypeScript types
│   │   └── index.ts              # Shared types
│   ├── App.tsx               # Root component
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles
├── .env                      # Environment variables
├── .env.example             # Environment template
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

## 🎨 Key Features Breakdown

### Authentication Flow
1. Users can register with name, email, and password
2. Login returns JWT token stored in localStorage
3. Token automatically included in API requests
4. Protected routes redirect to login if not authenticated
5. Forgot password sends reset email
6. Reset password with token from email

### Pet Adoption Flow
1. Browse all available pets
2. Click on a pet to view details
3. Submit adoption application with a message
4. Track application status in Applications page
5. Receive email notifications on status changes

### Admin Workflow
1. View dashboard with application statistics
2. Manage pets (Add/Edit/Delete with image upload)
3. Review applications with pet and applicant details
4. Approve/reject applications with confirmation
5. Separate loading states for each action
6. Auto-send emails to applicants

## 🔐 Authentication & Authorization

### User Roles
- **User**: Can browse pets, submit applications, view own applications
- **Admin**: All user permissions + manage pets, view all applications, approve/reject

### Protected Routes
```typescript
// User-only routes
/applications - View user's applications

// Admin-only routes
/admin - Admin dashboard
/admin/pets - Pet management
```

### Token Management
- JWT token stored in localStorage
- Automatically included in Axios requests via interceptor
- Token validated on app load
- Logout clears token and Redux state

## 🎯 Redux Store Structure

### Auth Slice
```typescript
{
  user: User | null,
  token: string | null,
  isAuthenticated: boolean,
  isLoading: boolean,
  error: string | null
}
```

### Pet Slice
```typescript
{
  pets: Pet[],
  currentPet: Pet | null,
  isLoading: boolean,
  error: string | null
}
```

### Application Slice
```typescript
{
  applications: Application[],
  userApplications: Application[],
  isLoading: boolean,
  error: string | null
}
```

## 🎨 UI Components

### Custom Components
- **ConfirmDialog**: Beautiful confirmation modals replacing window.confirm
- **CustomSelect**: Styled select dropdown with proper accessibility
- **ImageUpload**: Drag-and-drop image uploader with Cloudinary integration
- **ProtectedRoute**: HOC for route authentication and authorization

### Toast Notifications
All user actions show toast notifications:
- Success: Green background, checkmark icon
- Error: Red background, error icon
- Info: Blue background, info icon

## 📱 Responsive Design

- **Mobile**: Single column layout, hamburger menu
- **Tablet**: 2-column grid for pets
- **Desktop**: 3-column grid, full navigation

Breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

## 🌐 API Integration

### Base Configuration
```typescript
// Axios instance with interceptors
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL
// Automatically includes JWT token in headers
```

### Service Layer
All API calls abstracted in service files:
- `authService.ts`: login, register, forgot/reset password
- `petService.ts`: CRUD operations for pets
- `applicationService.ts`: Application management

### Error Handling
- Network errors caught and displayed via toast
- Validation errors shown inline
- Unauthorized requests redirect to login

## 🎭 State Management Patterns

### Async Thunks
```typescript
// Example: Fetch pets
export const fetchPets = createAsyncThunk(
  'pets/fetchPets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllPets();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

### Loading States
Each slice maintains:
- `isLoading`: Global loading state
- Component-specific loading (e.g., `approvingId`, `rejectingId`)

## 🔧 Development Tools

### Available Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run lint       # Run ESLint
```

### VSCode Extensions (Recommended)
- ESLint
- Tailwind CSS IntelliSense
- TypeScript + JavaScript
- Auto Rename Tag
- ES7+ React/Redux snippets

## 🚀 Deployment

### Build Optimization
```bash
npm run build
```
Outputs to `dist/` directory

### Environment Variables (Production)
Update `.env` with production values:
```env
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_MODE_ENV= production
```


## 🧪 Testing Credentials

### Admin Account
```
Email: akshaypanchivala@gmail.com
Password: akshaypanchivala@gmail.com
```

### Test User
```
Create your own via /register
```

## 📦 Dependencies

### Core
- `react` - UI library
- `react-dom` - React DOM renderer
- `react-router-dom` - Routing
- `@reduxjs/toolkit` - State management
- `react-redux` - React Redux bindings

### Utilities
- `axios` - HTTP client
- `react-hot-toast` - Toast notifications
- `lucide-react` - Icon library

### Development
- `vite` - Build tool
- `typescript` - Type safety
- `tailwindcss` - CSS framework
- `eslint` - Code linting
- `@types/*` - TypeScript type definitions



## 👨‍💻 Author

**Akshay Panchivala**
- Email: akshaypanchivala@gmail.com
