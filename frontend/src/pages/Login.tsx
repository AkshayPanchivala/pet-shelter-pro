import { useState, FormEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { login } from '../store/slices/authSlice';
import { LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? '/admin' : '/');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    return errors;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setValidationError('');
    setFieldErrors({});

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    dispatch(login({ email, password }));
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="flex items-center gap-5 mb-8">
          <LogIn className="h-12 w-12 text-emerald-600" />
          <div className="text-left">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600 ml-1">Sign in to your account</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}

       <div className="mb-6 flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 rounded-lg shadow-sm">
  
  {/* Icon */}
  <div className="flex-shrink-0 p-2 bg-blue-100 rounded-full">
    <LogIn className="h-5 w-5 text-blue-600" />
  </div>

  {/* Content */}
  <div>
    <p className="text-sm font-semibold text-blue-900 mb-1">
      Demo Admin Login Credentials
    </p>

    <div className="text-xs text-blue-800 space-y-1">
      <p>
        <span className="font-medium">Email:</span> akshaypanchivala@gmail.com
      </p>
      <p>
        <span className="font-medium">Password:</span> akshaypanchivala@gmail.com
      </p>
    </div>

    <p className="mt-2 text-[11px] text-blue-600 italic">
      * For demo purposes only
    </p>
  </div>
</div>


        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) {
                  const { email, ...rest } = fieldErrors;
                  setFieldErrors(rest);
                }
              }}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="you@example.com"
            />
            {fieldErrors.email && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) {
                  const { password, ...rest } = fieldErrors;
                  setFieldErrors(rest);
                }
              }}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${fieldErrors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="••••••••"
            />
            {fieldErrors.password && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 text-white py-3 rounded-md hover:bg-emerald-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/forgot-password" className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold">
            Forgot your password?
          </Link>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-emerald-600 hover:text-emerald-700 font-semibold">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
