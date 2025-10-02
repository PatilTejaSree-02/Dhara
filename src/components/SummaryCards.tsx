import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, AlertTriangle, Calendar } from "lucide-react";

interface SummaryCardsProps {
  totalFiles: number;
  systemAlerts: number;
  pendingAppointments: number;
}

const SummaryCards = ({ totalFiles, systemAlerts, pendingAppointments }: SummaryCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="shadow-lg border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Files</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{totalFiles}</div>
          <p className="text-xs text-muted-foreground">Migrant records linked</p>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">System Alerts</CardTitle>
          <AlertTriangle className="h-4 w-4 text-warning-amber" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-warning-amber">{systemAlerts}</div>
          <p className="text-xs text-muted-foreground">Active flagged cases</p>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Appointments</CardTitle>
          <Calendar className="h-4 w-4 text-medical-green" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-medical-green">{pendingAppointments}</div>
          <p className="text-xs text-muted-foreground">Scheduled visits</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;