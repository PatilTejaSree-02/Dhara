import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NewPatientModalProps {
  onPatientAdded: (patient: any) => void;
}

const NewPatientModal = ({ onPatientAdded }: NewPatientModalProps) => {
  const [open, setOpen] = useState(false);
  const [athidiId, setAthidiId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [foundPatient, setFoundPatient] = useState<any>(null);
  const [firstTime, setFirstTime] = useState(false);
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "Male",
    phone: "",
    address: "",
    symptoms: "",
  });
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!athidiId.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call to search for patient
    setTimeout(() => {
      // Mock patient data - in real app this would be fetched from backend
      const mockPatient = {
        id: athidiId,
        name: "New Patient",
        age: 35,
        gender: "Male",
        bloodType: "O+",
        status: "normal",
        lastVisit: new Date().toISOString().split('T')[0],
        diagnosis: "Initial consultation",
        vitals: { bp: "120/80", sugar: "95 mg/dL", temp: "98.6°F" },
        history: ["Initial registration"],
        notes: []
      };
      
      setFoundPatient(mockPatient);
      setIsSearching(false);
    }, 1000);
  };

  const handleAddPatient = () => {
    if (foundPatient) {
      onPatientAdded(foundPatient);
      toast({
        title: "Patient Added",
        description: `${foundPatient.name} has been added to your patient list.`,
      });
      setOpen(false);
      setAthidiId("");
      setFoundPatient(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-medical-green hover:bg-medical-green/90">
          <UserPlus className="h-4 w-4 mr-2" />
          New Patient
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Register New Patient</DialogTitle>
          <DialogDescription>
            Enter the Athidi ID to register a new patient to your care
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="athidiId">Athidi ID</Label>
            <div className="flex gap-2">
              <Input
                id="athidiId"
                placeholder="Enter Athidi ID (e.g., ATH123456)"
                value={athidiId}
                onChange={(e) => setAthidiId(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleSearch} 
                disabled={!athidiId.trim() || isSearching}
                size="sm"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {isSearching && (
            <div className="text-center py-4">
              <div className="inline-flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-muted-foreground">Searching patient records...</span>
              </div>
            </div>
          )}

          {foundPatient && (
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Patient Found</h4>
                <Badge variant="outline" className="bg-status-normal-light text-status-normal">
                  Verified
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Name:</span> {foundPatient.name}
                </div>
                <div>
                  <span className="font-medium">Age:</span> {foundPatient.age}
                </div>
                <div>
                  <span className="font-medium">Gender:</span> {foundPatient.gender}
                </div>
                <div>
                  <span className="font-medium">Blood Type:</span> {foundPatient.bloodType}
                </div>
              </div>
              <Button 
                onClick={handleAddPatient} 
                className="w-full bg-medical-green hover:bg-medical-green/90"
              >
                Add to Patient List
              </Button>
            </div>
          )}

          {/* First-time patient registration */}
          {!foundPatient && (
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">First-time Patient</h4>
                <Badge variant="outline">No ATH ID</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="gender">Gender</Label>
                  <Input id="gender" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label htmlFor="symptoms">Initial Symptoms</Label>
                  <Input id="symptoms" value={form.symptoms} onChange={(e) => setForm({ ...form, symptoms: e.target.value })} />
                </div>
              </div>
              <Button 
                className="w-full bg-primary"
                onClick={() => {
                  if (!form.name || !form.age) return;
                  const newId = `ATH${Math.floor(100000 + Math.random() * 900000)}`;
                  const patient = {
                    id: newId,
                    name: form.name,
                    age: Number(form.age),
                    gender: form.gender,
                    bloodType: "O+",
                    status: "normal",
                    lastVisit: new Date().toISOString().split('T')[0],
                    diagnosis: form.symptoms || "Initial consultation",
                    vitals: { bp: "--", sugar: "--", temp: "--" },
                    history: ["First-time registration"],
                    notes: [],
                  };
                  onPatientAdded(patient);
                  toast({ title: "Patient Registered", description: `Generated ID: ${newId}` });
                  setOpen(false);
                  setAthidiId("");
                  setFoundPatient(null);
                  setForm({ name: "", age: "", gender: "Male", phone: "", address: "", symptoms: "" });
                }}
              >
                Save & Generate ATH ID
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewPatientModal;