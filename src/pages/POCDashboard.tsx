import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, LogOut, Plus, Search, X, CheckCircle, AlertCircle } from "lucide-react";

// Mock components
const SummaryCards = ({ totalFiles, systemAlerts, pendingAppointments }: { 
  totalFiles: number; 
  systemAlerts: number; 
  pendingAppointments: number;
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Total Files</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalFiles}</div>
        <p className="text-xs text-muted-foreground">Migrant records</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">System Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-amber-600">{systemAlerts}</div>
        <p className="text-xs text-muted-foreground">Requiring attention</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-blue-600">{pendingAppointments}</div>
        <p className="text-xs text-muted-foreground">Scheduled</p>
      </CardContent>
    </Card>
  </div>
);

const SurveillanceMap = ({ activeCases, newEncounters, district }: { 
  activeCases: number; 
  newEncounters: number; 
  district: string;
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Health Surveillance - {district}</CardTitle>
      <CardDescription>Active cases and new encounters</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">Surveillance Map</div>
          <div className="space-y-2">
            <Badge variant="destructive" className="mr-2">Active Cases: {activeCases}</Badge>
            <Badge variant="default" className="mr-2">New Encounters: {newEncounters}</Badge>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Success/Error Popup Component
const SubmissionPopup = ({ isOpen, type, message, onClose }: {
  isOpen: boolean;
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {type === 'success' ? (
              <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
            ) : (
              <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
            )}
            <h3 className="text-lg font-semibold">
              {type === 'success' ? 'Success!' : 'Error!'}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-gray-600 mb-4">{message}</p>
        <Button
          onClick={onClose}
          className={`w-full ${
            type === 'success' 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-red-600 hover:bg-red-700'
          } text-white`}
        >
          OK
        </Button>
      </div>
    </div>
  );
};

const POCDashboard = () => {
  const [searchId, setSearchId] = useState("");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [appointments, setAppointments] = useState([
    { id: "ATH123456", name: "Rajesh Kumar", time: "Today, 2:00 PM" },
  ]);
  const [showId, setShowId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"search" | "new">("search");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Popup state
  const [popup, setPopup] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    message: string;
  }>({
    isOpen: false,
    type: 'success',
    message: ''
  });
  
  // New migrant form state
  const [newMigrantForm, setNewMigrantForm] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
    emergencyContact: "",
    symptoms: "",
    medicalHistory: ""
  });

  // Symptoms update form state (for existing migrants)
  const [symptomsForm, setSymptomsForm] = useState({
    symptoms: "",
    severity: "normal",
    notes: ""
  });

  const [migrantFiles, setMigrantFiles] = useState([
    {
      id: "ATH123456",
      name: "Rajesh Kumar",
      age: 28,
      status: "normal",
      lastVisit: "2024-09-20",
      symptoms: "Routine checkup",
      gender: "Male",
      phone: "+91 9876543210",
      address: "Camp A, Block 12",
      medicalHistory: "None recorded"
    },
    {
      id: "ATH123457",
      name: "Priya Sharma",
      age: 32,
      status: "amber",
      lastVisit: "2024-09-19",
      symptoms: "Fever, headache",
      gender: "Female",
      phone: "+91 9876543211",
      address: "Camp B, Block 5",
      medicalHistory: "None recorded"
    }
  ]);

  const [activityLog, setActivityLog] = useState([
    {
      type: "appointment",
      title: "Scheduled Appointment",
      description: "Rajesh Kumar (ATH123456) - Follow-up visit",
      timestamp: "Today, 2:00 PM",
      color: "border-l-green-500"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal": return "bg-green-100 text-green-800 border-green-200";
      case "amber": return "bg-amber-100 text-amber-800 border-amber-200";
      case "red": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
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

  // Show popup function
  const showPopup = (type: 'success' | 'error', message: string) => {
    setPopup({
      isOpen: true,
      type,
      message
    });
  };

  // Close popup function
  const closePopup = () => {
    setPopup({
      isOpen: false,
      type: 'success',
      message: ''
    });
  };

  // Handle new migrant form input changes
  const handleNewMigrantInputChange = (field: string, value: string) => {
    setNewMigrantForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle symptoms form input changes
  const handleSymptomsInputChange = (field: string, value: string) => {
    setSymptomsForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Submit new migrant form
  const handleSubmitNewMigrant = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!newMigrantForm.name || !newMigrantForm.age || !newMigrantForm.phone) {
        throw new Error("Please fill in all required fields");
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newMigrant = {
        id: `ATH${Math.floor(100000 + Math.random() * 900000)}`,
        name: newMigrantForm.name,
        age: parseInt(newMigrantForm.age),
        status: "normal",
        lastVisit: new Date().toISOString().split('T')[0],
        symptoms: newMigrantForm.symptoms || "Initial registration",
        gender: newMigrantForm.gender || "Not specified",
        phone: newMigrantForm.phone,
        address: newMigrantForm.address || "Not specified",
        medicalHistory: newMigrantForm.medicalHistory || "None recorded"
      };

      setMigrantFiles(prev => [newMigrant, ...prev]);
      
      // Show success popup
      showPopup('success', `New migrant record created successfully! ID: ${newMigrant.id}`);

      // Add to activity log
      const newActivity = {
        type: "new_migrant",
        title: "New Migrant Registered",
        description: `${newMigrant.name} (${newMigrant.id}) - ${newMigrant.symptoms}`,
        timestamp: new Date().toLocaleString(),
        color: "border-l-green-500"
      };
      setActivityLog(prev => [newActivity, ...prev]);

      // Reset form
      setNewMigrantForm({
        name: "",
        age: "",
        gender: "",
        phone: "",
        address: "",
        emergencyContact: "",
        symptoms: "",
        medicalHistory: ""
      });

    } catch (error) {
      showPopup('error', error instanceof Error ? error.message : 'Error creating migrant record');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit symptoms for existing migrant
  const handleSubmitSymptoms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    
    setIsSubmitting(true);

    try {
      if (!symptomsForm.symptoms) {
        throw new Error("Please describe the symptoms");
      }

      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update migrant file
      const updatedFiles = migrantFiles.map(file => 
        file.id === selectedFile.id 
          ? { 
              ...file, 
              symptoms: symptomsForm.symptoms,
              status: symptomsForm.severity,
              lastVisit: new Date().toISOString().split('T')[0]
            }
          : file
      );

      setMigrantFiles(updatedFiles);
      setSelectedFile(updatedFiles.find(f => f.id === selectedFile.id));

      // Show success popup
      showPopup('success', `Symptoms recorded successfully for ${selectedFile.name}`);

      // Add to activity log
      const newActivity = {
        type: "symptoms_update",
        title: "Symptoms Recorded",
        description: `${selectedFile.name} (${selectedFile.id}) - ${symptomsForm.symptoms}`,
        timestamp: new Date().toLocaleString(),
        color: symptomsForm.severity === "red" ? "border-l-red-500" : 
               symptomsForm.severity === "amber" ? "border-l-amber-500" : "border-l-green-500"
      };
      setActivityLog(prev => [newActivity, ...prev]);

      // Reset form
      setSymptomsForm({
        symptoms: "",
        severity: "normal",
        notes: ""
      });

      setSearchId("");

    } catch (error) {
      showPopup('error', error instanceof Error ? error.message : 'Error recording symptoms');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = () => {
    const file = migrantFiles.find(f => f.id.toLowerCase().includes(searchId.toLowerCase()));
    setSelectedFile(file || null);
    if (file) {
      setActiveTab("search");
    }
  };

  const handleScheduleAppointment = () => {
    if (!selectedFile) return;
    
    const appt = { 
      id: selectedFile.id, 
      name: selectedFile.name, 
      time: new Date().toLocaleString() 
    };
    
    setAppointments(prev => [appt, ...prev]);
    
    const newActivity = {
      type: "appointment",
      title: "Appointment Scheduled",
      description: `${selectedFile.name} (${selectedFile.id})`,
      timestamp: new Date().toLocaleString(),
      color: "border-l-green-500"
    };
    setActivityLog(prev => [newActivity, ...prev]);
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem("rememberedUser");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50 p-4">
      {/* Submission Popup */}
      <SubmissionPopup 
        isOpen={popup.isOpen}
        type={popup.type}
        message={popup.message}
        onClose={closePopup}
      />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center py-6">
          <div className="text-center flex-1 space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">POC Dashboard</h1>
            <p className="text-gray-600">Point of Contact Health Management Center</p>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              POC ID: {localStorage.getItem("rememberedUser") || "POC001"}
            </Badge>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <SummaryCards 
          totalFiles={migrantFiles.length}
          systemAlerts={migrantFiles.filter(f => f.status === "amber" || f.status === "red").length}
          pendingAppointments={appointments.length}
        />

        <Card className="shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle>Migrant Management</CardTitle>
            <CardDescription>Register new migrants or update existing records</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Tab switcher */}
            <div className="flex border-b mb-6">
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "search"
                    ? "border-b-2 border-green-600 text-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("search")}
              >
                <Search className="w-4 h-4 inline mr-2" />
                Search Existing Migrant
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "new"
                    ? "border-b-2 border-green-600 text-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("new")}
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Register New Migrant
              </button>
            </div>

            {/* Search Existing Migrant Tab */}
            {activeTab === "search" && (
              <div className="space-y-6">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter Athidi ID (e.g., ATH123456)"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                </div>

                {selectedFile ? (
                  <div className="space-y-6">
                    {/* Migrant Info Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Migrant Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p><strong>Name:</strong> {selectedFile.name}</p>
                            <p><strong>ID:</strong> {selectedFile.id}</p>
                            <p><strong>Age:</strong> {selectedFile.age}</p>
                            <p><strong>Gender:</strong> {selectedFile.gender}</p>
                          </div>
                          <div>
                            <p><strong>Phone:</strong> {selectedFile.phone}</p>
                            <p><strong>Address:</strong> {selectedFile.address}</p>
                            <p><strong>Last Visit:</strong> {selectedFile.lastVisit}</p>
                            <p><strong>Status:</strong> 
                              <Badge className={`ml-2 ${getStatusColor(selectedFile.status)}`}>
                                {selectedFile.status.toUpperCase()}
                              </Badge>
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Symptoms Form */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Record Symptoms</CardTitle>
                        <CardDescription>Update health information for this migrant</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleSubmitSymptoms} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="symptoms">Symptoms Description *</Label>
                            <Textarea
                              id="symptoms"
                              placeholder="Describe the symptoms in detail..."
                              value={symptomsForm.symptoms}
                              onChange={(e) => handleSymptomsInputChange("symptoms", e.target.value)}
                              required
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="severity">Severity Level</Label>
                              <Select 
                                value={symptomsForm.severity} 
                                onValueChange={(value) => handleSymptomsInputChange("severity", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="normal">Normal</SelectItem>
                                  <SelectItem value="amber">Amber (Monitor)</SelectItem>
                                  <SelectItem value="red">Red (Urgent)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="notes">Additional Notes</Label>
                              <Input
                                id="notes"
                                placeholder="Any additional information..."
                                value={symptomsForm.notes}
                                onChange={(e) => handleSymptomsInputChange("notes", e.target.value)}
                              />
                            </div>
                          </div>
                          
                          <Button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                          >
                            {isSubmitting ? "Submitting..." : "Submit Symptoms"}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                ) : searchId && (
                  <div className="text-center py-8 text-gray-500">
                    No migrant found with ID: {searchId}
                  </div>
                )}
              </div>
            )}

            {/* Register New Migrant Tab */}
            {activeTab === "new" && (
              <Card>
                <CardHeader>
                  <CardTitle>Register New Migrant</CardTitle>
                  <CardDescription>Create a new health record for a migrant</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitNewMigrant} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          placeholder="Enter full name"
                          value={newMigrantForm.name}
                          onChange={(e) => handleNewMigrantInputChange("name", e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="age">Age *</Label>
                        <Input
                          id="age"
                          type="number"
                          placeholder="Enter age"
                          value={newMigrantForm.age}
                          onChange={(e) => handleNewMigrantInputChange("age", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select 
                          value={newMigrantForm.gender} 
                          onValueChange={(value) => handleNewMigrantInputChange("gender", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          placeholder="+91 0000000000"
                          value={newMigrantForm.phone}
                          onChange={(e) => handleNewMigrantInputChange("phone", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        placeholder="Camp and block details"
                        value={newMigrantForm.address}
                        onChange={(e) => handleNewMigrantInputChange("address", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="symptoms">Initial Symptoms/Complaints</Label>
                      <Textarea
                        id="symptoms"
                        placeholder="Describe any current symptoms or health complaints..."
                        value={newMigrantForm.symptoms}
                        onChange={(e) => handleNewMigrantInputChange("symptoms", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="medicalHistory">Medical History</Label>
                      <Textarea
                        id="medicalHistory"
                        placeholder="Any known medical conditions or history..."
                        value={newMigrantForm.medicalHistory}
                        onChange={(e) => handleNewMigrantInputChange("medicalHistory", e.target.value)}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isSubmitting ? "Creating Record..." : "Create Migrant Record"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Rest of the dashboard (Files, Surveillance, Activity Log) */}
        <Tabs defaultValue="files" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="files">Migrant Files</TabsTrigger>
            <TabsTrigger value="surveillance">Health Surveillance</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>

          <TabsContent value="files" className="space-y-4">
            <Card className="shadow-lg border border-gray-200">
              <CardHeader>
                <CardTitle>Migrant Files</CardTitle>
                <CardDescription>All registered migrant health records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {migrantFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-4">
                        <Badge className={getStatusColor(file.status)}>
                          {getStatusIcon(file.status)} {file.status.toUpperCase()}
                        </Badge>
                        <div>
                          <h3 className="font-semibold">{file.name}</h3>
                          <p className="text-sm text-gray-600">
                            ID: {file.id} • Age: {file.age} • Last Visit: {file.lastVisit}
                          </p>
                          <p className="text-xs text-gray-500">{file.symptoms}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchId(file.id);
                          setSelectedFile(file);
                          setActiveTab("search");
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="surveillance" className="space-y-4">
            <SurveillanceMap 
              activeCases={migrantFiles.filter(f => f.status === "red").length}
              newEncounters={2}
              district="Ernakulam"
            />
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card className="shadow-lg border border-gray-200">
              <CardHeader>
                <CardTitle>Activity Log</CardTitle>
                <CardDescription>Recent system activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityLog.map((activity, index) => (
                    <div key={index} className={`border-l-4 ${activity.color} pl-4 py-2`}>
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{activity.title}</h4>
                        <span className="text-sm text-gray-600">{activity.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default POCDashboard;