import { useState } from "react";
import { MapPin, Cpu, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import heroImage from "@/assets/hero-bg.jpg";

interface FarmData {
  latitude: string;
  longitude: string;
  soilN: string;
  soilP: string;
  soilK: string;
  rainfall: string;
  temperature: string;
}

interface HeroSectionProps {
  onAnalyze: (data: FarmData) => void;
}

const HeroSection = ({ onAnalyze }: HeroSectionProps) => {
  const [formData, setFormData] = useState<FarmData>({
    latitude: "",
    longitude: "",
    soilN: "",
    soilP: "",
    soilK: "",
    rainfall: "",
    temperature: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(formData);
  };

  const handleChange = (field: keyof FarmData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-primary/20 to-accent/30" />
      
      <div className="relative container mx-auto px-4 py-20 mt-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Hero Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                Smart Crop
                <span className="block bg-gradient-to-r from-accent to-primary-glow bg-clip-text text-transparent">
                  Intelligence
                </span>
              </h1>
              <p className="text-xl text-white/90 max-w-2xl">
                Harness the power of AI to optimize your farming decisions. Get personalized crop recommendations based on soil health, weather patterns, and market data.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <div className="flex items-center space-x-2 text-white/80">
                <Cpu className="h-5 w-5 text-accent" />
                <span>AI-Powered Analysis</span>
              </div>
              <div className="flex items-center space-x-2 text-white/80">
                <TrendingUp className="h-5 w-5 text-accent" />
                <span>Yield Optimization</span>
              </div>
              <div className="flex items-center space-x-2 text-white/80">
                <MapPin className="h-5 w-5 text-accent" />
                <span>Location-Specific</span>
              </div>
            </div>
          </div>
          
          {/* Right Column - Analysis Form */}
          <Card className="crop-card animate-grow">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-primary">Analyze Your Farm</CardTitle>
              <CardDescription>
                Enter your farm details for AI-powered crop recommendations
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      placeholder="20.5937"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) => handleChange("latitude", e.target.value)}
                      className="transition-smooth focus:ring-accent"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      placeholder="78.9629"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) => handleChange("longitude", e.target.value)}
                      className="transition-smooth focus:ring-accent"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="soilN">Soil N (ppm)</Label>
                    <Input
                      id="soilN"
                      type="number"
                      placeholder="350"
                      value={formData.soilN}
                      onChange={(e) => handleChange("soilN", e.target.value)}
                      className="transition-smooth focus:ring-accent"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="soilP">Soil P (ppm)</Label>
                    <Input
                      id="soilP"
                      type="number"
                      placeholder="40"
                      value={formData.soilP}
                      onChange={(e) => handleChange("soilP", e.target.value)}
                      className="transition-smooth focus:ring-accent"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="soilK">Soil K (ppm)</Label>
                    <Input
                      id="soilK"
                      type="number"
                      placeholder="250"
                      value={formData.soilK}
                      onChange={(e) => handleChange("soilK", e.target.value)}
                      className="transition-smooth focus:ring-accent"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rainfall">Rainfall (mm)</Label>
                    <Input
                      id="rainfall"
                      type="number"
                      placeholder="85"
                      value={formData.rainfall}
                      onChange={(e) => handleChange("rainfall", e.target.value)}
                      className="transition-smooth focus:ring-accent"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature (°C)</Label>
                    <Input
                      id="temperature"
                      type="number"
                      placeholder="28"
                      value={formData.temperature}
                      onChange={(e) => handleChange("temperature", e.target.value)}
                      className="transition-smooth focus:ring-accent"
                      required
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full hero-button text-lg py-6 mt-6"
                >
                  Get AI Recommendations
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;