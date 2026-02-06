import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type UserRole = "student" | "faculty" | "admin";

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
  rollNumber?: string;
  department?: string;
  isFirstLogin: boolean;
}

export interface SecuritySetup {
  securityQuestion: string;
  securityAnswer: string;
  verificationImageUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string, role?: UserRole) => { success: boolean; error?: string; needsAdminVerification?: boolean };
  logout: () => void;
  verifyAdmin: (answer: string) => boolean;
  verifySensitiveAction: (answer: string) => boolean;
  saveSecuritySetup: (setup: SecuritySetup) => void;
  securitySetup: SecuritySetup | null;
  pendingLogout: boolean;
  setPendingLogout: (v: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USERS: Record<string, { password: string; user: Omit<User, "isFirstLogin"> }> = {
  student1: {
    password: "pass123",
    user: { id: "s1", username: "himavari@stu", role: "student", name: "Himavari", rollNumber: "160124733087", department: "Computer Science" },
  },
  faculty1: {
    password: "pass123",
    user: { id: "f1", username: "bochan@fac", role: "faculty", name: "Bochan", department: "Computer Science" },
  },
  admin1: {
    password: "pass123",
    user: { id: "a1", username: "shinchan@ad", role: "admin", name: "Shinchan", department: "Administration" },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [securitySetup, setSecuritySetup] = useState<SecuritySetup | null>({
    securityQuestion: "What is your pet name?",
    securityAnswer: "jimmy",
  });
  const [knownUsers, setKnownUsers] = useState<Set<string>>(new Set());
  const [pendingLogout, setPendingLogout] = useState(false);

  const login = useCallback((username: string, password: string, role?: UserRole) => {
    const record = MOCK_USERS[username];
    if (!record) return { success: false, error: "User not found" };
    if (record.password !== password) return { success: false, error: "Invalid password" };
    if (role && record.user.role !== role) return { success: false, error: "Role mismatch" };

    const isFirstLogin = !knownUsers.has(username);
    if (isFirstLogin) {
      setKnownUsers((prev) => new Set(prev).add(username));
    }

    if (record.user.role === "admin" && securitySetup) {
      return { success: true, needsAdminVerification: true };
    }

    setUser({ ...record.user, isFirstLogin });
    return { success: true };
  }, [knownUsers, securitySetup]);

  const verifyAdmin = useCallback((answer: string) => {
    if (!securitySetup) return false;
    if (answer.toLowerCase().trim() === securitySetup.securityAnswer.toLowerCase().trim()) {
      const record = MOCK_USERS["admin1"];
      setUser({ ...record.user, isFirstLogin: false });
      return true;
    }
    return false;
  }, [securitySetup]);

  const verifySensitiveAction = useCallback((answer: string) => {
    if (!securitySetup) return true;
    return answer.toLowerCase().trim() === securitySetup.securityAnswer.toLowerCase().trim();
  }, [securitySetup]);

  const saveSecuritySetup = useCallback((setup: SecuritySetup) => {
    setSecuritySetup(setup);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setPendingLogout(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, verifyAdmin, verifySensitiveAction, saveSecuritySetup, securitySetup, pendingLogout, setPendingLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
