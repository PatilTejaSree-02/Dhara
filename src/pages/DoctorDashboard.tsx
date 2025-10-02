import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmergencyModal from "@/components/EmergencyModal";
import MigrantProfileCard from "@/components/MigrantProfileCard";
import NewEncounterForm from "@/components/NewEncounterForm";
import { LogOut, Stethoscope } from "lucide-react";

const DoctorDashboard = () => {
  const [searchId, setSearchId] = useState("");
  const [selectedMigrant, setSelectedMigrant] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showEncounterForm, setShowEncounterForm] = useState(false);
  const [migrantRecords] = useState([
    {
      id: "ATH123456",
      name: "Rajesh Kumar",
      age: 28,
      gender: "Male",
      contact: "+91 9876543210",
      address: "Camp A, Block 12",
      bloodType: "O+",
      allergies: "None",
      medicalHistory: "Routine checkup",
      status: "normal",
      lastVisit: "2024-09-20",
      symptoms: "Routine checkup"
    },
    {
      id: "ATH123457",
      name: "Priya Sharma",
      age: 32,
      gender: "Female",
      contact: "+91 9876543211",
      address: "Camp B, Block 5",
      bloodType: "A+",
      allergies: "Penicillin",
      medicalHistory: "Hypertension",
      status: "amber",
      lastVisit: "2024-09-19",
      symptoms: "Fever, headache"
    },
    {
      id: "ATH123458",
      name: "Mohammed Ali",
      age: 45,
      gender: "Male",
      contact: "+91 9876543212",
      address: "Camp C, Block 8",
      bloodType: "B+",
      allergies: "Aspirin",
      medicalHistory: "Diabetes, Heart condition",
      status: "red",
      lastVisit: "2024-09-18",
      symptoms: "Chest pain, shortness of breath"
    }
  ]);

  const handleSearch = () => {
    const migrant = migrantRecords.find(m => m.id.toLowerCase().includes(searchId.toLowerCase()));
    setSelectedMigrant(migrant || null);
    setShowProfile(!!migrant);
  };

  const handleNewAppointment = () => {
    setShowEncounterForm(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("rememberedUser");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-medical-green-light p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center py-6">
          <div className="text-center flex-1 space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Doctor Dashboard</h1>
            <p className="text-muted-foreground">Medical Assessment & Treatment Center</p>
            <Badge variant="secondary" className="bg-medical-green-light text-medical-green">
              <Stethoscope className="mr-1 h-3 w-3" />
              Dr. {localStorage.getItem("rememberedUser") || "Smith"}
            </Badge>
          </div>
          <div className="flex gap-2">
            <EmergencyModal migrantFiles={migrantRecords} />
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Migrant Lookup */}
        <Card className="shadow-lg border-border/50">
          <CardHeader>
            <CardTitle>Patient Lookup</CardTitle>
            <CardDescription>Enter or scan ATH ID to access patient records for medical assessment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter Athidi ID (e.g., ATH123456)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSearch} className="bg-primary hover:bg-primary/90">
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Migrant Profile Card */}
        {showProfile && selectedMigrant && (
          <MigrantProfileCard 
            migrant={selectedMigrant} 
            onNewAppointment={handleNewAppointment}
          />
        )}

        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="appointments">Today's Appointments</TabsTrigger>
            <TabsTrigger value="history">Medical History</TabsTrigger>
            <TabsTrigger value="reports">Lab Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-4">
            <Card className="shadow-lg border-border/50">
              <CardHeader>
                <CardTitle>Scheduled Appointments</CardTitle>
                <CardDescription>Today's patient appointments and assessments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-card border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge className="bg-medical-green-light text-medical-green">
                        10:00 AM
                      </Badge>
                      <div>
                        <h3 className="font-semibold">Rajesh Kumar</h3>
                        <p className="text-sm text-muted-foreground">ATH123456 • Follow-up visit</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Start Consultation</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-card border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge className="bg-warning-amber-light text-warning-amber">
                        2:30 PM
                      </Badge>
                      <div>
                        <h3 className="font-semibold">Priya Sharma</h3>
                        <p className="text-sm text-muted-foreground">ATH123457 • Fever assessment</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Start Consultation</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card className="shadow-lg border-border/50">
              <CardHeader>
                <CardTitle>Recent Medical History</CardTitle>
                <CardDescription>Patient encounters and treatments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-medical-green pl-4 py-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Completed Consultation</h4>
                      <span className="text-sm text-muted-foreground">Yesterday, 3:00 PM</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Mohammed Ali - Cardiac assessment, prescribed medication</p>
                  </div>
                  <div className="border-l-4 border-warning-amber pl-4 py-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Lab Results Pending</h4>
                      <span className="text-sm text-muted-foreground">2 days ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Priya Sharma - Blood work ordered, awaiting results</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card className="shadow-lg border-border/50">
              <CardHeader>
                <CardTitle>Laboratory Reports</CardTitle>
                <CardDescription>Recent test results and analyses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-card border rounded-lg">
                    <div>
                      <h3 className="font-semibold">Blood Panel - ATH123456</h3>
                      <p className="text-sm text-muted-foreground">Rajesh Kumar • Normal ranges</p>
                    </div>
                    <Badge className="bg-status-normal-light text-status-normal">Normal</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-card border rounded-lg">
                    <div>
                      <h3 className="font-semibold">CBC - ATH123457</h3>
                      <p className="text-sm text-muted-foreground">Priya Sharma • Pending review</p>
                    </div>
                    <Badge className="bg-warning-amber-light text-warning-amber">Pending</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* New Encounter Form */}
        <NewEncounterForm 
          open={showEncounterForm}
          onOpenChange={setShowEncounterForm}
          migrant={selectedMigrant}
        />
      </div>
    </div>
  );
};

export default DoctorDashboard;