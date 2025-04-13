
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { FileText, Building, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Navbar() {
  const { user, logout } = useAuth();

  const getRoleIcon = () => {
    if (user?.role === 'user') return <Building className="h-4 w-4" />;
    if (user?.role === 'admin') return <User className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const getRoleLabel = () => {
    if (user?.role === 'user') return "user";
    if (user?.role === 'admin') return "admin";
    return "User";
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">StableBridge</span>
        </div>
        
        {user && (
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                <span>Logged in as </span>
                <span className="font-medium text-foreground">{user.name}</span>
              </div>
              <Badge variant="outline" className="flex items-center gap-1 ml-2">
                {getRoleIcon()}
                <span>{getRoleLabel()}</span>
              </Badge>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              Log out
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
