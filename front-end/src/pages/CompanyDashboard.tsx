
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const CompanyDashboard = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // For unified dashboard, we now check if the user is authenticated
    // and redirect to dashboard if they are
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // This component is now effectively just a redirect
  return null;
};

export default CompanyDashboard;
