import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import { router } from './routes';
import { useAppDispatch } from './store/hooks';
import { checkAuth } from './store/slices/authSlice';
import ErrorBoundary from './components/ErrorBoundary';

const AuthChecker = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return null;
};

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AuthChecker />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <RouterProvider router={router} />
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
