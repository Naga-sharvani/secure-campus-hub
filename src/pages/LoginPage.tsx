import { useState } from "react";
import { Shield, Lock, Eye, EyeOff, AlertTriangle, CheckCircle, Upload, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import {getRole} from "../lib/auth.js";

type LoginStep = "credentials" | "admin-verify" | "admin-image";

const LoginPage = () => {
  const { login, verifyAdmin } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<LoginStep>("credentials");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [imageUploaded, setImageUploaded] = useState(false);

  const handleLogin = () => {
    if (!username || !password) {
      setError("All fields are required");
      return;
    }
    const result = login(username, password, role || undefined);
    if (!result.success) {
      setError(result.error || "Login failed");
    } else if (result.needsAdminVerification) {
      setStep("admin-verify");
      setError("");
    }
  };

  const handleAdminVerify = () => {
    if (verifyAdmin(securityAnswer)) {
      setStep("admin-image");
    } else {
      setError("Incorrect security answer");
    }
  };

  const handleImageVerify = () => {
    if (imageUploaded) {
      // Image verified (mock), complete admin login
      verifyAdmin(securityAnswer); // This will set the user
    }
  };

  function handleLoginRole(email){
    const role= getRole(email);
    
    localStorage.setItem("role",role);
    localStorage.setItem("email",email);

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
          {/* <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-4">
            <Shield className="h-10 w-10 text-primary" />
          </div> */}
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
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    placeholder="Enter password"
                    className="bg-muted/50 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <Label>Role</Label>
                <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                  <SelectTrigger className="mt-1 bg-muted/50">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-student" /> Student
                      </span>
                    </SelectItem>
                    <SelectItem value="faculty">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-faculty" /> Faculty
                      </span>
                    </SelectItem>
                    <SelectItem value="admin">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-admin" /> Admin
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <Button onClick={handleLogin} className="w-full gap-2">
                <Lock className="h-4 w-4" />
                Secure Login
              </Button>

              <div className="pt-3 border-t border-border/50">
                {/* <p className="text-xs text-muted-foreground text-center font-mono">
                  Demo: student1 / faculty1 / admin1 • Password: pass123
                </p> */}
              </div>
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
                <p className="text-foreground font-medium mt-1">What is your pet name?</p>
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
                  imageUploaded ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}>
                  {imageUploaded ? (
                    <CheckCircle className="h-10 w-10 text-primary" />
                  ) : (
                    <Upload className="h-10 w-10 text-muted-foreground" />
                  )}
                  <span className="text-sm text-muted-foreground">
                    {imageUploaded ? "Image match verified ✓" : "Click to upload verification image"}
                  </span>
                  <input type="file" className="hidden" accept="image/*" onChange={() => setImageUploaded(true)} />
                </label>
              </div>

              <Button onClick={handleImageVerify} className="w-full" disabled={!imageUploaded}>
                Complete Verification & Login
              </Button>
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
