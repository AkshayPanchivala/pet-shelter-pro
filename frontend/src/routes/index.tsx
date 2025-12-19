import { createBrowserRouter } from 'react-router-dom';

// Layout
import Layout from '@components/Layout';

// Original Pages
import Home from '@pages/Home';
import PetDetail from '@pages/PetDetail';
import Login from '@pages/Login';
import Register from '@pages/Register';
import ForgotPassword from '@pages/ForgotPassword';
import ResetPassword from '@pages/ResetPassword';
import Applications from '@pages/Applications';
import AdminDashboard from '@pages/AdminDashboard';
import PetManagement from '@pages/PetManagement';
import NotFound from '@pages/NotFound';

// Original ProtectedRoute component
import ProtectedRoute from '@components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'pets/:id',
        element: <PetDetail />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: 'reset-password/:token',
        element: <ResetPassword />,
      },
      {
        path: 'applications',
        element: (
          <ProtectedRoute requireAuth requireUser>
            <Applications />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute requireAuth requireAdmin>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/pets',
        element: (
          <ProtectedRoute requireAuth requireAdmin>
            <PetManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
