// login page

import { useState } from 'react'; // hook to manage component state
import { Link, useNavigate } from 'react-router-dom'; // hook to navigate after sucessful login
//import { useAuth } from '../context/AuthContext'; // TO DO: hook to access auth functions

function Login() {
  const [username, setUsername] = useState(''); // empty username input state
  const [password, setPassword] = useState(''); // empty password input state
  const [error, setError] = useState(''); // initially no error, display error if login fails

  //const { login } = useAuth(); // TO DO: get login function from AuthContext
  const navigate = useNavigate(); // navigate function to redirect after login


  // function to be ran once form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault(); // stop form from reloading page
    setError(''); // reset error state

    try { // try to login
      //await login(username, password); // TO DO: call login function from AuthContext
      navigate('/dashboard'); // if successful, redirect to dashboard

    } catch (err) { // if login fails
      setError(err.message); // display error message
    }
  };

  // now render the login form
  return (
    <div>
      <h1>Login</h1> {/* Page title */}

      {error && <div style={{ color: 'red' }}>{error}</div>} {/* display error message in red */}

      <form onSubmit={handleSubmit}> {/* form submission handler */}
        <div>
          <label htmlFor="username">Username:</label>

          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>

      <p> {/* link to registration page */}
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login; // export the Login component
