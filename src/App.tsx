import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import StartupAnimation from "./components/StartupAnimationCSS";
import Login from "./pages/Login";
import MigrantDashboard from "./pages/MigrantDashboard";
import POCDashboard from "./pages/POCDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import HospitalDashboard from "./pages/HospitalDashboard";
import NotFound from "./pages/NotFound";
import DatabaseTest from "./pages/DatabaseTest"; // Import the new component

const queryClient = new QueryClient();

import { useState } from "react";

const App = () => {
  const [showStartup, setShowStartup] = useState(true);
  const handleStartupComplete = () => setShowStartup(false);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={showStartup ? <StartupAnimation onComplete={handleStartupComplete} /> : <Login />} />
              <Route path="/migrant" element={<MigrantDashboard />} />
              <Route path="/poc" element={<POCDashboard />} />
              <Route path="/doctor" element={<DoctorDashboard />} />
              <Route path="/hospital" element={<HospitalDashboard />} />
              <Route path="/database-test" element={<DatabaseTest />} /> {/* Add this route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;