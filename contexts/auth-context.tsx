"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  AuthResponse,
  getCurrentUser,
  login as apiLogin,
  logout as apiLogout,
  signup as apiSignup,
  SignupData,
  LoginData,
} from "@/lib/api";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginData): Promise<boolean> => {
    try {
      const response = await apiLogin(data);

      if (response.success && response.data) {
        setUser(response.data.user);

        // Store token in localStorage
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }

        toast.success("Welcome back!");
        return true;
      } else {
        toast.error(response.error || "Login failed");
        return false;
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed");
      return false;
    }
  };

  const signup = async (data: SignupData): Promise<boolean> => {
    try {
      const response = await apiSignup(data);

      if (response.success && response.data) {
        setUser(response.data.user);

        // Store token in localStorage
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }

        toast.success("Account created successfully!");
        return true;
      } else {
        toast.error(response.error || "Signup failed");
        return false;
      }
    } catch (error: any) {
      toast.error(error.message || "Signup failed");
      return false;
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
      setUser(null);
      localStorage.removeItem("token");
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local state even if API call fails
      setUser(null);
      localStorage.removeItem("token");
    }
  };

  const refreshUser = async () => {
    try {
      const response = await getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error("Refresh user error:", error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
