
import { useEffect } from "react";
import { LoginForm } from "@/components/LoginForm";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // For debugging the white screen issue
    console.log("Index page rendering", { isAuthenticated });
    
    if (isAuthenticated) {
      // Redirect to unified dashboard if already logged in
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl w-full mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <FileText className="h-10 w-10 text-primary" />
              <h1 className="text-3xl font-bold">StableBridge</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Streamline your invoice management process with our secure platform.
            </p>
            <div className="space-y-2 pt-4">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                <p className="text-muted-foreground">Upload and manage invoices</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                <p className="text-muted-foreground">Streamlined approval process</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                <p className="text-muted-foreground">Secure payment confirmation</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <LoginForm />
          </div>
        </div>
      </div>
      
      <footer className="border-t py-4">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground">
            &copy; 2025 Hack The Chain. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
