import { useState, useRef } from "react";
import { Upload, Camera, Loader, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface SoilAnalyzerProps {
  onAnalysisComplete: (soilType: string, imageUrl: string) => void;
}

const SoilAnalyzer = ({ onAnalysisComplete }: SoilAnalyzerProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [soilResult, setSoilResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const soilTypes = ["Clay", "Sandy", "Loamy", "Silty"];
  
  const analyzeSoilImage = async (file: File) => {
    setIsAnalyzing(true);
    
    // Create image URL for display
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    
    // Simulate AI analysis (in real app, this would call your ML model)
    setTimeout(() => {
      const randomSoilType = soilTypes[Math.floor(Math.random() * soilTypes.length)];
      setSoilResult(randomSoilType);
      setIsAnalyzing(false);
      
      toast({
        title: "Soil Analysis Complete",
        description: `Your soil type has been identified as ${randomSoilType}`,
      });
      
      onAnalysisComplete(randomSoilType, imageUrl);
    }, 3000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        analyzeSoilImage(file);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload an image file (JPG, PNG, etc.)",
          variant: "destructive",
        });
      }
    }
  };

  const getSoilTypeColor = (soilType: string) => {
    const colors = {
      Clay: "bg-red-100 text-red-800 border-red-200",
      Sandy: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Loamy: "bg-green-100 text-green-800 border-green-200",
      Silty: "bg-blue-100 text-blue-800 border-blue-200",
    };
    return colors[soilType as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <section id="analyze" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4">Soil Image Analysis</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Upload an image of your soil for AI-powered texture analysis. Our advanced computer vision model will identify your soil type instantly.
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <Card className="crop-card">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <Camera className="h-6 w-6 text-accent" />
                <span>Soil Texture Analyzer</span>
              </CardTitle>
              <CardDescription>
                Take or upload a clear photo of your soil sample for analysis
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Upload Area */}
              <div
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-accent transition-smooth"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                
                {selectedImage ? (
                  <div className="space-y-4">
                    <img
                      src={selectedImage}
                      alt="Soil sample"
                      className="max-w-full h-48 object-cover rounded-lg mx-auto shadow-earth"
                    />
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-16 w-16 text-muted-foreground mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-foreground">Click to upload soil image</p>
                      <p className="text-sm text-muted-foreground">Or drag and drop your image here</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Analysis Status */}
              {isAnalyzing && (
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-6 text-center">
                  <Loader className="h-8 w-8 text-accent animate-spin mx-auto mb-3" />
                  <p className="text-accent font-medium">Analyzing soil texture...</p>
                  <p className="text-sm text-muted-foreground mt-1">This may take a few moments</p>
                </div>
              )}
              
              {/* Results */}
              {soilResult && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 animate-grow">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-green-800">Analysis Complete</h3>
                  </div>
                  
                  <div className="text-center">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getSoilTypeColor(soilResult)}`}>
                      Soil Type: {soilResult}
                    </span>
                  </div>
                  
                  <div className="mt-4 text-sm text-green-700">
                    <p className="font-medium mb-2">Soil Characteristics:</p>
                    <ul className="space-y-1 text-left">
                      {soilResult === "Clay" && (
                        <>
                          <li>• High water retention</li>
                          <li>• Rich in nutrients</li>
                          <li>• Good for wheat, rice</li>
                        </>
                      )}
                      {soilResult === "Sandy" && (
                        <>
                          <li>• Good drainage</li>
                          <li>• Warms up quickly</li>
                          <li>• Ideal for root vegetables</li>
                        </>
                      )}
                      {soilResult === "Loamy" && (
                        <>
                          <li>• Perfect balance</li>
                          <li>• Excellent for most crops</li>
                          <li>• High fertility potential</li>
                        </>
                      )}
                      {soilResult === "Silty" && (
                        <>
                          <li>• Fine particles</li>
                          <li>• Good water holding</li>
                          <li>• Suitable for leafy crops</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SoilAnalyzer;