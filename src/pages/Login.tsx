import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [userId, setUserId] = useState("");
  const [phone, setPhone] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const detectRole = (id: string) => {
    if (id.startsWith("ATH")) return "migrant";
    if (id.startsWith("POC")) return "poc";
    if (id.startsWith("HSP")) return "hospital";
    return null;
  };

  const handleLogin = () => {
    if (!userId.trim()) {
      toast({
        title: "ID Required",
        description: "Please enter your ID to continue",
        variant: "destructive",
      });
      return;
    }

    const role = detectRole(userId.toUpperCase());
    
    if (!role) {
      toast({
        title: "Invalid ID Format",
        description: "Please enter a valid Athidi ID (ATH), POC ID (POC), or Hospital ID (HSP)",
        variant: "destructive",
      });
      return;
    }

    if (rememberMe) {
      localStorage.setItem("rememberedUser", userId);
    }

    toast({
      title: "Login Successful",
      description: `Welcome to Dhaara Health System`,
    });

    navigate(`/${role}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-medical-green-light to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-border/50">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-medical-green rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">Dhaara</CardTitle>
            <CardDescription className="text-muted-foreground">
              Digital Health Record Management System
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="userId" className="text-sm font-medium">
              Enter Your ID
            </Label>
            <Input
              id="userId"
              type="text"
              placeholder="ATH1234 • POC5678 • HSP9012"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="h-12 text-base"
            />
            <p className="text-xs text-muted-foreground">
              Use Athidi ID (ATH), POC ID (POC), or Hospital ID (HSP)
            </p>
          </div>
          {userId.trim().toLowerCase().startsWith("ath") && (
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number (for verification)
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-12 text-base"
              />
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <Label htmlFor="remember" className="text-sm font-medium">
              Remember me
            </Label>
          </div>

          <Button 
            onClick={handleLogin}
            className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-medical-green hover:from-primary/90 hover:to-medical-green/90"
          >
            Access Dashboard
          </Button>

          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Secure healthcare management for Kerala migrants
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;