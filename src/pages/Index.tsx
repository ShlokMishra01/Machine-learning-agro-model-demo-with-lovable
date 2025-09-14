import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SoilAnalyzer from "@/components/SoilAnalyzer";
import CropRecommendations from "@/components/CropRecommendations";
import VoiceAssistant from "@/components/VoiceAssistant";
import AdvancedVisualizations from "@/components/AdvancedVisualizations";

interface FarmData {
  latitude: string;
  longitude: string;
  soilN: string;
  soilP: string;
  soilK: string;
  rainfall: string;
  temperature: string;
}

const Index = () => {
  const [farmData, setFarmData] = useState<FarmData | null>(null);
  const [soilType, setSoilType] = useState<string>("");
  const [soilImageUrl, setSoilImageUrl] = useState<string>("");
  const [soilConfidence, setSoilConfidence] = useState<number>(0);
  const [soilAnalysis, setSoilAnalysis] = useState<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [recommendedCrop, setRecommendedCrop] = useState<string>("");

  const handleAnalyze = (data: FarmData) => {
    setFarmData(data);
    // Smooth scroll to soil analyzer
    setTimeout(() => {
      document.getElementById('analyze')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const handleSoilAnalysis = (soil: string, imageUrl: string, confidence: number, analysis: any) => {
    setSoilType(soil);
    setSoilImageUrl(imageUrl);
    setSoilConfidence(confidence);
    setSoilAnalysis(analysis);
    
    // Generate recommended crop based on soil analysis
    const cropRecommendations = {
      Clay: ['Cotton', 'Wheat', 'Rice'],
      Sandy: ['Groundnut', 'Millet', 'Watermelon'],
      Loamy: ['Soybean', 'Corn', 'Tomato'],
      Silty: ['Lettuce', 'Spinach', 'Cabbage']
    };
    
    const recommendations = cropRecommendations[soil as keyof typeof cropRecommendations] || ['Soybean'];
    setRecommendedCrop(recommendations[0]);
    
    // Smooth scroll to results
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 500);
  };

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('analyze') || lowerCommand.includes('विश्लेषण')) {
      document.getElementById('analyze')?.scrollIntoView({ behavior: 'smooth' });
    } else if (lowerCommand.includes('recommend') || lowerCommand.includes('सिफारिश')) {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    } else if (lowerCommand.includes('help') || lowerCommand.includes('सहायता')) {
      const message = language === 'hi' 
        ? "मैं आपको फसल की सिफारिशें और मिट्टी का विश्लेषण करने में मदद कर सकता हूँ।"
        : "I can help you with crop recommendations and soil analysis.";
      
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
        speechSynthesis.speak(utterance);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <HeroSection onAnalyze={handleAnalyze} />
        
        {/* Voice Assistant Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <VoiceAssistant 
                onVoiceCommand={handleVoiceCommand}
                isListening={isListening}
                setIsListening={setIsListening}
                language={language}
                setLanguage={setLanguage}
              />
            </div>
          </div>
        </section>
        
        <SoilAnalyzer 
          onAnalysisComplete={handleSoilAnalysis} 
          language={language}
        />
        
        {/* Advanced Visualizations */}
        {farmData && soilType && (
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <AdvancedVisualizations 
                farmData={farmData}
                soilType={soilType}
                recommendedCrop={recommendedCrop}
                confidence={soilConfidence}
                language={language}
              />
            </div>
          </section>
        )}
        
        <CropRecommendations 
          farmData={farmData} 
          soilType={soilType}
          confidence={soilConfidence}
          soilAnalysis={soilAnalysis}
          language={language}
        />
      </main>
      
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Team Prithvi Core</h3>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              Empowering farmers with AI-driven insights for sustainable and profitable agriculture. 
              Building the future of farming, one recommendation at a time.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <span>© 2024 Team Prithvi Core</span>
              <span>•</span>
              <span>Powered by Advanced AI</span>
              <span>•</span>
              <span>Made for Indian Farmers</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;