import Login from './pages/Login';
import Register from './pages/Register';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Login />
      <Register />
    </BrowserRouter>
  );
}

export default App;
