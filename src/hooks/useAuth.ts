import { useState, useEffect } from "react";



export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const logtoken = localStorage.getItem("token");
    console.log("Stored Token:", logtoken);
  
    if (logtoken) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []); // Runs only once when component mounts
  
  const handleLogin = () => {
    const logtoken = localStorage.getItem("token"); // Ensure latest value
    if (logtoken) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  };
  

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    handleLogin,
    handleLogout,
  };
}