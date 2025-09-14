import { useState, useEffect } from "react";
import { TrendingUp, BarChart3, PieChart, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface VisualizationProps {
  farmData: FarmData | null;
  soilType: string;
  recommendedCrop: string;
  confidence: number;
  language: 'en' | 'hi';
}

const AdvancedVisualizations = ({ 
  farmData, 
  soilType, 
  recommendedCrop, 
  confidence,
  language 
}: VisualizationProps) => {
  const [radarData, setRadarData] = useState<number[]>([]);
  const [marketTrends, setMarketTrends] = useState<any[]>([]);

  useEffect(() => {
    if (farmData) {
      // Generate radar chart data (NPK analysis)
      const n = parseFloat(farmData.soilN) || 0;
      const p = parseFloat(farmData.soilP) || 0;
      const k = parseFloat(farmData.soilK) || 0;
      
      // Normalize to 0-100 scale
      const normalizedN = Math.min((n / 500) * 100, 100);
      const normalizedP = Math.min((p / 60) * 100, 100);
      const normalizedK = Math.min((k / 400) * 100, 100);
      
      setRadarData([normalizedN, normalizedP, normalizedK]);

      // Generate mock market trends
      const trends = Array.from({ length: 12 }, (_, i) => ({
        month: new Date(2024, i).toLocaleString('default', { month: 'short' }),
        price: 4000 + Math.random() * 2000 + Math.sin(i / 2) * 1000,
        demand: 50 + Math.random() * 40 + Math.cos(i / 3) * 20
      }));
      setMarketTrends(trends);
    }
  }, [farmData]);

  const getNutrientStatus = (value: number) => {
    if (value < 30) return { status: language === 'hi' ? 'कम' : 'Low', color: 'bg-red-500', textColor: 'text-red-700' };
    if (value < 70) return { status: language === 'hi' ? 'मध्यम' : 'Medium', color: 'bg-yellow-500', textColor: 'text-yellow-700' };
    return { status: language === 'hi' ? 'उच्च' : 'High', color: 'bg-green-500', textColor: 'text-green-700' };
  };

  const RadarChart = ({ data }: { data: number[] }) => {
    const labels = ['N', 'P', 'K'];
    const size = 200;
    const center = size / 2;
    const radius = 80;

    const points = data.map((value, index) => {
      const angle = (index * 2 * Math.PI) / 3 - Math.PI / 2;
      const r = (value / 100) * radius;
      return {
        x: center + r * Math.cos(angle),
        y: center + r * Math.sin(angle)
      };
    });

    const gridLevels = [20, 40, 60, 80, 100];
    const gridPoints = gridLevels.map(level => 
      Array.from({ length: 3 }, (_, index) => {
        const angle = (index * 2 * Math.PI) / 3 - Math.PI / 2;
        const r = (level / 100) * radius;
        return {
          x: center + r * Math.cos(angle),
          y: center + r * Math.sin(angle)
        };
      })
    );

    return (
      <div className="flex flex-col items-center">
        <svg width={size} height={size} className="mb-4">
          {/* Grid */}
          {gridPoints.map((levelPoints, levelIndex) => (
            <polygon
              key={levelIndex}
              points={levelPoints.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="1"
              opacity={0.3}
            />
          ))}
          
          {/* Axes */}
          {labels.map((_, index) => {
            const angle = (index * 2 * Math.PI) / 3 - Math.PI / 2;
            const endX = center + radius * Math.cos(angle);
            const endY = center + radius * Math.sin(angle);
            return (
              <line
                key={index}
                x1={center}
                y1={center}
                x2={endX}
                y2={endY}
                stroke="hsl(var(--border))"
                strokeWidth="1"
                opacity={0.5}
              />
            );
          })}
          
          {/* Data polygon */}
          <polygon
            points={points.map(p => `${p.x},${p.y}`).join(' ')}
            fill="hsl(var(--accent) / 0.3)"
            stroke="hsl(var(--accent))"
            strokeWidth="2"
          />
          
          {/* Data points */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="hsl(var(--accent))"
            />
          ))}
          
          {/* Labels */}
          {labels.map((label, index) => {
            const angle = (index * 2 * Math.PI) / 3 - Math.PI / 2;
            const labelX = center + (radius + 20) * Math.cos(angle);
            const labelY = center + (radius + 20) * Math.sin(angle);
            return (
              <text
                key={index}
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-sm font-semibold fill-foreground"
              >
                {label}
              </text>
            );
          })}
        </svg>
        
        {/* Legend */}
        <div className="grid grid-cols-3 gap-4 w-full">
          {['N', 'P', 'K'].map((nutrient, index) => {
            const value = radarData[index] || 0;
            const status = getNutrientStatus(value);
            return (
              <div key={nutrient} className="text-center">
                <div className="text-lg font-bold">{nutrient}</div>
                <div className={`text-sm ${status.textColor}`}>{status.status}</div>
                <div className="text-xs text-muted-foreground">{value.toFixed(0)}%</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (!farmData) {
    return (
      <Card className="crop-card">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <BarChart3 className="h-6 w-6 text-accent" />
            <span>{language === 'hi' ? "विश्लेषण रिपोर्ट" : "Analysis Report"}</span>
          </CardTitle>
          <CardDescription>
            {language === 'hi' 
              ? "पहले अपना खेत डेटा दर्ज करें" 
              : "Please enter your farm data first"
            }
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="crop-card">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <BarChart3 className="h-6 w-6 text-accent" />
            <span>{language === 'hi' ? "उन्नत विश्लेषण रिपोर्ट" : "Advanced Analysis Report"}</span>
          </CardTitle>
          <CardDescription>
            {language === 'hi' 
              ? "आपके खेत का विस्तृत विश्लेषण और सिफारिशें" 
              : "Detailed analysis and recommendations for your farm"
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="nutrients" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="nutrients">
                {language === 'hi' ? 'पोषक तत्व' : 'Nutrients'}
              </TabsTrigger>
              <TabsTrigger value="yield">
                {language === 'hi' ? 'उत्पादन' : 'Yield'}
              </TabsTrigger>
              <TabsTrigger value="market">
                {language === 'hi' ? 'बाजार' : 'Market'}
              </TabsTrigger>
              <TabsTrigger value="location">
                {language === 'hi' ? 'स्थान' : 'Location'}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="nutrients" className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">
                  {language === 'hi' ? 'मिट्टी पोषक तत्व विश्लेषण' : 'Soil Nutrient Analysis'}
                </h3>
                <RadarChart data={radarData} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'Nitrogen (N)', value: radarData[0] || 0, ideal: '300-400 ppm' },
                  { name: 'Phosphorus (P)', value: radarData[1] || 0, ideal: '30-50 ppm' },
                  { name: 'Potassium (K)', value: radarData[2] || 0, ideal: '200-350 ppm' }
                ].map((nutrient, index) => {
                  const status = getNutrientStatus(nutrient.value);
                  return (
                    <div key={index} className="bg-muted/30 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">{nutrient.name}</h4>
                      <Progress value={nutrient.value} className="mb-2" />
                      <div className="flex justify-between text-sm">
                        <span className={status.textColor}>{status.status}</span>
                        <span className="text-muted-foreground">{nutrient.ideal}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="yield" className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">
                  {language === 'hi' ? 'अपेक्षित उत्पादन' : 'Expected Yield'}
                </h3>
                <div className="bg-gradient-growth rounded-lg p-6 text-white">
                  <div className="text-3xl font-bold mb-2">
                    {(15 + Math.random() * 10).toFixed(1)} qtl/ha
                  </div>
                  <div className="text-lg">
                    {recommendedCrop || (language === 'hi' ? 'अनुशंसित फसल' : 'Recommended Crop')}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-accent">{confidence}%</div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'hi' ? 'विश्वास स्कोर' : 'Confidence Score'}
                  </div>
                </div>
                <div className="bg-muted/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary">
                    {(Math.random() * 30 + 70).toFixed(0)}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'hi' ? 'सफलता दर' : 'Success Rate'}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="market" className="space-y-4">
              <h3 className="text-xl font-semibold text-center mb-4">
                {language === 'hi' ? 'बाजार रुझान' : 'Market Trends'}
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-muted/30 rounded-lg p-4 text-center">
                  <div className="text-lg font-bold text-green-600">₹{(5000 + Math.random() * 1000).toFixed(0)}</div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'hi' ? 'वर्तमान मूल्य/क्विंटल' : 'Current Price/qtl'}
                  </div>
                </div>
                <div className="bg-muted/30 rounded-lg p-4 text-center">
                  <div className="text-lg font-bold text-blue-600">+{(Math.random() * 10 + 5).toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'hi' ? 'वार्षिक वृद्धि' : 'Annual Growth'}
                  </div>
                </div>
                <div className="bg-muted/30 rounded-lg p-4 text-center">
                  <div className="text-lg font-bold text-purple-600">{(Math.random() * 20 + 80).toFixed(0)}%</div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'hi' ? 'मांग स्तर' : 'Demand Level'}
                  </div>
                </div>
                <div className="bg-muted/30 rounded-lg p-4 text-center">
                  <div className="text-lg font-bold text-orange-600">{Math.floor(Math.random() * 5 + 3)}</div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'hi' ? 'महीने तक' : 'Months Ahead'}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="location" className="space-y-4">
              <h3 className="text-xl font-semibold text-center mb-4">
                {language === 'hi' ? 'स्थान विश्लेषण' : 'Location Analysis'}
              </h3>
              
              <div className="bg-muted/30 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="h-5 w-5 text-accent" />
                  <span className="font-semibold">
                    {language === 'hi' ? 'खेत निर्देशांक' : 'Farm Coordinates'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {language === 'hi' ? 'अक्षांश' : 'Latitude'}
                    </div>
                    <div className="font-mono">{farmData.latitude}°</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {language === 'hi' ? 'देशांतर' : 'Longitude'}
                    </div>
                    <div className="font-mono">{farmData.longitude}°</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">
                    {language === 'hi' ? 'जलवायु क्षेत्र' : 'Climate Zone'}
                  </h4>
                  <p className="text-muted-foreground">
                    {language === 'hi' ? 'उप-उष्णकटिबंधीय' : 'Sub-tropical'}
                  </p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">
                    {language === 'hi' ? 'मिट्टी प्रकार' : 'Soil Type'}
                  </h4>
                  <p className="text-muted-foreground">{soilType || 'Not analyzed'}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedVisualizations;