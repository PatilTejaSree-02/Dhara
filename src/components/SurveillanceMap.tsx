import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, TrendingUp, Clock } from "lucide-react";

interface SurveillanceMapProps {
  activeCases: number;
  newEncounters: number;
  district: string;
}

const SurveillanceMap = ({ activeCases, newEncounters, district }: SurveillanceMapProps) => {
  const hotspots = [
    { location: "Kochi Central", cases: 12, severity: "high" },
    { location: "Ernakulam North", cases: 8, severity: "medium" },
    { location: "Kalamassery", cases: 4, severity: "low" },
    { location: "Aluva", cases: 2, severity: "low" }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-destructive text-destructive-foreground";
      case "medium": return "bg-warning-amber text-warning-amber-foreground";
      case "low": return "bg-status-normal text-status-normal-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader>
        <CardTitle>Migrant Health Surveillance - {district}</CardTitle>
        <CardDescription>Disease hotspot monitoring and case tracking</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-destructive/10 rounded-lg">
            <TrendingUp className="h-5 w-5 text-destructive" />
            <div>
              <p className="font-semibold text-destructive">{activeCases}</p>
              <p className="text-xs text-muted-foreground">Active Cases</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-medical-green-light rounded-lg">
            <Clock className="h-5 w-5 text-medical-green" />
            <div>
              <p className="font-semibold text-medical-green">{newEncounters}</p>
              <p className="text-xs text-muted-foreground">New (24 hrs)</p>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="h-64 bg-gradient-to-br from-medical-green-light to-background rounded-lg border relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-2">
              <MapPin className="h-8 w-8 text-medical-green mx-auto" />
              <p className="text-sm font-medium">{district} District Map</p>
              <p className="text-xs text-muted-foreground">Interactive hotspot visualization</p>
            </div>
          </div>
          
          {/* Hotspot Markers */}
          {hotspots.map((spot, index) => (
            <div
              key={spot.location}
              className={`absolute ${getSeverityColor(spot.severity)} rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg`}
              style={{
                left: `${20 + index * 20}%`,
                top: `${30 + index * 15}%`,
              }}
              title={`${spot.location}: ${spot.cases} cases`}
            >
              {spot.cases}
            </div>
          ))}
        </div>

        {/* Hotspot List */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Disease Hotspots</h4>
          {hotspots.map((spot) => (
            <div key={spot.location} className="flex items-center justify-between p-2 bg-muted/50 rounded">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getSeverityColor(spot.severity)}`}></div>
                <span className="text-sm">{spot.location}</span>
              </div>
              <span className="text-sm font-medium">{spot.cases} cases</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SurveillanceMap;