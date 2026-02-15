//isFirstLogin thisesa if want add again

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import {getRole} from "../lib/auth.js";
import { set } from "date-fns";

export type UserRole = "student" | "faculty" | "admin";

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
  rollNumber?: string;
  department?: string;
  // isFirstLogin: boolean;
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
  confirmLogout:(answer:string) =>boolean;
  verifyAdmin: (answer: string) => boolean;
  verifySensitiveAction: (answer: string) => boolean;
  saveSecuritySetup: (setup: SecuritySetup) => void;
  securitySetup: SecuritySetup | null;
  pendingLogout: boolean;
  setPendingLogout: (v: boolean) => void;
 
}

const AuthContext = createContext<AuthContextType | null>(null);


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [securitySetup, setSecuritySetup] = useState<SecuritySetup | null>(null);
  const [knownUsers, setKnownUsers] = useState<Set<string>>(new Set());
  const [pendingLogout, setPendingLogout] = useState(false);
  const [pendingUser,setPendingUser] =useState<User |null>(null);

  useEffect(()=>{
    const stored=localStorage.getItem("securitySetup");
    if(stored){
      setSecuritySetup(JSON.parse(stored));

    }
  },[]);

  useEffect(()=>{
    if(securitySetup){
      localStorage.setItem("securitySetup",JSON.stringify(securitySetup));
    }
  });

 

  const login = useCallback((username: string, password: string)=> {
    const normalisedName= username.toLowerCase().trim();
    const role= getRole(normalisedName);

    if(!role){
      return {success:false, error:"Invalid user"};
    }

    if(password!=="pass123"){
      return { success: false, error: "Invalid password or username" };
    }
    const name=normalisedName.split("@")[0];

    const record: User={
      id: crypto.randomUUID(),
      username: normalisedName,
      role,
      name,
      rollNumber : role==="student"? "!60124733087": undefined,
      department: role==="admin"? "Administrator":"Computer Science"
    }
    
     if (role === "admin" && securitySetup) {
      setPendingUser(record);
      return { success: true, needsAdminVerification: true };
    }

    
    setUser(record);
    return { success: true };
  }, [knownUsers, securitySetup]);

  const verifyAdmin = useCallback((answer: string) => {
    if (!securitySetup || !pendingUser) return false;
    if (answer.toLowerCase().trim() === securitySetup.securityAnswer.toLowerCase().trim()) {
      
      setUser(pendingUser);
      setPendingUser(null);
      return true;
    }
    return false;
  }, [securitySetup,pendingUser]);


  const verifySensitiveAction = useCallback((answer: string) => {
    if (!securitySetup) return true;
    return answer.toLowerCase().trim() === securitySetup.securityAnswer.toLowerCase().trim();
  }, [securitySetup]);

  const saveSecuritySetup = useCallback((setup: SecuritySetup) => {
    setSecuritySetup(setup);
  }, []);

  const confirmLogout=useCallback((answer:string)=>{
    if (answer.toLowerCase().trim() === securitySetup?.securityAnswer.toLowerCase().trim()) {
      setUser(null);
      setPendingLogout(false);
      return true;
    }
    return false;
  },[securitySetup]);

  const logout = useCallback(() => {
    // setUser(null);
    setPendingLogout(true);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout,confirmLogout, verifyAdmin, verifySensitiveAction, saveSecuritySetup, securitySetup, pendingLogout, setPendingLogout}}>
      {children}
    </AuthContext.Provider>
  );

}
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

