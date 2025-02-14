import React, { useState, useEffect } from "react";
import { X, Mail, Lock, User } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "signup"; // Removed "signin"
  onSwitchMode: () => void;
  onSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onSwitchMode, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Added success message

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {``
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null); // Reset success message

    const endpoint = mode === "signup" ? "/signup" : "/login";

    const requestBody: any = {
      username: formData.username.trim(),
      password: formData.password,
    };

    if (mode === "signup") {
      requestBody.name = formData.name.trim();
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const textResponse = await response.text(); // Read raw response

      if (!response.ok) {
        throw new Error(textResponse || `Request failed with status ${response.status}`);
      }

      if (mode === "login") {
        // Store the token and update authentication state
        const token = textResponse.trim();
        // sessionStorage.setItem("token", token);
        localStorage.setItem("token", token);
        console.log("Login successful. Token stored:", token);
        onSuccess(); // Update authentication state (show authenticated navbar)
      } else {
        console.log("Signup successful:", textResponse);
        setSuccessMessage(textResponse); // Show success message for signup
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      setError(error.message || "An unexpected error occurred. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50" onClick={(e) => e.stopPropagation()}>
        <div className="bg-white rounded-2xl shadow-xl p-8 mx-4 mt-[500px]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{mode === "signup" ? "Create Account" : "Login"}</h2>
              <p className="text-sm text-gray-600 mt-1">
                {mode === "signup" ? "Join our community" : "Enter your details to log in"}
              </p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors" aria-label="Close modal">
              <X className="h-6 w-6" />
            </button>
          </div>

          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          {successMessage && <p className="text-green-600 text-sm mb-4">{successMessage}</p>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <div className="relative">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    className="w-full pl-10 pr-3 py-2 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    required={mode === "signup"}
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  className="w-full pl-10 pr-3 py-2 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="your_username"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  className="w-full pl-10 pr-3 py-2 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors mt-6"
            >
              {mode === "signup" ? "Sign Up" : "Login"}
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              {mode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
              <button type="button" onClick={() => { onClose(); setTimeout(onSwitchMode, 100); }} className="font-medium text-blue-600 hover:text-blue-500">
                {mode === "signup" ? "Login" : "Sign Up"}
              </button>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default AuthModal;
