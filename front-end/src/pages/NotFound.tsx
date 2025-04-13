
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileX } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-6 mb-4">
            <FileX className="h-16 w-16 text-red-600" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold">404</h1>
        <h2 className="text-2xl font-semibold mt-2">Page Not Found</h2>
        
        <p className="mt-4 text-muted-foreground">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <div className="mt-8">
          <Button onClick={() => navigate("/")} className="mx-auto">
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
