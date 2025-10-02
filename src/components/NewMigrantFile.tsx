import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface NewMigrantFileProps {
  onFileCreated: (newFile: any) => void;
}

const NewMigrantFile = ({ onFileCreated }: NewMigrantFileProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone: "",
    address: "",
    emergencyContact: "",
    symptoms: "",
    medicalHistory: ""
  });
  const { toast } = useToast();

  const generateAthidiId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ATH${timestamp}${random}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.age.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in the required fields (Name and Age)",
        variant: "destructive"
      });
      return;
    }

    const athidiId = generateAthidiId();
    const newFile = {
      id: athidiId,
      name: formData.name,
      age: parseInt(formData.age),
      phone: formData.phone,
      address: formData.address,
      emergencyContact: formData.emergencyContact,
      status: "normal",
      lastVisit: new Date().toISOString().split('T')[0],
      symptoms: formData.symptoms || "Initial registration",
      medicalHistory: formData.medicalHistory,
      createdAt: new Date().toISOString(),
      createdBy: localStorage.getItem("rememberedUser") || "POC001"
    };

    onFileCreated(newFile);
    
    toast({
      title: "File Created Successfully",
      description: `New migrant file created with Athidi ID: ${athidiId}`,
    });

    // Reset form and close dialog
    setFormData({
      name: "",
      age: "",
      phone: "",
      address: "",
      emergencyContact: "",
      symptoms: "",
      medicalHistory: ""
    });
    setOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full border-medical-green text-medical-green hover:bg-medical-green-light">
          + Create New Migrant File
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Migrant Health File</DialogTitle>
          <DialogDescription>
            Enter the migrant's information to create a new health record. A unique Athidi ID will be generated automatically.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                placeholder="Age"
                min="1"
                max="120"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+91 XXXXXXXXXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergency">Emergency Contact</Label>
              <Input
                id="emergency"
                value={formData.emergencyContact}
                onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                placeholder="Emergency contact number"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Current Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Current address in Kerala"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="symptoms">Current Symptoms/Complaints</Label>
            <Textarea
              id="symptoms"
              value={formData.symptoms}
              onChange={(e) => handleInputChange("symptoms", e.target.value)}
              placeholder="Describe current health concerns or symptoms"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="history">Known Medical History</Label>
            <Textarea
              id="history"
              value={formData.medicalHistory}
              onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
              placeholder="Any known medical conditions, allergies, or previous treatments"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 bg-medical-green hover:bg-medical-green/90">
              Create Health File
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewMigrantFile;