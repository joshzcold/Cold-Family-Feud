import { Info } from "lucide-react";
import { useState } from "react";

const InfoTooltip = ({ message }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <Info
        className="w-5 h-5 text-secondary-900 transition-colors hover:text-secondary-700"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      />
      {isVisible && (
        <div 
          className="absolute z-50 w-96 p-2 text-sm text-foreground bg-background rounded-md shadow-lg border border-secondary-200 -left-28 top-8 animate-in fade-in duration-200"
          role="tooltip"
        >
          <div className="absolute -top-2 left-1/2 -ml-1 w-2 h-2 bg-background border-l border-t border-secondary-200 transform rotate-45" />
          {message}
        </div>
      )}
    </div>
  );
};

export default InfoTooltip;
