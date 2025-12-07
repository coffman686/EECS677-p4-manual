import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { logout } = useAuth();

  return (
    <button onClick={logout}>Logout</button>
    
  );
}

export default Dashboard;