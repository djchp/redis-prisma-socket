import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AccountContext } from "./AccountContext";


const ProtectedRoutes = () => {
    const { auth } = useContext(AccountContext);
    
    const authHandler = () => {
      switch (auth.isLogged) {
        default:
          return (
            <div>Loading</div>
          );
        case true:
          return <Outlet />;
        case false:
          return <Navigate to="/" />;
      }
    };
  
    return authHandler(auth);
  };

export default ProtectedRoutes