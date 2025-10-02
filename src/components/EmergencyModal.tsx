import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, User, Heart, Phone } from "lucide-react";

interface EmergencyModalProps {
  migrantFiles: any[];
}

const EmergencyModal = ({ migrantFiles }: EmergencyModalProps) => {
  const [emergencyId, setEmergencyId] = useState("");
  const [emergencyProfile, setEmergencyProfile] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const handleEmergencySearch = () => {
    const file = migrantFiles.find(f => f.id.toLowerCase().includes(emergencyId.toLowerCase()));
    if (file) {
      // Enhanced profile with emergency data
      setEmergencyProfile({
        ...file,
        bloodType: "O+",
        allergies: "Penicillin, Dust",
        preExistingConditions: ["Hypertension", "Diabetes Type 2"],
        majorDiseases: ["Pneumonia (2023)", "Malaria (2022)"],
        currentMedications: ["Metformin 500mg", "Amlodipine 5mg"],
        emergencyContact: "+91 9876543210"
      });
    } else {
      setEmergencyProfile(null);
    }
  };

  const resetModal = () => {
    setEmergencyId("");
    setEmergencyProfile(null);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) resetModal();
    }}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
          <AlertTriangle className="mr-2 h-4 w-4" />
          Emergency Case
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Emergency Case Access
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter Migrant ATH ID for emergency access"
              value={emergencyId}
              onChange={(e) => setEmergencyId(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleEmergencySearch} variant="destructive">
              Search
            </Button>
          </div>

          {emergencyProfile && (
            <Card className="border-destructive/20 bg-destructive/5">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <User className="h-5 w-5" />
                  Emergency Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Critical Info Row */}
                <div className="grid grid-cols-3 gap-4 p-3 bg-card rounded-lg border">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Patient</p>
                    <p className="font-semibold">{emergencyProfile.name}</p>
                    <p className="text-sm text-muted-foreground">{emergencyProfile.age}Y • Male</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Blood Type</p>
                    <Badge variant="outline" className="text-destructive border-destructive">
                      {emergencyProfile.bloodType}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Emergency Contact</p>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      <span className="text-sm">{emergencyProfile.emergencyContact}</span>
                    </div>
                  </div>
                </div>

                {/* Medical Alerts */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-1 text-warning-amber">
                      <Heart className="h-4 w-4" />
                      Allergies
                    </h4>
                    <p className="text-sm bg-warning-amber/10 p-2 rounded border border-warning-amber/20">
                      {emergencyProfile.allergies}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Current Medications</h4>
                    <div className="space-y-1">
                      {emergencyProfile.currentMedications.map((med: string, index: number) => (
                        <Badge key={index} variant="secondary" className="block w-fit text-xs">
                          {med}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Conditions */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Pre-existing Conditions</h4>
                    <div className="space-y-1">
                      {emergencyProfile.preExistingConditions.map((condition: string, index: number) => (
                        <Badge key={index} variant="outline" className="block w-fit text-xs">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Major Disease History</h4>
                    <div className="space-y-1">
                      {emergencyProfile.majorDiseases.map((disease: string, index: number) => (
                        <p key={index} className="text-sm text-muted-foreground">{disease}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {emergencyId && !emergencyProfile && (
            <Card className="border-muted">
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No migrant found with ID: {emergencyId}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmergencyModal;