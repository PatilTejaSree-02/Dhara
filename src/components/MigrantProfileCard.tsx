import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Phone, MapPin, Calendar, FileText } from "lucide-react";

interface MigrantProfileCardProps {
  migrant: any;
  onNewAppointment: () => void;
}

const MigrantProfileCard = ({ migrant, onNewAppointment }: MigrantProfileCardProps) => {
  return (
    <Card className="shadow-lg border-border/50 bg-gradient-to-r from-card to-medical-green-light/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Migrant Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{migrant.name}</h3>
            <div className="space-y-1 text-sm">
              <p className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                <span className="font-medium">Age:</span> {migrant.age} years
              </p>
              <p className="flex items-center gap-2">
                <User className="h-3 w-3" />
                <span className="font-medium">Gender:</span> {migrant.gender}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-3 w-3" />
                <span className="font-medium">Contact:</span> +91 9876543210
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                <span className="font-medium">Address:</span> Camp A, Sector 2
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold">Health Status</h4>
            <Badge className={`${getStatusColor(migrant.status)} w-fit`}>
              {getStatusIcon(migrant.status)} {migrant.status.toUpperCase()}
            </Badge>
            <div className="text-sm space-y-1">
              <p><span className="font-medium">Last Visit:</span> {migrant.lastVisit}</p>
              <p><span className="font-medium">ATH ID:</span> {migrant.id}</p>
            </div>
          </div>
        </div>

        {/* Medical History Summary */}
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Medical History Summary
          </h4>
          <div className="bg-muted/50 p-3 rounded-lg text-sm">
            <p><span className="font-medium">Recent Symptoms:</span> {migrant.symptoms}</p>
            <p><span className="font-medium">Previous Conditions:</span> {migrant.medicalHistory || "None recorded"}</p>
            <p><span className="font-medium">Last Medication:</span> Paracetamol, Cough syrup</p>
            <p><span className="font-medium">Allergies:</span> None known</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t">
          <Button 
            onClick={onNewAppointment}
            className="w-full bg-primary hover:bg-primary/90"
          >
            New Appointment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper functions
const getStatusColor = (status: string) => {
  switch (status) {
    case "normal": return "bg-status-normal-light text-status-normal border-status-normal/20";
    case "amber": return "bg-warning-amber-light text-warning-amber border-warning-amber/20";
    case "red": return "bg-destructive/10 text-destructive border-destructive/20";
    default: return "bg-muted text-muted-foreground";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "normal": return "●";
    case "amber": return "▲";
    case "red": return "🚨";
    default: return "●";
  }
};

export default MigrantProfileCard;