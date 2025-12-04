
import { useState } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // import useAuth hook


function Register() { // register page
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // explicit confirm password state

  const [error, setError] = useState('');

  const { register } = useAuth(); // get register function from AuthContext

  const navigate = useNavigate(); // redirect function

  const handleSubmit = async (e) => { // form submission handler
    e.preventDefault(); // prevent page reload
    setError(''); // clear previous errors

    if (password !== confirmPassword) { // check if passwords match
      setError('Passwords do not match');
      return; 
    }

    if (password.length < 8) { // enforce minimum password length
      setError('Password must be at least 8 characters');
      return;
    }

    try { // try to register
      await register(username, password); // call register function from AuthContext

      navigate('/login');
    } catch (err) { // handle registration errors
      setError(err.message);
    }
  };
  // render registration form
  return (
    <div>
      <h1>Register</h1>

      {/* display error message in red */}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* username field */}
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={5}   // min 5 characters
            maxLength={20}  // max 20 characters
          />
        </div>

        {/* password field */}
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>

        {/* confirm password field, to prevent typos in password */}
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Register</button>
      </form>

      {/* link back to login if user already has account */}
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Register;
