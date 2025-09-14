import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SoilAnalyzer from "@/components/SoilAnalyzer";
import CropRecommendations from "@/components/CropRecommendations";

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

  const handleSoilAnalysis = (soil: string, imageUrl: string) => {
    setSoilType(soil);
    setSoilImageUrl(imageUrl);
    // Smooth scroll to results
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <HeroSection onAnalyze={handleAnalyze} />
        <SoilAnalyzer onAnalysisComplete={handleSoilAnalysis} />
        <CropRecommendations farmData={farmData} soilType={soilType} />
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