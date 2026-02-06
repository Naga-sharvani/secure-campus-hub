import { useState } from "react";
import { Shield, LogOut, User, Menu, X } from "lucide-react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { LogoutModal } from "@/components/LogoutModal";

const ROLE_CONFIG: Record<UserRole, { label: string; colorClass: string; glowClass: string }> = {
  student: { label: "Student", colorClass: "text-student", glowClass: "glow-student" },
  faculty: { label: "Faculty", colorClass: "text-faculty", glowClass: "glow-faculty" },
  admin: { label: "Admin", colorClass: "text-admin", glowClass: "glow-admin" },
};

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [showLogout, setShowLogout] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) return null;
  const config = ROLE_CONFIG[user.role];

  return (
    <div className="min-h-screen bg-background security-grid">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-card rounded-none border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-primary/10">
              
            </div>
            <div className="hidden sm:block">
              <h1 className="font-semibold text-sm text-foreground">ERP Portal</h1>
              <p className="text-xs text-muted-foreground font-mono">CONTINUOUS VERIFICATION</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50">
              <div className={`h-2 w-2 rounded-full animate-pulse-glow ${
                user.role === "student" ? "bg-student" : user.role === "faculty" ? "bg-faculty" : "bg-admin"
              }`} />
              <span className={`text-sm font-medium ${config.colorClass}`}>{config.label}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground hidden md:block">{user.name}</span>
            </div>

            <button
              onClick={() => setShowLogout(true)}
              className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>

      <LogoutModal open={showLogout} onClose={() => setShowLogout(false)} />
    </div>
  );
}
