import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react"; // Fixed FileUpload import issue
import { useToast } from "@/hooks/use-toast";

interface NewEncounterFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  migrant: any;
}

const NewEncounterForm = ({ open, onOpenChange, migrant }: NewEncounterFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    migrantId: migrant?.id || "",
    facility: "",
    symptoms: [] as string[],
    otherSymptoms: "",
    diagnosis: "",
    sampleOrdered: false,
    notifiableDisease: false,
    prescription: "",
    followUp: ""
  });

  const symptomsList = [
    "Fever", "Cough", "Breathlessness", "Rash", "Headache", 
    "Body Pain", "Vomiting", "Diarrhea", "Weakness", "Loss of Appetite"
  ];

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      symptoms: checked 
        ? [...prev.symptoms, symptom]
        : prev.symptoms.filter(s => s !== symptom)
    }));
  };

  const handleSubmit = () => {
    if (!formData.diagnosis) {
      toast({
        title: "Error",
        description: "Provisional diagnosis is required",
        variant: "destructive"
      });
      return;
    }

    // Simulate saving encounter
    toast({
      title: "Success",
      description: "New encounter saved successfully",
    });
    
    onOpenChange(false);
    resetForm();
  };

  const handleScheduleAppointment = () => {
    toast({
      title: "Appointment Scheduled",
      description: "Follow-up appointment has been scheduled",
    });
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      migrantId: migrant?.id || "",
      facility: "",
      symptoms: [],
      otherSymptoms: "",
      diagnosis: "",
      sampleOrdered: false,
      notifiableDisease: false,
      prescription: "",
      followUp: ""
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Encounter - {migrant?.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Information */}
          <Card>
            <CardHeader>
              <CardTitle>1. Patient Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="migrantId">Migrant ID *</Label>
                <Input
                  id="migrantId"
                  value={formData.migrantId}
                  onChange={(e) => setFormData(prev => ({ ...prev, migrantId: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="facility">Facility *</Label>
                <Select value={formData.facility} onValueChange={(value) => setFormData(prev => ({ ...prev, facility: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select facility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ernakulam-phc">Ernakulam PHC</SelectItem>
                    <SelectItem value="kochi-general">Kochi General Hospital</SelectItem>
                    <SelectItem value="camp-clinic">Camp Medical Clinic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Clinical Assessment */}
          <Card>
            <CardHeader>
              <CardTitle>2. Clinical Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-base font-medium">Symptoms</Label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {symptomsList.map((symptom) => (
                    <div key={symptom} className="flex items-center space-x-2">
                      <Checkbox
                        id={symptom}
                        checked={formData.symptoms.includes(symptom)}
                        onCheckedChange={(checked) => handleSymptomChange(symptom, checked as boolean)}
                      />
                      <Label htmlFor={symptom} className="text-sm">{symptom}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="otherSymptoms">Other Symptoms</Label>
                <Textarea
                  id="otherSymptoms"
                  value={formData.otherSymptoms}
                  onChange={(e) => setFormData(prev => ({ ...prev, otherSymptoms: e.target.value }))}
                  placeholder="Describe any additional symptoms..."
                />
              </div>

              <div>
                <Label htmlFor="diagnosis">Provisional Diagnosis *</Label>
                <Textarea
                  id="diagnosis"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
                  placeholder="Enter provisional diagnosis..."
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Laboratory & Disease Notification */}
          <Card>
            <CardHeader>
              <CardTitle>3. Laboratory & Disease Notification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="sampleOrdered">Sample Ordered for Testing?</Label>
                <Switch
                  id="sampleOrdered"
                  checked={formData.sampleOrdered}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sampleOrdered: checked }))}
                />
              </div>

              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <Upload className="h-5 w-5 text-muted-foreground" />
                <Label className="cursor-pointer">Upload Lab Reports (PDF/CSV)</Label>
                <input type="file" className="hidden" accept=".pdf,.csv" />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg bg-warning-amber-light/10">
                <div>
                  <Label htmlFor="notifiableDisease" className="font-medium">Notifiable Disease?</Label>
                  <p className="text-sm text-muted-foreground">Triggers alert to DHO/IDSP</p>
                </div>
                <Switch
                  id="notifiableDisease"
                  checked={formData.notifiableDisease}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, notifiableDisease: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Treatment & Follow-up */}
          <Card>
            <CardHeader>
              <CardTitle>4. Treatment & Follow-up</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="prescription">Prescription & Medication</Label>
                <Textarea
                  id="prescription"
                  value={formData.prescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, prescription: e.target.value }))}
                  placeholder="Enter medicines, dosage, and instructions..."
                />
              </div>

              <div>
                <Label htmlFor="followUp">Follow-up Instructions</Label>
                <Textarea
                  id="followUp"
                  value={formData.followUp}
                  onChange={(e) => setFormData(prev => ({ ...prev, followUp: e.target.value }))}
                  placeholder="Enter schedule and special instructions..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={handleSubmit} className="flex-1 bg-primary hover:bg-primary/90">
              Save & Submit
            </Button>
            <Button onClick={handleScheduleAppointment} variant="outline" className="flex-1">
              Schedule Next Appointment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewEncounterForm;