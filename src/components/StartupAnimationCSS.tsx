import { useEffect, useState } from "react";

interface StartupAnimationProps {
  onComplete: () => void;
}

const StartupAnimation = ({ onComplete }: StartupAnimationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Wait for exit animation to complete before calling onComplete
      setTimeout(onComplete, 500);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background to-medical-green-light animate-fade-in">
      <div className="text-center space-y-6 animate-scale-in">
        {/* Logo Container */}
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-medical-green rounded-full flex items-center justify-center shadow-lg">
          <svg 
            className="w-10 h-10 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
        </div>

        {/* App Name */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">
            Dhaara
          </h1>
          <p className="text-lg text-muted-foreground">
            Digital Health Record Management System
          </p>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center">
          <div className="flex space-x-1">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="w-2 h-2 bg-primary rounded-full animate-pulse"
                style={{
                  animationDelay: `${index * 0.2}s`,
                  animationDuration: '1.5s'
                }}
              />
            ))}
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-sm text-muted-foreground">
          Secure healthcare management for Kerala migrants
        </p>
      </div>
    </div>
  );
};

export default StartupAnimation;
