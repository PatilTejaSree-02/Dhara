import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Droplets, Calendar } from "lucide-react";

interface PatientSidebarProps {
  patient: any;
}

const PatientSidebar = ({ patient }: PatientSidebarProps) => {
  if (!patient) return null;

  return (
    <Card className="h-fit sticky top-4">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="h-5 w-5" />
          Patient Info
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-3">
          <div className="text-center">
            <div className="w-16 h-16 bg-medical-green-light rounded-full flex items-center justify-center mx-auto mb-2">
              <User className="h-8 w-8 text-medical-green" />
            </div>
            <h3 className="font-semibold">{patient.name}</h3>
            <p className="text-sm text-muted-foreground">{patient.id}</p>
          </div>
        </div>

        {/* Demographics */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Demographics</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Age</span>
              <span className="text-sm font-medium">{patient.age} years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Gender</span>
              <span className="text-sm font-medium">{patient.gender || "Male"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Blood Type</span>
              <Badge variant="outline" className="text-xs">
                <Droplets className="h-3 w-3 mr-1" />
                {patient.bloodType || "O+"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Status</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Current Status</span>
              <Badge className={
                patient.status === "red" ? "bg-destructive/10 text-destructive border-destructive/20" :
                patient.status === "amber" ? "bg-warning-amber-light text-warning-amber border-warning-amber/20" :
                "bg-status-normal-light text-status-normal border-status-normal/20"
              }>
                {patient.status.toUpperCase()}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Last Visit</span>
              <div className="flex items-center gap-1 text-sm font-medium">
                <Calendar className="h-3 w-3" />
                {patient.lastVisit}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Vitals */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Latest Vitals</h4>
          <div className="grid grid-cols-1 gap-2">
            <div className="bg-muted/50 p-2 rounded text-center">
              <p className="text-xs text-muted-foreground">Blood Pressure</p>
              <p className="font-medium">{patient.vitals?.bp}</p>
            </div>
            <div className="bg-muted/50 p-2 rounded text-center">
              <p className="text-xs text-muted-foreground">Blood Sugar</p>
              <p className="font-medium">{patient.vitals?.sugar}</p>
            </div>
            <div className="bg-muted/50 p-2 rounded text-center">
              <p className="text-xs text-muted-foreground">Temperature</p>
              <p className="font-medium">{patient.vitals?.temp}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientSidebar;