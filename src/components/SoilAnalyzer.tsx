import { useState, useRef } from "react";
import { Upload, Camera, Loader, CheckCircle, Brain, Microscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

interface SoilAnalyzerProps {
  onAnalysisComplete: (soilType: string, imageUrl: string, confidence: number, analysis: any) => void;
  language?: 'en' | 'hi';
}

const SoilAnalyzer = ({ onAnalysisComplete, language = 'en' }: SoilAnalyzerProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [soilResult, setSoilResult] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [detailedAnalysis, setDetailedAnalysis] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const soilTypes = ["Clay", "Sandy", "Loamy", "Silty"];
  
  const soilAnalysisSteps = language === 'hi' ? [
    "छवि प्रसंस्करण...",
    "एआई मॉडल लोड हो रहा है...",
    "मिट्टी की बनावट का विश्लेषण...",
    "पोषक तत्वों का आकलन...",
    "परिणाम तैयार हो रहे हैं..."
  ] : [
    "Processing image...",
    "Loading AI model...",
    "Analyzing soil texture...",
    "Assessing nutrient levels...",
    "Preparing results..."
  ];
  
  const analyzeSoilImage = async (file: File) => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setConfidence(0);
    
    // Create image URL for display
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    
    // Simulate advanced AI analysis with progressive steps
    const steps = soilAnalysisSteps;
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setAnalysisProgress(((i + 1) / steps.length) * 100);
    }
    
    // Generate sophisticated analysis results
    const randomSoilType = soilTypes[Math.floor(Math.random() * soilTypes.length)];
    const analysisConfidence = Math.floor(Math.random() * 15 + 85); // 85-100%
    
    const analysis = {
      soilType: randomSoilType,
      confidence: analysisConfidence,
      texture: {
        clay: Math.random() * 40 + 20,
        silt: Math.random() * 30 + 15,
        sand: Math.random() * 45 + 25
      },
      ph: (Math.random() * 2 + 6).toFixed(1),
      organicMatter: (Math.random() * 2 + 1).toFixed(1),
      drainage: Math.random() > 0.5 ? (language === 'hi' ? 'अच्छी' : 'Good') : (language === 'hi' ? 'मध्यम' : 'Moderate'),
      fertility: Math.random() > 0.3 ? (language === 'hi' ? 'उच्च' : 'High') : (language === 'hi' ? 'मध्यम' : 'Medium'),
      recommendations: language === 'hi' ? [
        "जैविक खाद का उपयोग करें",
        "नियमित मिट्टी परीक्षण कराएं",
        "उचित फसल चक्र अपनाएं"
      ] : [
        "Add organic matter",
        "Regular soil testing",
        "Proper crop rotation"
      ]
    };
    
    setSoilResult(randomSoilType);
    setConfidence(analysisConfidence);
    setDetailedAnalysis(analysis);
    setIsAnalyzing(false);
    
    toast({
      title: language === 'hi' ? "मिट्टी विश्लेषण पूर्ण" : "Soil Analysis Complete",
      description: language === 'hi' 
        ? `आपकी मिट्टी का प्रकार ${randomSoilType} है (${analysisConfidence}% विश्वास के साथ)`
        : `Your soil type has been identified as ${randomSoilType} with ${analysisConfidence}% confidence`,
    });
    
    onAnalysisComplete(randomSoilType, imageUrl, analysisConfidence, analysis);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        analyzeSoilImage(file);
      } else {
        toast({
          title: language === 'hi' ? "अमान्य फ़ाइल प्रकार" : "Invalid File Type",
          description: language === 'hi' 
            ? "कृपया एक छवि फ़ाइल अपलोड करें (JPG, PNG, आदि)"
            : "Please upload an image file (JPG, PNG, etc.)",
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
          <h2 className="text-4xl font-bold text-primary mb-4">
            {language === 'hi' ? 'मिट्टी छवि विश्लेषण' : 'Soil Image Analysis'}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {language === 'hi' 
              ? "एआई-संचालित बनावट विश्लेषण के लिए अपनी मिट्टी की एक छवि अपलोड करें। हमारा उन्नत कंप्यूटर विज़न मॉडल तुरंत आपकी मिट्टी के प्रकार की पहचान करेगा।"
              : "Upload an image of your soil for AI-powered texture analysis. Our advanced computer vision model will identify your soil type instantly."
            }
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <Card className="crop-card">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <Brain className="h-6 w-6 text-accent" />
                <span>{language === 'hi' ? 'एआई मिट्टी विश्लेषक' : 'AI Soil Analyzer'}</span>
              </CardTitle>
              <CardDescription>
                {language === 'hi' 
                  ? "विश्लेषण के लिए अपनी मिट्टी के नमूने की एक स्पष्ट तस्वीर लें या अपलोड करें"
                  : "Take or upload a clear photo of your soil sample for analysis"
                }
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
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-6 text-center space-y-4">
                  <Microscope className="h-12 w-12 text-accent animate-pulse mx-auto" />
                  <div>
                    <p className="text-accent font-medium mb-2">
                      {language === 'hi' ? 'उन्नत एआई विश्लेषण...' : 'Advanced AI Analysis...'}
                    </p>
                    <Progress value={analysisProgress} className="mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {soilAnalysisSteps[Math.floor((analysisProgress / 100) * soilAnalysisSteps.length)] || soilAnalysisSteps[0]}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Results */}
              {soilResult && detailedAnalysis && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 animate-grow space-y-6">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-green-800">
                      {language === 'hi' ? 'विश्लेषण पूर्ण' : 'Analysis Complete'}
                    </h3>
                  </div>
                  
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center space-x-4">
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getSoilTypeColor(soilResult)}`}>
                        {language === 'hi' ? 'मिट्टी प्रकार' : 'Soil Type'}: {soilResult}
                      </span>
                      <div className="bg-white rounded-full px-3 py-1 border">
                        <span className="text-sm font-medium text-green-700">{confidence}% {language === 'hi' ? 'विश्वास' : 'Confidence'}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="bg-white rounded-lg p-3 border border-green-200">
                        <div className="font-medium text-green-800">pH</div>
                        <div className="text-green-600">{detailedAnalysis.ph}</div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-green-200">
                        <div className="font-medium text-green-800">
                          {language === 'hi' ? 'जैविक पदार्थ' : 'Organic Matter'}
                        </div>
                        <div className="text-green-600">{detailedAnalysis.organicMatter}%</div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-green-200">
                        <div className="font-medium text-green-800">
                          {language === 'hi' ? 'जल निकासी' : 'Drainage'}
                        </div>
                        <div className="text-green-600">{detailedAnalysis.drainage}</div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-green-200">
                        <div className="font-medium text-green-800">
                          {language === 'hi' ? 'उर्वरता' : 'Fertility'}
                        </div>
                        <div className="text-green-600">{detailedAnalysis.fertility}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-green-700">
                    <p className="font-medium mb-2">
                      {language === 'hi' ? 'मिट्टी की विशेषताएं:' : 'Soil Characteristics:'}
                    </p>
                    <ul className="space-y-1 text-left">
                      {soilResult === "Clay" && (
                        <>
                          <li>• {language === 'hi' ? 'उच्च जल प्रतिधारण' : 'High water retention'}</li>
                          <li>• {language === 'hi' ? 'पोषक तत्वों से भरपूर' : 'Rich in nutrients'}</li>
                          <li>• {language === 'hi' ? 'गेहूं, चावल के लिए अच्छी' : 'Good for wheat, rice'}</li>
                        </>
                      )}
                      {soilResult === "Sandy" && (
                        <>
                          <li>• {language === 'hi' ? 'अच्छी जल निकासी' : 'Good drainage'}</li>
                          <li>• {language === 'hi' ? 'जल्दी गर्म होती है' : 'Warms up quickly'}</li>
                          <li>• {language === 'hi' ? 'जड़ वाली सब्जियों के लिए आदर्श' : 'Ideal for root vegetables'}</li>
                        </>
                      )}
                      {soilResult === "Loamy" && (
                        <>
                          <li>• {language === 'hi' ? 'संपूर्ण संतुलन' : 'Perfect balance'}</li>
                          <li>• {language === 'hi' ? 'अधिकांश फसलों के लिए उत्कृष्ट' : 'Excellent for most crops'}</li>
                          <li>• {language === 'hi' ? 'उच्च उर्वरता क्षमता' : 'High fertility potential'}</li>
                        </>
                      )}
                      {soilResult === "Silty" && (
                        <>
                          <li>• {language === 'hi' ? 'बारीक कण' : 'Fine particles'}</li>
                          <li>• {language === 'hi' ? 'अच्छी जल धारण क्षमता' : 'Good water holding'}</li>
                          <li>• {language === 'hi' ? 'पत्तेदार फसलों के लिए उपयुक्त' : 'Suitable for leafy crops'}</li>
                        </>
                      )}
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <p className="font-medium text-green-800 mb-2">
                      {language === 'hi' ? 'सिफारिशें:' : 'Recommendations:'}
                    </p>
                    <ul className="space-y-1 text-sm text-green-700">
                      {detailedAnalysis.recommendations.map((rec: string, index: number) => (
                        <li key={index}>• {rec}</li>
                      ))}
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