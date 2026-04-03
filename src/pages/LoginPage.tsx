import { useState,useEffect } from "react";
import { Shield, Lock, AlertTriangle, CheckCircle, Upload, User,Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import {getRole} from "../lib/auth.js";

type LoginStep = "credentials" | "admin-verify" | "admin-image";

const LoginPage = () => {
  const { login, verifyAdmin,securitySetup} = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const [error, setError] = useState("");
  const [step, setStep] = useState<LoginStep>("credentials");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
  const timer = setTimeout(() => {
    setPageLoading(false);
  }, 800); // adjust duration if needed

  return () => clearTimeout(timer);
}, []);
  
  const handleLogin = () => {
    setLoading(true);
    if (!username || !password) {
      setError("All fields are required");
      return;
    }
    
    const detectedRole=getRole(username);
    if(!detectedRole){
      setError("Invalid username");
      return;
    }

    const result=login(username,password);
    if(!result.success){
      setError(result.error || "Login failed");
      setLoading(false);
      return;
    }

   else if (result.needsAdminVerification) {
  if (securitySetup?.method === "image") {
    setStep("admin-image");
  } else {
    setStep("admin-verify");
  }
  setError("");
  setLoading(false);
}
};

  const handleAdminVerify = () => {
    if (verifyAdmin(securityAnswer)) {
      setStep("admin-image");
    } else {
      setError("Incorrect security answer");
    }
  };

const handleImageVerify = async (file: File) => {
  if (!securitySetup?.imageLabel) return;

  try {
    const formData = new FormData();
    formData.append("image", file);
    setLoading(true);
    const res = await fetch("http://localhost:5000/match", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    console.log("YOLO result:", data);

    if (
      data.objects[0]?.toLowerCase() ===
      securitySetup.imageLabel.toLowerCase()
    ) {
      setLoading(false);
      console.log("Calling verifyAdmin()");
      verifyAdmin("");

    } else {
      setLoading(false);
      console.log("Label mismatch");
      setError("Incorrect object detected");
    }

  } catch (err) {
    console.error(err);
    setError("Verification failed");
  }
};

  function handleLoginRole(email){
    const role= getRole(email);
    
    localStorage.setItem("role",role);
    localStorage.setItem("email",email);
  }

  if (pageLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/../back.jpeg')" }}>
      
      <div className="glass-card p-8 flex flex-col items-center gap-4">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <p className="text-sm text-muted-foreground">
          Loading Please wait...
        </p>
      </div>
    </div>
  );
}

  return (    
    <div
  className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
  style={{ backgroundImage: "url('/../back.jpeg')" }}>

      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8 animate-slide-up">
          
          <h1 className="text-2xl font-bold text-foreground">College ERP Portal</h1>
        </div>

        {/* Login Card */}
        <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          {step === "credentials" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-4 border-b border-border/50">
                <Lock className="h-4 w-4 text-primary" />
                
              </div>

              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(""); }}
                  placeholder="Enter your username"
                  className="mt-1 bg-muted/50"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => {setPassword(e.target.value); setError(""); }}
                    placeholder="Enter password"
                    className="bg-muted/50 pr-10"
                  />                  
                </div>
              </div>

              

              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <Button onClick={handleLogin} disabled={loading} className="w-full gap-2">
              {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Secure Login
                  </>
                )}
              </Button>
            </div>
          )}

          {step === "admin-verify" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-4 border-b border-border/50">
                <Shield className="h-4 w-4 text-admin" />
                <span className="text-sm font-medium text-foreground">Admin Verification — Step 1/2</span>
              </div>

              <div className="p-3 rounded-lg bg-admin/10 border border-admin/20">
                <p className="text-xs text-admin font-medium">ELEVATED ACCESS REQUIRES ADDITIONAL VERIFICATION</p>
              </div>

              <div>
                <Label className="text-muted-foreground text-sm">Security Question</Label>
                <p className="text-foreground font-medium mt-1">{securitySetup?.securityQuestion}</p>
              </div>

              <div>
                <Label htmlFor="sec-answer">Your Answer</Label>
                <Input
                  id="sec-answer"
                  type="password"
                  value={securityAnswer}
                  onChange={(e) => { setSecurityAnswer(e.target.value); setError(""); }}
                  placeholder="Enter answer..."
                  className="mt-1 bg-muted/50"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <Button onClick={handleAdminVerify} className="w-full" disabled={!securityAnswer}>
                Verify Answer
              </Button>

              <button onClick={() => { setStep("credentials"); setError(""); }} className="w-full text-center text-sm text-muted-foreground hover:text-foreground">
                ← Back to login
              </button>
            </div>
          )}

          {step === "admin-image" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-4 border-b border-border/50">
                <Shield className="h-4 w-4 text-admin" />
                <span className="text-sm font-medium text-foreground">Admin Verification — Step 2/2</span>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">Upload your verification image</p>
                <label className={`flex flex-col items-center gap-3 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                  "border-border hover:border-primary/50"
                }`}>
                 
                    <Upload className="h-10 w-10 text-muted-foreground" />
                 
                  <span className="text-sm text-muted-foreground">
                    Click to upload verification image
                  </span>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageVerify(e.target.files?.[0]!)} />
                </label>
              </div>

            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6 font-mono animate-fade-in">
  EVERY ACTION VERIFIED
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
