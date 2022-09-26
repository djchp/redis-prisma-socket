import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Ax from "../utils/Axios";

const AccountContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({isLogged: null});

  const navigate = useNavigate();

  useEffect(() => {
    Ax.get("user")
      .then(function (response) {
        if (response.status > 400) {
          setAuth({isLogged: false});
          return;
        }
        setAuth({...response.data});
        navigate("/home");
        return;
      })
      .catch(function (error) {
        setAuth({isLogged: false});
        console.log(error);
        return;
      });
  }, [navigate]);

  return (
    <AccountContext.Provider value={{ auth, setAuth }}>
      {children}
    </AccountContext.Provider>
  );
};

export { AccountContext, AuthProvider };
