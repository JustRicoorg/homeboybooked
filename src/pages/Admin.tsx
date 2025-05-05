
import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Admin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorDetails(null);
    
    try {
      // Only use this during initial setup - will be removed from production
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }
      
      toast({
        title: "Sign-up initiated",
        description: "Check your email to confirm your account",
      });
      
      console.log("Sign up successful:", data);
    } catch (error: any) {
      toast({
        title: "Sign-up failed",
        description: error.message || "Please check your credentials",
        variant: "destructive",
      });
      setErrorDetails(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorDetails(null);
    
    try {
      console.log("Attempting login with:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      console.log("Login successful:", data);
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard",
      });
      
      navigate("/admin/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials",
        variant: "destructive",
      });
      setErrorDetails(error.message);
    } finally {
      setLoading(false);
    }
  };

  // If logged in, redirect to dashboard
  if (session) {
    return <Navigate to="/admin/dashboard" />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Login to access the content management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {errorDetails && (
              <div className="p-3 text-sm bg-red-50 text-red-700 rounded-md">
                Error: {errorDetails}
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
            <div className="text-center text-sm text-gray-500 pt-4">
              <p>First time? Create your account:</p>
              <Button
                type="button"
                variant="outline"
                className="mt-2"
                onClick={handleSignUp}
                disabled={loading}
              >
                Sign Up Admin
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
