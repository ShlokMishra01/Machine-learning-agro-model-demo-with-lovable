import { useState, useEffect } from "react";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface VoiceAssistantProps {
  onVoiceCommand: (command: string) => void;
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
}

const VoiceAssistant = ({ 
  onVoiceCommand, 
  isListening, 
  setIsListening, 
  language, 
  setLanguage 
}: VoiceAssistantProps) => {
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastCommand, setLastCommand] = useState("");

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      
      recognitionInstance.onresult = (event) => {
        const last = event.results.length - 1;
        const command = event.results[last][0].transcript;
        
        if (event.results[last].isFinal) {
          setLastCommand(command);
          onVoiceCommand(command);
          setIsListening(false);
        }
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: language === 'hi' ? "वॉइस एरर" : "Voice Error",
          description: language === 'hi' ? "कृपया फिर से कोशिश करें" : "Please try again",
          variant: "destructive",
        });
      };
      
      setRecognition(recognitionInstance);
    }
  }, [language, onVoiceCommand, setIsListening]);

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
      speak(language === 'hi' ? "मैं सुन रहा हूं" : "I'm listening");
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.9;
      
      utterance.onend = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  const welcomeMessages = {
    en: "Welcome to Team Prithvi Core AI Assistant! I can help you with crop recommendations based on your farm data.",
    hi: "टीम पृथ्वी कोर एआई असिस्टेंट में आपका स्वागत है! मैं आपके खेत के डेटा के आधार पर फसल की सिफारिशें दे सकता हूं।"
  };

  return (
    <Card className="crop-card">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2">
          <Volume2 className="h-6 w-6 text-accent" />
          <span>{language === 'hi' ? "आवाज सहायक" : "Voice Assistant"}</span>
        </CardTitle>
        <CardDescription>
          {language === 'hi' 
            ? "आवाज कमांड के लिए माइक बटन दबाएं" 
            : "Press the mic button for voice commands"
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Language Toggle */}
        <div className="flex justify-center space-x-2">
          <Button
            variant={language === 'en' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLanguage('en')}
            className="transition-smooth"
          >
            English
          </Button>
          <Button
            variant={language === 'hi' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLanguage('hi')}
            className="transition-smooth"
          >
            हिंदी
          </Button>
        </div>

        {/* Voice Controls */}
        <div className="flex justify-center space-x-4">
          <Button
            variant={isListening ? "destructive" : "default"}
            size="lg"
            onClick={isListening ? stopListening : startListening}
            className={`transition-smooth ${isListening ? 'pulse-glow' : ''}`}
            disabled={isSpeaking}
          >
            {isListening ? (
              <>
                <MicOff className="h-5 w-5 mr-2" />
                {language === 'hi' ? "रोकें" : "Stop"}
              </>
            ) : (
              <>
                <Mic className="h-5 w-5 mr-2" />
                {language === 'hi' ? "सुनें" : "Listen"}
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => speak(welcomeMessages[language])}
            disabled={isSpeaking}
            className="transition-smooth"
          >
            {isSpeaking ? (
              <>
                <VolumeX className="h-5 w-5 mr-2" />
                {language === 'hi' ? "बोल रहा है..." : "Speaking..."}
              </>
            ) : (
              <>
                <Volume2 className="h-5 w-5 mr-2" />
                {language === 'hi' ? "परिचय" : "Intro"}
              </>
            )}
          </Button>
        </div>

        {/* Status */}
        {isListening && (
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 text-center animate-pulse">
            <p className="text-accent font-medium">
              {language === 'hi' ? "🎤 सुन रहा हूं..." : "🎤 Listening..."}
            </p>
          </div>
        )}

        {/* Last Command */}
        {lastCommand && (
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">
              {language === 'hi' ? "अंतिम कमांड:" : "Last Command:"}
            </p>
            <p className="font-medium">{lastCommand}</p>
          </div>
        )}

        {/* Voice Commands Help */}
        <div className="text-sm text-muted-foreground space-y-1">
          <p className="font-medium">
            {language === 'hi' ? "आवाज कमांड उदाहरण:" : "Voice Command Examples:"}
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            {language === 'hi' ? (
              <>
                <li>"मिट्टी का विश्लेषण करें"</li>
                <li>"फसल की सिफारिश दें"</li>
                <li>"मार्केट प्राइस बताएं"</li>
              </>
            ) : (
              <>
                <li>"Analyze soil"</li>
                <li>"Recommend crops"</li>
                <li>"Show market prices"</li>
              </>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceAssistant;