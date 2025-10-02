import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DoctorNotes from "@/components/DoctorNotes";
import NewPatientModal from "@/components/NewPatientModal";
import PatientSidebar from "@/components/PatientSidebar";
import AppointmentFlow from "@/components/AppointmentFlow";
import { Flag, FlagOff, LogOut } from "lucide-react";

const HospitalDashboard = () => {
  const [searchId, setSearchId] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showAppointmentFlow, setShowAppointmentFlow] = useState(false);
  const [isAppointmentActive, setIsAppointmentActive] = useState(false);
  const [patients, setPatients] = useState([
    {
      id: "ATH123456",
      name: "Rajesh Kumar",
        age: 28,
        gender: "Male",
        bloodType: "O+",
        status: "normal",
        lastVisit: "2024-09-20",
        diagnosis: "Routine checkup",
        vitals: { bp: "120/80", sugar: "95 mg/dL", temp: "98.6°F" },
        history: ["Common cold (Aug 2024)", "Vaccination (Jul 2024)"],
        notes: []
    },
    {
      id: "ATH123457",
      name: "Priya Sharma",
        age: 32,
        gender: "Female",
        bloodType: "A+",
        status: "amber",
        lastVisit: "2024-09-19",
        diagnosis: "Viral fever",
        vitals: { bp: "135/85", sugar: "110 mg/dL", temp: "101.2°F" },
        history: ["Fever episodes (Sep 2024)", "Headache recurring (Aug 2024)"],
        notes: []
    },
    {
      id: "ATH123458",
      name: "Mohammed Ali",
        age: 45,
        gender: "Male",
        bloodType: "B+",
        status: "red",
        lastVisit: "2024-09-18",
        diagnosis: "Suspected cardiac issue",
        vitals: { bp: "160/95", sugar: "140 mg/dL", temp: "99.1°F" },
        history: ["Chest pain (Sep 2024)", "Hypertension (Aug 2024)", "Diabetes Type 2 (2023)"],
        notes: []
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal": return "bg-status-normal-light text-status-normal border-status-normal/20";
      case "amber": return "bg-warning-amber-light text-warning-amber border-warning-amber/20";
      case "red": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const handleNotesAdded = (patientId: string, notes: any) => {
    setPatients(prev => prev.map(patient => {
      if (patient.id === patientId) {
        return {
          ...patient,
          status: notes.priority,
          lastVisit: new Date().toISOString().split('T')[0],
          diagnosis: notes.diagnosis || patient.diagnosis,
          vitals: { ...patient.vitals, ...notes.vitals },
          notes: [...(patient.notes || []), notes]
        };
      }
      return patient;
    }));
    
    // Update selected patient if it's the same one
    if (selectedPatient && selectedPatient.id === patientId) {
      const updatedPatient = patients.find(p => p.id === patientId);
      if (updatedPatient) {
        setSelectedPatient({
          ...updatedPatient,
          status: notes.priority,
          lastVisit: new Date().toISOString().split('T')[0],
          diagnosis: notes.diagnosis || updatedPatient.diagnosis,
          vitals: { ...updatedPatient.vitals, ...notes.vitals },
          notes: [...(updatedPatient.notes || []), notes]
        });
      }
    }
  };

  const [showNewPatientPrompt, setShowNewPatientPrompt] = useState(false);
  const [newPatientId, setNewPatientId] = useState("");

  const handleSearch = () => {
    const patient = patients.find(p => p.id.toLowerCase().includes(searchId.toLowerCase()));
    
    if (patient) {
      // Patient exists - show profile as usual
      setSelectedPatient(patient);
      setShowNewPatientPrompt(false);
    } else {
      // Patient doesn't exist - show new patient prompt
      setNewPatientId(searchId);
      setShowNewPatientPrompt(true);
      setSelectedPatient(null);
    }
  };

  const handleCreateNewPatient = () => {
    setShowNewPatientPrompt(false);
    // Start appointment flow for new patient
    setShowAppointmentFlow(true);
    // Create a temporary patient object for the appointment
    const tempPatient = {
      id: newPatientId,
      name: "New Patient",
      age: 0,
      gender: "Unknown",
      bloodType: "Unknown",
      status: "normal",
      lastVisit: new Date().toISOString().split('T')[0],
      diagnosis: "New patient - details to be collected",
      vitals: { bp: "--", sugar: "--", temp: "--" },
      history: ["New patient registration"],
      notes: [],
      isNewPatient: true // Flag to indicate this is a new patient
    };
    setSelectedPatient(tempPatient);
  };

  const handleCancelNewPatient = () => {
    setShowNewPatientPrompt(false);
    setNewPatientId("");
    setSearchId("");
  };

  const handleFlagPatient = (patientId: string) => {
    setPatients(prev => prev.map(patient => 
      patient.id === patientId 
        ? { ...patient, status: patient.status === "red" ? "normal" : "red" }
        : patient
    ));
    
    if (selectedPatient && selectedPatient.id === patientId) {
      setSelectedPatient(prev => ({ 
        ...prev, 
        status: prev.status === "red" ? "normal" : "red" 
      }));
    }
  };

  const handleNewPatient = (patient: any) => {
    setPatients(prev => [patient, ...prev]);
    setSelectedPatient(patient);
  };

  const handleAppointmentComplete = (appointmentData: any) => {
    if (selectedPatient?.isNewPatient) {
      // This is a new patient - add them to the system
      const newPatient = {
        ...selectedPatient,
        name: appointmentData.patientName || selectedPatient.name,
        age: appointmentData.patientAge || selectedPatient.age,
        gender: appointmentData.patientGender || selectedPatient.gender,
        bloodType: appointmentData.bloodType || selectedPatient.bloodType,
        lastVisit: new Date().toISOString().split('T')[0],
        diagnosis: appointmentData.diagnosis || "Initial consultation",
        history: [`${appointmentData.diagnosis || "Initial consultation"} (${new Date().toLocaleDateString()})`],
        notes: [appointmentData],
        isNewPatient: false // Remove the flag since they're now in the system
      };
      
      setPatients(prev => [newPatient, ...prev]);
      setSelectedPatient(newPatient);
    } else {
      // Existing patient - update their record
      setPatients(prev => prev.map(patient => {
        if (patient.id === appointmentData.patientId) {
          return {
            ...patient,
            lastVisit: new Date().toISOString().split('T')[0],
            diagnosis: appointmentData.diagnosis || patient.diagnosis,
            history: [`${appointmentData.diagnosis} (${new Date().toLocaleDateString()})`, ...patient.history],
            notes: [...(patient.notes || []), appointmentData]
          };
        }
        return patient;
      }));
    }
    
    setShowAppointmentFlow(false);
    setIsAppointmentActive(false);
  };

  const handleStartAppointment = () => {
    if (selectedPatient) {
      setShowAppointmentFlow(true);
      setIsAppointmentActive(true);
    }
  };

  const handleEndAppointment = () => {
    setShowAppointmentFlow(false);
    setIsAppointmentActive(false);
    setSelectedPatient(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("rememberedUser");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-medical-green-light p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center py-6">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-foreground">Hospital Dashboard</h1>
            <p className="text-muted-foreground">Medical Professional Portal</p>
            <div className="flex items-center justify-center gap-2">
              <Badge variant="secondary" className="bg-medical-green-light text-medical-green">
                Hospital ID: {localStorage.getItem("rememberedUser") || "HSP001"}
              </Badge>
              {isAppointmentActive && (
                <Badge variant="destructive" className="animate-pulse">
                  🔴 Appointment Active - {selectedPatient?.name}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <NewPatientModal onPatientAdded={handleNewPatient} />
            {!isAppointmentActive && (
              <Button 
                onClick={() => setShowAppointmentFlow(!showAppointmentFlow)}
                variant={showAppointmentFlow ? "secondary" : "default"}
                className="bg-medical-green hover:bg-medical-green/90"
              >
                {showAppointmentFlow ? "Close Appointment" : "New Appointment"}
              </Button>
            )}
            {selectedPatient && !isAppointmentActive && (
              <Button 
                onClick={handleStartAppointment}
                className="bg-primary hover:bg-primary/90"
              >
                Start Appointment
              </Button>
            )}
            {isAppointmentActive && (
              <Button 
                onClick={handleEndAppointment}
                variant="destructive"
              >
                End Appointment
              </Button>
            )}
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Patient Search */}
        <Card className="shadow-lg border-border/50">
          <CardHeader>
            <CardTitle>Patient Search</CardTitle>
            <CardDescription>Search migrant patients by Athidi ID</CardDescription>
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
                Search Patient
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* New Patient Prompt */}
        {showNewPatientPrompt && (
          <Card className="shadow-lg border-warning-amber/20 bg-warning-amber/5">
            <CardHeader>
              <CardTitle className="text-warning-amber flex items-center gap-2">
                🆕 New Patient Detected
              </CardTitle>
              <CardDescription>
                This looks like a new patient. Would you like to create a record?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-card p-4 rounded-lg border border-warning-amber/20">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="bg-warning-amber/20 text-warning-amber">
                    ID: {newPatientId}
                  </Badge>
                  <span className="text-sm text-muted-foreground">Not found in records</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  This patient ID doesn't exist in our system. You can create a new patient record 
                  and immediately start an appointment to collect their details.
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleCreateNewPatient}
                  className="bg-black hover:bg-black/90 text-white font-semibold"
                >
                  Yes, Create Record & Start Appointment
                </Button>
                <Button 
                  onClick={handleCancelNewPatient}
                  variant="outline"
                >
                  No, Return to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Appointment Flow */}
        {showAppointmentFlow && (
          <AppointmentFlow 
            patient={selectedPatient}
            onAppointmentComplete={handleAppointmentComplete}
          />
        )}

        {/* Active Appointment Controls */}
        {isAppointmentActive && selectedPatient && (
          <Card className="shadow-lg border-border/50 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔴 Active Appointment - {selectedPatient.name}
                <Badge variant="destructive" className="animate-pulse">
                  In Progress
                </Badge>
              </CardTitle>
              <CardDescription>
                Focused appointment mode - Patient Records hidden for concentration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <DoctorNotes patient={selectedPatient} onNotesAdded={handleNotesAdded} />
                <Button 
                  variant={selectedPatient.status === "red" ? "secondary" : "destructive"}
                  onClick={() => handleFlagPatient(selectedPatient.id)}
                >
                  {selectedPatient.status === "red" ? (
                    <><FlagOff className="h-4 w-4 mr-2" /> Unflag Patient</>
                  ) : (
                    <><Flag className="h-4 w-4 mr-2" /> Flag Suspicious</>
                  )}
                </Button>
                <Button className="bg-medical-green hover:bg-medical-green/90">
                  Update Treatment
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="patients" className="space-y-6">
          <TabsList className={`grid w-full ${isAppointmentActive ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {!isAppointmentActive && <TabsTrigger value="patients">Patient Records</TabsTrigger>}
            <TabsTrigger value="timeline">Medical Timeline</TabsTrigger>
            <TabsTrigger value="emergency">Emergency</TabsTrigger>
          </TabsList>

          {!isAppointmentActive && (
            <TabsContent value="patients" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Patient List */}
                <div className="lg:col-span-3">
                  <Card className="shadow-lg border-border/50">
                <CardHeader>
                  <CardTitle>Recent Patients</CardTitle>
                  <CardDescription>Overview of migrant patients and their status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {patients.map((patient) => (
                      <div key={patient.id} className="flex items-center justify-between p-4 bg-card border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors" onClick={() => setSelectedPatient(patient)}>
                        <div className="flex items-center gap-4">
                          <Badge className={getStatusColor(patient.status)}>
                            {patient.status.toUpperCase()}
                          </Badge>
                          <div>
                            <h3 className="font-semibold">{patient.name}</h3>
                            <p className="text-sm text-muted-foreground">ID: {patient.id} • Age: {patient.age}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{patient.lastVisit}</p>
                          <p className="text-xs text-muted-foreground">{patient.diagnosis}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

                  {/* Selected Patient Details */}
                  {selectedPatient && (
                    <Card className="shadow-lg border-border/50">
                      <CardHeader>
                        <CardTitle>Patient Details - {selectedPatient.name}</CardTitle>
                        <CardDescription>Complete medical record and history</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-3">Medical History</h4>
                            <div className="space-y-2 text-sm max-h-32 overflow-y-auto">
                              {selectedPatient.history.map((item: string, index: number) => (
                                <p key={index} className="text-muted-foreground">• {item}</p>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-3">Previous Check-ups Summary</h4>
                            <div className="space-y-2 text-sm">
                              <p><span className="font-medium">Last Visit:</span> {selectedPatient.lastVisit}</p>
                              <p><span className="font-medium">Current Diagnosis:</span> {selectedPatient.diagnosis}</p>
                              <p><span className="font-medium">Notes Count:</span> {selectedPatient.notes?.length || 0}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Emergency View Card */}
                        <Card className="bg-destructive/5 border-destructive/20">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm text-destructive">Emergency Quick Access</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="grid grid-cols-3 gap-4 text-xs">
                              <div>
                                <p className="font-medium">Allergies:</p>
                                <p className="text-muted-foreground">None recorded</p>
                              </div>
                              <div>
                                <p className="font-medium">Blood Type:</p>
                                <p className="font-medium text-destructive">{selectedPatient.bloodType}</p>
                              </div>
                              <div>
                                <p className="font-medium">Critical History:</p>
                                <p className="text-muted-foreground">
                                  {selectedPatient.history.find((h: string) => h.includes("cardiac") || h.includes("Diabetes")) || "None"}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <div className="flex gap-2 pt-4 border-t">
                          <Button className="bg-medical-green hover:bg-medical-green/90">
                            Update Treatment
                          </Button>
                          <DoctorNotes patient={selectedPatient} onNotesAdded={handleNotesAdded} />
                          <Button 
                            variant={selectedPatient.status === "red" ? "secondary" : "destructive"}
                            onClick={() => handleFlagPatient(selectedPatient.id)}
                          >
                            {selectedPatient.status === "red" ? (
                              <><FlagOff className="h-4 w-4 mr-2" /> Unflag</>
                            ) : (
                              <><Flag className="h-4 w-4 mr-2" /> Flag Suspicious</>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                {/* Patient Sidebar */}
                <div className="lg:col-span-1">
                  <PatientSidebar patient={selectedPatient} />
                </div>
              </div>
            </TabsContent>
          )}

          <TabsContent value="timeline" className="space-y-4">
            {selectedPatient ? (
              <Card className="shadow-lg border-border/50">
                <CardHeader>
                  <CardTitle>Medical Timeline - {selectedPatient.name}</CardTitle>
                  <CardDescription>Complete medical history and treatment progression</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-primary pl-4 py-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-primary">Current Visit</h4>
                        <span className="text-sm text-muted-foreground">{selectedPatient.lastVisit}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{selectedPatient.diagnosis}</p>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Vitals: BP {selectedPatient.vitals.bp} | Sugar {selectedPatient.vitals.sugar} | Temp {selectedPatient.vitals.temp}
                      </div>
                    </div>
                    {selectedPatient.history.map((item: string, index: number) => (
                      <div key={index} className="border-l-4 border-muted pl-4 py-2">
                        <p className="text-sm">{item}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-lg border-border/50">
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">Select a patient to view their medical timeline</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="emergency" className="space-y-4">
            {selectedPatient ? (
              // Patient-specific emergency information
              <Card className="shadow-lg border-destructive/20 bg-destructive/5">
                <CardHeader>
                  <CardTitle className="text-destructive flex items-center gap-2">
                    🚨 Emergency Information - {selectedPatient.name}
                    <Badge variant="destructive" className="bg-destructive/20 text-destructive">
                      {selectedPatient.id}
                    </Badge>
                  </CardTitle>
                  <CardDescription>Critical medical information for emergency treatment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Blood Type & Critical Info */}
                    <div className="bg-card p-4 rounded-lg border border-destructive/20">
                      <h4 className="font-semibold text-destructive mb-3">Critical Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">Blood Type:</span>
                          <span className="font-bold text-destructive">{selectedPatient.bloodType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Age:</span>
                          <span>{selectedPatient.age} years</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Gender:</span>
                          <span>{selectedPatient.gender}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Status:</span>
                          <Badge className={getStatusColor(selectedPatient.status)}>
                            {selectedPatient.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Known Conditions */}
                    <div className="bg-card p-4 rounded-lg border border-warning-amber/20">
                      <h4 className="font-semibold text-warning-amber mb-3">Known Conditions</h4>
                      <div className="space-y-2 text-sm">
                        {selectedPatient.history?.filter((h: string) => 
                          h.toLowerCase().includes('diabetes') || 
                          h.toLowerCase().includes('hypertension') || 
                          h.toLowerCase().includes('asthma') ||
                          h.toLowerCase().includes('cardiac') ||
                          h.toLowerCase().includes('heart')
                        ).length > 0 ? (
                          selectedPatient.history
                            .filter((h: string) => 
                              h.toLowerCase().includes('diabetes') || 
                              h.toLowerCase().includes('hypertension') || 
                              h.toLowerCase().includes('asthma') ||
                              h.toLowerCase().includes('cardiac') ||
                              h.toLowerCase().includes('heart')
                            )
                            .map((condition: string, index: number) => (
                              <div key={index} className="text-warning-amber">• {condition}</div>
                            ))
                        ) : (
                          <div className="text-muted-foreground">None recorded</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Allergies */}
                    <div className="bg-card p-4 rounded-lg border border-destructive/20">
                      <h4 className="font-semibold text-destructive mb-3">Allergies</h4>
                      <div className="text-sm">
                        <div className="text-muted-foreground">None recorded</div>
                      </div>
                    </div>

                    {/* Major Medical History */}
                    <div className="bg-card p-4 rounded-lg border border-warning-amber/20">
                      <h4 className="font-semibold text-warning-amber mb-3">Major Medical History</h4>
                      <div className="space-y-2 text-sm max-h-32 overflow-y-auto">
                        {selectedPatient.history?.length > 0 ? (
                          selectedPatient.history.slice(0, 5).map((item: string, index: number) => (
                            <div key={index} className="text-muted-foreground">• {item}</div>
                          ))
                        ) : (
                          <div className="text-muted-foreground">None recorded</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Current Diagnosis & Vitals */}
                  <div className="bg-card p-4 rounded-lg border">
                    <h4 className="font-semibold mb-3">Current Status</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Current Diagnosis:</span>
                        <p className="text-muted-foreground mt-1">{selectedPatient.diagnosis}</p>
                      </div>
                      <div>
                        <span className="font-medium">Last Visit:</span>
                        <p className="text-muted-foreground mt-1">{selectedPatient.lastVisit}</p>
                      </div>
                      <div>
                        <span className="font-medium">Vitals:</span>
                        <p className="text-muted-foreground mt-1">
                          BP: {selectedPatient.vitals?.bp || '--'} | 
                          Sugar: {selectedPatient.vitals?.sugar || '--'} | 
                          Temp: {selectedPatient.vitals?.temp || '--'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              // General emergency dashboard (default state)
              <Card className="shadow-lg border-destructive/20 bg-destructive/5">
                <CardHeader>
                  <CardTitle className="text-destructive">Emergency Dashboard</CardTitle>
                  <CardDescription>Quick access to critical patient information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-card p-4 rounded-lg border border-destructive/20">
                      <h4 className="font-semibold text-destructive mb-2">Critical Patients</h4>
                      <div className="space-y-2">
                        {patients.filter(p => p.status === "red").map(patient => (
                          <div key={patient.id} className="text-sm">
                            <p className="font-medium">{patient.name} ({patient.id})</p>
                            <p className="text-muted-foreground">{patient.diagnosis}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-card p-4 rounded-lg border border-warning-amber/20">
                      <h4 className="font-semibold text-warning-amber mb-2">Watch List</h4>
                      <div className="space-y-2">
                        {patients.filter(p => p.status === "amber").map(patient => (
                          <div key={patient.id} className="text-sm">
                            <p className="font-medium">{patient.name} ({patient.id})</p>
                            <p className="text-muted-foreground">{patient.diagnosis}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="bg-card p-4 rounded-lg border">
                    <h4 className="font-semibold mb-2">Recent Lab Results</h4>
                    <div className="text-sm space-y-1">
                      <p>• Mohammed Ali - Blood work pending (Priority: High)</p>
                      <p>• Priya Sharma - X-ray results available</p>
                      <p>• Rajesh Kumar - Routine bloodwork normal</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HospitalDashboard;