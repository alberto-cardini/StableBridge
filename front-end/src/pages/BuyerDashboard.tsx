
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { InvoiceList } from "@/components/InvoiceList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const BuyerDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // For unified dashboard, we now check if the user is authenticated
    // and redirect to dashboard if they are
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  }, [isAuthenticated, navigate, user]);

  // This component is now effectively just a redirect
  return null;
};

export default BuyerDashboard;
