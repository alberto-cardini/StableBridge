
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Building, User } from "lucide-react";
import { toast } from "sonner";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const {
    login
  } = useAuth();

  const validate = () => {
    const newErrors: {
      email?: string;
      password?: string;
    } = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 4) {
      newErrors.password = "Password must be at least 4 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    setIsSubmitting(true);
    try {
      login(email, password);
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoCompanyCredentials = () => {
    setEmail("mark@mock.com");
    setPassword("password");
    toast.info("Demo user credentials filled");
  };

  const fillDemoBuyerCredentials = () => {
    setEmail("alberto@mock.com");
    setPassword("password");
    toast.info("Demo user credentials filled");
  };

  return <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="hello@example.com" value={email} onChange={e => setEmail(e.target.value)} className={errors.email ? "border-red-300" : ""} required />
            {errors.email && <p className="text-red-500 text-xs flex items-center mt-1">
                <AlertCircle size={12} className="mr-1" />
                {errors.email}
              </p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className={errors.password ? "border-red-300" : ""} required />
            {errors.password && <p className="text-red-500 text-xs flex items-center mt-1">
                <AlertCircle size={12} className="mr-1" />
                {errors.password}
              </p>}
          </div>
          
          <div className="pt-2">
            <div className="text-sm text-muted-foreground mb-2">
              For demo purposes:
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button type="button" size="sm" variant="outline" onClick={fillDemoCompanyCredentials} className="flex items-center gap-2 justify-center">
                <Building size={16} />
                <span>Mark</span>
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={fillDemoBuyerCredentials} className="flex items-center gap-2 justify-center">
                <User size={16} />
                <span>Alberto</span>
              </Button>
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </CardFooter>
      </form>
    </Card>;
}
