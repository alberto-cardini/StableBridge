import React, { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  walletAddress?: string;
  role?: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });

      const userData: User = response.data;
      setUser(userData);
      toast.success('Welcome, ${userData.name}!');
      navigate("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Login failed.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const logout = () => {
    setUser(null);
    toast.info("You have been logged out");
    navigate("/");
  };

  return (
      <AuthContext.Provider
          value={{
            user,
            login,
            logout,
            isAuthenticated: user !== null,
          }}
      >
        {children}
      </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}