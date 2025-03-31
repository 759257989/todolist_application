import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
//page components
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import TasksPage from "./pages/TasksPage";
// wrapper
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

// checks if user is authenticated
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  //render child is authenticated, else return to login page
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/tasks"
            element={<PrivateRoute>{<TasksPage /> }</PrivateRoute>}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
