import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, TestTube, Pill, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AppointmentFlowProps {
  patient: any;
  onAppointmentComplete: (appointmentData: any) => void;
}

const AppointmentFlow = ({ patient, onAppointmentComplete }: AppointmentFlowProps) => {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [otherSymptoms, setOtherSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [sampleOrdered, setSampleOrdered] = useState(false);
  const [notifiableDisease, setNotifiableDisease] = useState(false);
  const [prescription, setPrescription] = useState("");
  const [followUp, setFollowUp] = useState("");
  const { toast } = useToast();

  const symptomOptions = [
    "Fever", "Cough", "Rash", "Body Pain", "Diarrhoea",
    "Loss of Appetite", "Weakness", "Headache", "Breathlessness", 
    "Vomiting", "Dizziness"
  ];

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    if (checked) {
      setSymptoms(prev => [...prev, symptom]);
    } else {
      setSymptoms(prev => prev.filter(s => s !== symptom));
    }
  };

  const handleSubmit = () => {
    const appointmentData = {
      patientId: patient.id,
      symptoms: [...symptoms, ...(otherSymptoms ? [otherSymptoms] : [])],
      diagnosis,
      sampleOrdered,
      notifiableDisease,
      prescription,
      followUp,
      timestamp: new Date().toISOString(),
    };

    onAppointmentComplete(appointmentData);
    
    toast({
      title: "Appointment Completed",
      description: `Medical assessment for ${patient.name} has been recorded.`,
    });

    // Reset form
    setSymptoms([]);
    setOtherSymptoms("");
    setDiagnosis("");
    setSampleOrdered(false);
    setNotifiableDisease(false);
    setPrescription("");
    setFollowUp("");
  };

  if (!patient) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Select a patient to begin appointment flow</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          New Appointment - {patient.name}
        </CardTitle>
        <CardDescription>
          Complete medical assessment and treatment documentation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="assessment" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="assessment">Clinical Assessment</TabsTrigger>
            <TabsTrigger value="laboratory">Lab & Notification</TabsTrigger>
            <TabsTrigger value="treatment">Treatment & Follow-up</TabsTrigger>
          </TabsList>

          <TabsContent value="assessment" className="space-y-6">
            {/* Symptoms */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Symptoms Reported</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {symptomOptions.map((symptom) => (
                  <div key={symptom} className="flex items-center space-x-2">
                    <Checkbox
                      id={symptom}
                      checked={symptoms.includes(symptom)}
                      onCheckedChange={(checked) => handleSymptomChange(symptom, checked as boolean)}
                    />
                    <Label htmlFor={symptom} className="text-sm">{symptom}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Other Symptoms */}
            <div className="space-y-2">
              <Label htmlFor="otherSymptoms">Other Symptoms</Label>
              <Textarea
                id="otherSymptoms"
                placeholder="Describe any additional symptoms not listed above..."
                value={otherSymptoms}
                onChange={(e) => setOtherSymptoms(e.target.value)}
                rows={3}
              />
            </div>

            {/* Provisional Diagnosis */}
            <div className="space-y-2">
              <Label htmlFor="diagnosis">Provisional Diagnosis</Label>
              <Textarea
                id="diagnosis"
                placeholder="Enter your provisional diagnosis..."
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                rows={3}
              />
            </div>
          </TabsContent>

          <TabsContent value="laboratory" className="space-y-6">
            {/* Sample Testing */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <TestTube className="h-5 w-5 text-medical-green" />
                  <div>
                    <Label className="text-base font-medium">Sample Ordered for Testing</Label>
                    <p className="text-sm text-muted-foreground">Order laboratory tests for this patient</p>
                  </div>
                </div>
                <Switch checked={sampleOrdered} onCheckedChange={setSampleOrdered} />
              </div>

              {sampleOrdered && (
                <div className="ml-8 space-y-2">
                  <Label>Test Details</Label>
                  <Input placeholder="Specify tests ordered (e.g., Blood work, Urine analysis)" />
                </div>
              )}
            </div>

            {/* Notifiable Disease */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label className="text-base font-medium">Notifiable Disease?</Label>
                  <p className="text-sm text-muted-foreground">Trigger DHO/IHIP alert if applicable</p>
                </div>
                <Switch checked={notifiableDisease} onCheckedChange={setNotifiableDisease} />
              </div>

              {notifiableDisease && (
                <div className="p-3 bg-warning-amber-light border border-warning-amber/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-warning-amber text-warning-amber-foreground">
                      Alert Triggered
                    </Badge>
                    <span className="text-sm">DHO/IHIP will be notified automatically</span>
                  </div>
                </div>
              )}
            </div>

            {/* Lab Report Upload */}
            <div className="space-y-2">
              <Label>Upload Lab Report</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">PDF, JPG, PNG files only</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="treatment" className="space-y-6">
            {/* Prescription */}
            <div className="space-y-2">
              <Label htmlFor="prescription" className="flex items-center gap-2">
                <Pill className="h-4 w-4" />
                Prescription/Medication
              </Label>
              <Textarea
                id="prescription"
                placeholder="Enter prescribed medications and dosage instructions..."
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                rows={4}
              />
            </div>

            {/* Follow-up */}
            <div className="space-y-2">
              <Label htmlFor="followUp">Follow-up Instructions</Label>
              <Textarea
                id="followUp"
                placeholder="Enter follow-up care instructions and next visit recommendations..."
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
                rows={4}
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleSubmit}
                className="bg-medical-green hover:bg-medical-green/90 flex-1"
              >
                Complete Appointment
              </Button>
              <Button variant="outline">
                Save as Draft
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AppointmentFlow;