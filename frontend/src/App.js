// main App component that sets up routing and context providers

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

// app component
function App() {
  return (
    <AuthProvider> {/* provide authentication context to the app */}
      <Router> {/* set up React Router */}
        <div className="App"> 
          <Routes> {/* define application routes */}

            <Route path="/login" element={<Login />} /> {/* route for login page */}

            <Route path="/register" element={<Register />} /> {/* route for registration page */}

            {/* route for PROTECTED dashboard page */}
            <Route path="/dashboard" element={ 
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            {/* default redirect to dashboard, if no valid token, sends user to /login */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
