import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface DoctorNotesProps {
  patient: any;
  onNotesAdded: (patientId: string, notes: any) => void;
}

const DoctorNotes = ({ patient, onNotesAdded }: DoctorNotesProps) => {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [medication, setMedication] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [priority, setPriority] = useState("normal");
  const [vitals, setVitals] = useState({
    bp: "",
    sugar: "",
    temp: "",
    pulse: "",
    weight: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!notes.trim() && !diagnosis.trim()) {
      toast({
        title: "Missing Information",
        description: "Please add at least notes or diagnosis",
        variant: "destructive"
      });
      return;
    }

    const newNotes = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      doctorId: localStorage.getItem("rememberedUser") || "HSP001",
      notes: notes.trim(),
      diagnosis: diagnosis.trim(),
      treatment: treatment.trim(),
      medication: medication.trim(),
      followUp: followUp.trim(),
      priority,
      vitals: {
        bp: vitals.bp.trim(),
        sugar: vitals.sugar.trim(),
        temp: vitals.temp.trim(),
        pulse: vitals.pulse.trim(),
        weight: vitals.weight.trim()
      }
    };

    onNotesAdded(patient.id, newNotes);
    
    toast({
      title: "Notes Added Successfully",
      description: `Medical notes updated for ${patient.name}`,
    });

    // Reset form and close dialog
    setNotes("");
    setDiagnosis("");
    setTreatment("");
    setMedication("");
    setFollowUp("");
    setPriority("normal");
    setVitals({
      bp: "",
      sugar: "",
      temp: "",
      pulse: "",
      weight: ""
    });
    setOpen(false);
  };

  const handleVitalChange = (field: string, value: string) => {
    setVitals(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Add Notes
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Medical Notes - {patient.name}</DialogTitle>
          <DialogDescription>
            Add medical observations, diagnosis, and treatment plan for Athidi ID: {patient.id}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Priority Level */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priority Level</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="amber">Watch List (Amber)</SelectItem>
                <SelectItem value="red">Critical (Red Flag)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Vital Signs */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Vital Signs</Label>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bp">Blood Pressure</Label>
                <Input
                  id="bp"
                  value={vitals.bp}
                  onChange={(e) => handleVitalChange("bp", e.target.value)}
                  placeholder="120/80"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sugar">Blood Sugar</Label>
                <Input
                  id="sugar"
                  value={vitals.sugar}
                  onChange={(e) => handleVitalChange("sugar", e.target.value)}
                  placeholder="95 mg/dL"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temp">Temperature</Label>
                <Input
                  id="temp"
                  value={vitals.temp}
                  onChange={(e) => handleVitalChange("temp", e.target.value)}
                  placeholder="98.6°F"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pulse">Pulse Rate</Label>
                <Input
                  id="pulse"
                  value={vitals.pulse}
                  onChange={(e) => handleVitalChange("pulse", e.target.value)}
                  placeholder="72 bpm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  value={vitals.weight}
                  onChange={(e) => handleVitalChange("weight", e.target.value)}
                  placeholder="70 kg"
                />
              </div>
            </div>
          </div>

          {/* Clinical Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Clinical Observations</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Document patient's condition, symptoms, and clinical observations..."
              rows={4}
            />
          </div>

          {/* Diagnosis */}
          <div className="space-y-2">
            <Label htmlFor="diagnosis">Diagnosis</Label>
            <Textarea
              id="diagnosis"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="Primary and secondary diagnosis..."
              rows={3}
            />
          </div>

          {/* Treatment Plan */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="treatment">Treatment Plan</Label>
              <Textarea
                id="treatment"
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                placeholder="Recommended treatments and procedures..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medication">Medications</Label>
              <Textarea
                id="medication"
                value={medication}
                onChange={(e) => setMedication(e.target.value)}
                placeholder="Prescribed medications with dosage..."
                rows={3}
              />
            </div>
          </div>

          {/* Follow-up */}
          <div className="space-y-2">
            <Label htmlFor="followUp">Follow-up Instructions</Label>
            <Textarea
              id="followUp"
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              placeholder="Next appointment schedule and follow-up care instructions..."
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 bg-medical-green hover:bg-medical-green/90">
              Save Medical Notes
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

export default DoctorNotes;