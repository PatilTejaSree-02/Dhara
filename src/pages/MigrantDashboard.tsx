import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Map from "@/components/Map";

const MigrantDashboard = () => {
  const [showMap, setShowMap] = useState(false);
  const [location, setLocation] = useState<string | null>(null);
  const [nearestPOC, setNearestPOC] = useState({
    name: "Kochi Medical Center POC",
    address: "Marine Drive, Ernakulam, Kochi",
    distance: "2.3 km",
    phone: "+91 484 123 4567"
  });

  useEffect(() => {
    // Simulate location detection
    setTimeout(() => {
      setLocation("Kochi, Kerala");
    }, 1000);
  }, []);

  const generateQRData = () => {
    const athidiId = localStorage.getItem("rememberedUser") || "ATH123456";
    return `DHAARA_HEALTH_ID:${athidiId}`;
  };

  const handleLogout = () => {
    localStorage.removeItem("rememberedUser");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-medical-green-light p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="py-6">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1 space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Welcome to Dhaara</h1>
              <p className="text-muted-foreground">Your health companion in Kerala</p>
              <Badge variant="secondary" className="bg-medical-green-light text-medical-green">
                Athidi ID: {localStorage.getItem("rememberedUser") || "ATH123456"}
              </Badge>
            </div>
            <div className="ml-4">
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Nearest POC Center */}
        <Card className="shadow-lg border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Nearest POC Center
            </CardTitle>
            <CardDescription>
              {location ? `Based on your location in ${location}` : "Detecting your location..."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-medical-green-light p-4 rounded-lg">
              <h3 className="font-semibold text-medical-green">{nearestPOC.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{nearestPOC.address}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm font-medium text-foreground">{nearestPOC.distance} away</span>
                <span className="text-sm text-muted-foreground">{nearestPOC.phone}</span>
              </div>
            </div>
            <Dialog open={showMap} onOpenChange={setShowMap}>
              <DialogTrigger asChild>
                <Button className="w-full bg-medical-green hover:bg-medical-green/90">
                  Get Directions
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Directions to {nearestPOC.name}</DialogTitle>
                </DialogHeader>
                <Map 
                  pocLocation={{
                    name: nearestPOC.name,
                    address: nearestPOC.address,
                    coordinates: [76.2673, 9.9312]
                  }}
                  userLocation={[76.2600, 9.9250]}
                />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Health Card / QR */}
        <Card className="shadow-lg border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Digital Health Card
            </CardTitle>
            <CardDescription>
              Show this QR code to healthcare providers for instant access
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="bg-white border-2 border-primary/20 rounded-lg p-6 mx-auto w-48 h-48 flex items-center justify-center">
              <div className="text-xs text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-primary to-medical-green rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h10v2H7V7zm0 4h7v2H7v-2zm0 4h10v2H7v-2z"/>
                  </svg>
                </div>
                <p className="text-foreground font-mono text-xs">{generateQRData()}</p>
              </div>
            </div>
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">
                📱 You'll receive SMS alerts for appointments and health updates
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card className="shadow-lg border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-destructive rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-destructive">Emergency Hotline</h3>
                <p className="text-sm text-muted-foreground">Call 108 for immediate medical assistance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MigrantDashboard;