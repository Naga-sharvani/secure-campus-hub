import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoginPage from "@/pages/LoginPage";
import StudentDashboard from "@/pages/StudentDashboard";
import FacultyDashboard from "@/pages/FacultyDashboard";
import AdminDashboard from "@/pages/AdminDashboard";

const queryClient = new QueryClient();

function AppContent() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <LoginPage />;
  }

  switch (user.role) {
    case "student":
      return <StudentDashboard />;
    case "faculty":
      return <FacultyDashboard />;
    case "admin":
      return <AdminDashboard />;
    default:
      return <LoginPage />;
  }
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
