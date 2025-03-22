import { useState, useEffect } from "react";

interface AuthState {
  isAuthenticated: boolean;
  role: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    role: null
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    console.log("Stored Token:", storedToken);
  
    if (storedToken) {
      try {
        const parsedToken = JSON.parse(storedToken);
        setAuthState({
          isAuthenticated: true,
          role: parsedToken.role || null
        });
      } catch (error) {
        console.error("Error parsing token:", error);
        setAuthState({
          isAuthenticated: false,
          role: null
        });
      }
    } else {
      setAuthState({
        isAuthenticated: false,
        role: null
      });
    }
  }, []); // Runs only once when component mounts
  
  const handleLogin = () => {
    const storedToken = localStorage.getItem("token"); // Ensure latest value
    if (storedToken) {
      try {
        const parsedToken = JSON.parse(storedToken);
        setAuthState({
          isAuthenticated: true,
          role: parsedToken.role || null
        });
      } catch (error) {
        console.error("Error parsing token:", error);
        setAuthState({
          isAuthenticated: false,
          role: null
        });
      }
    } else {
      setAuthState({
        isAuthenticated: false,
        role: null
      });
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthState({
      isAuthenticated: false,
      role: null
    });
  };

  return {
    isAuthenticated: authState.isAuthenticated,
    role: authState.role,
    handleLogin,
    handleLogout,
  };
}