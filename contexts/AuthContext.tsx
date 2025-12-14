import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  name: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, name: string, password: string) => Promise<boolean>;
  verifyEmail: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check local storage for persistent session
    const storedUser = localStorage.getItem('thinkmate_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        if (email.includes('@')) {
           const mockUser: User = { email, name: email.split('@')[0], isVerified: true };
           setUser(mockUser);
           localStorage.setItem('thinkmate_user', JSON.stringify(mockUser));
           resolve(true);
        } else {
           resolve(false);
        }
      }, 1000);
    });
  };

  const signup = async (email: string, name: string, password: string) => {
    return new Promise<boolean>((resolve) => {
        setTimeout(() => {
            const newUser: User = { email, name, isVerified: false };
            setUser(newUser);
            resolve(true);
        }, 1000);
    });
  };

  const verifyEmail = () => {
      if (user) {
          const verifiedUser = { ...user, isVerified: true };
          setUser(verifiedUser);
          localStorage.setItem('thinkmate_user', JSON.stringify(verifiedUser));
      }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('thinkmate_user');
  };

  return (
    <AuthContext.Provider value={{ 
        user, 
        isAuthenticated: !!user && user.isVerified,
        login, 
        signup, 
        verifyEmail,
        logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};