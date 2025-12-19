import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { PawPrint, LogOut, User, Home, FileText, Settings } from 'lucide-react';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const isAdmin = user?.role === 'admin';

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 ml-[-24px]">
              <img
                src="https://res.cloudinary.com/ddhrg2lvw/image/upload/v1766133083/pet-adoption/rhmt07qivfmiyephd5no.png"
                alt="Pet Shelter Pro Logo"
                className="h-40 w-auto object-contain"
              />
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>

            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-emerald-600 text-white hover:bg-emerald-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                {isAdmin ? (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                ) : (
                  <Link
                    to="/applications"
                    className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <FileText className="h-4 w-4" />
                    <span>My Applications</span>
                  </Link>
                )}

                <div className="flex items-center space-x-2 border-l pl-4">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-700">{user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
