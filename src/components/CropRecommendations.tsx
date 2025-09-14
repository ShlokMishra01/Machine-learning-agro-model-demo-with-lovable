import { useState, useEffect } from "react";
import { TrendingUp, Droplets, Thermometer, Leaf, Star, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface FarmData {
  latitude: string;
  longitude: string;
  soilN: string;
  soilP: string;
  soilK: string;
  rainfall: string;
  temperature: string;
}

interface CropRecommendation {
  name: string;
  confidence: number;
  expectedYield: number;
  marketPrice: number;
  suitabilityScore: number;
  season: string;
  waterRequirement: "Low" | "Medium" | "High";
  growthPeriod: string;
  reasons: string[];
}

interface CropRecommendationsProps {
  farmData: FarmData | null;
  soilType?: string;
  confidence?: number;
  soilAnalysis?: any;
  language?: 'en' | 'hi';
}

const CropRecommendations = ({ farmData, soilType, confidence = 0, soilAnalysis = null, language = 'en' }: CropRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate AI crop recommendation algorithm
  const generateRecommendations = (data: FarmData, soil?: string) => {
    setIsLoading(true);
    
    // Mock AI recommendation logic based on inputs
    const cropDatabase = [
      {
        name: "Cotton",
        baseYield: 25,
        seasons: ["Kharif"],
        waterReq: "Medium" as const,
        growth: "150-180 days",
        npkPreference: { n: 350, p: 40, k: 250 },
        tempRange: [25, 35],
        soilSuitability: { Clay: 0.9, Sandy: 0.6, Loamy: 0.8, Silty: 0.7 }
      },
      {
        name: "Soybean",
        baseYield: 20,
        seasons: ["Kharif"],
        waterReq: "Medium" as const,
        growth: "90-120 days",
        npkPreference: { n: 300, p: 50, k: 200 },
        tempRange: [20, 30],
        soilSuitability: { Clay: 0.7, Sandy: 0.8, Loamy: 0.9, Silty: 0.8 }
      },
      {
        name: "Wheat",
        baseYield: 30,
        seasons: ["Rabi"],
        waterReq: "Low" as const,
        growth: "120-150 days",
        npkPreference: { n: 400, p: 60, k: 300 },
        tempRange: [15, 25],
        soilSuitability: { Clay: 0.8, Sandy: 0.5, Loamy: 0.9, Silty: 0.7 }
      },
      {
        name: "Maize",
        baseYield: 35,
        seasons: ["Kharif", "Rabi"],
        waterReq: "High" as const,
        growth: "90-120 days",
        npkPreference: { n: 450, p: 70, k: 350 },
        tempRange: [20, 32],
        soilSuitability: { Clay: 0.6, Sandy: 0.7, Loamy: 0.9, Silty: 0.8 }
      }
    ];

    setTimeout(() => {
      const scored = cropDatabase.map(crop => {
        const n = parseFloat(data.soilN);
        const p = parseFloat(data.soilP);
        const k = parseFloat(data.soilK);
        const temp = parseFloat(data.temperature);
        const rainfall = parseFloat(data.rainfall);

        // Calculate suitability scores
        const npkScore = Math.max(0, 1 - (
          Math.abs(n - crop.npkPreference.n) / 500 +
          Math.abs(p - crop.npkPreference.p) / 100 +
          Math.abs(k - crop.npkPreference.k) / 400
        ) / 3);

        const tempScore = temp >= crop.tempRange[0] && temp <= crop.tempRange[1] ? 1 : 
          Math.max(0, 1 - Math.abs(temp - (crop.tempRange[0] + crop.tempRange[1]) / 2) / 20);

        const soilScore = soil ? (crop.soilSuitability[soil as keyof typeof crop.soilSuitability] || 0.5) : 0.7;
        
        const waterScore = rainfall > 100 ? 
          (crop.waterReq === "High" ? 1 : crop.waterReq === "Medium" ? 0.8 : 0.6) :
          (crop.waterReq === "Low" ? 1 : crop.waterReq === "Medium" ? 0.7 : 0.4);

        const overallScore = (npkScore * 0.3 + tempScore * 0.25 + soilScore * 0.25 + waterScore * 0.2);
        
        // Generate reasons
        const reasons = [];
        if (npkScore > 0.7) reasons.push(language === 'hi' ? "इस फसल के लिए इष्टतम पोषक तत्व स्तर" : "Optimal nutrient levels for this crop");
        if (tempScore > 0.8) reasons.push(language === 'hi' ? "आदर्श तापमान स्थितियां" : "Ideal temperature conditions");
        if (soilScore > 0.8) reasons.push(language === 'hi' ? `${soil} मिट्टी इस फसल के लिए उत्कृष्ट है` : `${soil} soil is excellent for this crop`);
        if (waterScore > 0.7) reasons.push(language === 'hi' ? "पानी की आवश्यकताएं स्थानीय परिस्थितियों से मेल खाती हैं" : "Water requirements match local conditions");
        
        return {
          name: crop.name,
          confidence: Math.min(95, Math.max(60, overallScore * 100)),
          expectedYield: crop.baseYield * (0.8 + overallScore * 0.4),
          marketPrice: 4000 + Math.random() * 3000,
          suitabilityScore: overallScore * 100,
          season: crop.seasons[0],
          waterRequirement: crop.waterReq,
          growthPeriod: crop.growth,
          reasons: reasons.length > 0 ? reasons : [language === 'hi' ? "आपके क्षेत्र के लिए उपयुक्त" : "Suitable for your region"]
        };
      }).sort((a, b) => b.confidence - a.confidence);

      setRecommendations(scored);
      setIsLoading(false);
    }, 2000);
  };

  useEffect(() => {
    if (farmData) {
      generateRecommendations(farmData, soilType);
    }
  }, [farmData, soilType]);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return "bg-green-500";
    if (confidence >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getWaterColor = (waterReq: string) => {
    const colors = {
      Low: "bg-blue-100 text-blue-800",
      Medium: "bg-yellow-100 text-yellow-800",
      High: "bg-red-100 text-red-800"
    };
    return colors[waterReq as keyof typeof colors];
  };

  if (!farmData) return null;

  if (isLoading) {
    return (
      <section id="results" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin w-16 h-16 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-primary">
              {language === 'hi' ? 'आपके खेत डेटा का विश्लेषण हो रहा है' : 'Analyzing Your Farm Data'}
            </h2>
            <p className="text-muted-foreground">
              {language === 'hi' 
                ? 'हमारा AI व्यक्तिगत फसल सिफारिशें तैयार कर रहा है...'
                : 'Our AI is generating personalized crop recommendations...'
              }
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="results" className="py-16 bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4">
            {language === 'hi' ? 'एआई फसल सिफारिशें' : 'AI Crop Recommendations'}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {language === 'hi' 
              ? 'आपके खेत की मिट्टी की संरचना, मौसम की स्थिति और स्थान डेटा के आधार पर'
              : "Based on your farm's soil composition, weather conditions, and location data"
            }
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((crop, index) => (
            <Card key={crop.name} className={`crop-card ${index === 0 ? 'pulse-glow' : ''}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Leaf className="h-5 w-5 text-accent" />
                    <span>{crop.name}</span>
                  </CardTitle>
                  {index === 0 && <Badge className="bg-accent text-accent-foreground">Best Match</Badge>}
                </div>
                <CardDescription className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Season: {crop.season}</span>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Confidence Score */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Confidence Score</span>
                    <span className="text-sm font-bold">{crop.confidence.toFixed(0)}%</span>
                  </div>
                  <Progress 
                    value={crop.confidence} 
                    className="h-2"
                  />
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="font-medium">{crop.expectedYield.toFixed(1)} Q/Ha</p>
                      <p className="text-muted-foreground">Expected Yield</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-600" />
                    <div>
                      <p className="font-medium">₹{crop.marketPrice.toFixed(0)}</p>
                      <p className="text-muted-foreground">Market Price</p>
                    </div>
                  </div>
                </div>

                {/* Water Requirement & Growth Period */}
                <div className="flex items-center justify-between">
                  <Badge className={getWaterColor(crop.waterRequirement)}>
                    <Droplets className="h-3 w-3 mr-1" />
                    {crop.waterRequirement} Water
                  </Badge>
                  <Badge variant="outline">
                    <Thermometer className="h-3 w-3 mr-1" />
                    {crop.growthPeriod}
                  </Badge>
                </div>

                {/* Reasons */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Why this crop?</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {crop.reasons.map((reason, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-accent mr-2">•</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Stats */}
        {farmData && (
          <div className="mt-16 max-w-4xl mx-auto">
            <Card className="crop-card">
              <CardHeader>
                <CardTitle className="text-center">Farm Analysis Summary</CardTitle>
                <CardDescription className="text-center">
                  AI-generated insights based on your farm parameters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center space-y-2">
                    <div className="bg-gradient-growth p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                      <Leaf className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold">Soil Health</h3>
                    <p className="text-sm text-muted-foreground">
                      N: {farmData.soilN}ppm, P: {farmData.soilP}ppm, K: {farmData.soilK}ppm
                      {soilType && <><br />Soil Type: {soilType}</>}
                    </p>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <div className="bg-gradient-earth p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                      <Droplets className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold">Climate Data</h3>
                    <p className="text-sm text-muted-foreground">
                      Temperature: {farmData.temperature}°C<br />
                      Rainfall: {farmData.rainfall}mm
                    </p>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <div className="bg-accent p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                      <MapPin className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold">Location</h3>
                    <p className="text-sm text-muted-foreground">
                      Lat: {parseFloat(farmData.latitude).toFixed(3)}°<br />
                      Lon: {parseFloat(farmData.longitude).toFixed(3)}°
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default CropRecommendations;