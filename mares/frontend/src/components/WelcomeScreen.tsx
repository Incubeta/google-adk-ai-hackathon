import { Button } from "@/components/ui/button";
import { InputForm } from "@/components/InputForm";
import { HowItWorks } from "@/components/HowItWorks";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface WelcomeScreenProps {
  handleSubmit: (query: string, files?: File[]) => void;
  isLoading: boolean;
  onCancel: () => void;
}

export function WelcomeScreen({
  handleSubmit,
  isLoading,
  onCancel,
}: WelcomeScreenProps) {
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  return (
    // This container fills the space provided by its parent layout (e.g., the left panel in a split view)
    // and centers its content (the card) within itself.
    <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-auto relative">

      {/* The "Card" Container */}
      {/* This div now holds the card's styling: background, blur, padding, border, shadow, and hover effect */}
      <div className="w-full max-w-2xl z-10
                      bg-neutral-900/50 backdrop-blur-md
                      p-8 rounded-2xl border border-neutral-700
                      shadow-2xl shadow-black/60
                      transition-all duration-300 hover:border-neutral-600">

        {/* Header section of the card */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
            ✨ MARES 🚀
          </h1>
          <p className="text-lg text-neutral-300 max-w-md mx-auto">
From Vague Idea to Actionable Backlog in Minutes.
MARES is your AI-powered business analyst. It transforms a simple project brief into a complete, developer-ready functional design, ensuring nothing gets missed before you write a single line of code.
          </p>
        </div>

        {/* Input form section of the card */}
        <div className="mt-8">
          <InputForm onSubmit={handleSubmit} isLoading={isLoading} context="homepage" />
          {isLoading && (
            <div className="mt-4 flex justify-center">
              <Button
                variant="outline"
                onClick={onCancel}
                className="text-red-400 hover:text-red-300 hover:bg-red-900/20 border-red-700/50" // Enhanced cancel button
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* How It Works Toggle Button */}
        <div className="mt-6 flex justify-center">
          <Button
            variant="ghost"
            onClick={() => setShowHowItWorks(!showHowItWorks)}
            className="text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50 flex items-center gap-2"
          >
            <span>How It Works</span>
            {showHowItWorks ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* How It Works Section - Collapsible */}
      {showHowItWorks && (
        <div className="w-full max-w-4xl mt-8 z-10 animate-in fade-in slide-in-from-top-5 duration-500">
          <div className="bg-neutral-900/50 backdrop-blur-md p-8 rounded-2xl border border-neutral-700 shadow-2xl shadow-black/60">
            <HowItWorks />
          </div>
        </div>
      )}
    </div>
  );
}
