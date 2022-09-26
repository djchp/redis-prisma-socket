import ToggleColor from "./components/ToggleColor";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Signup from "./components/Login/Signup";
import ProtectedRoutes from "./components/authComponents/ProtectedRoutes";
import { AuthProvider } from "./components/authComponents/AccountContext";
import Home from "./components/pages/Home";



function App() {
  

  return (
    <div>
      <AuthProvider>
        <ToggleColor />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/home" element={<Home>123</Home>} />
          </Route>
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
