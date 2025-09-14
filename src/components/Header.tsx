import { Leaf, Globe, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-earth p-2 rounded-xl shadow-earth">
              <Leaf className="h-8 w-8 text-primary-foreground animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">Team Prithvi Core</h1>
              <p className="text-sm text-muted-foreground">AI Crop Intelligence</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#analyze" className="text-foreground hover:text-accent transition-smooth">
              Analyze Farm
            </a>
            <a href="#features" className="text-foreground hover:text-accent transition-smooth">
              Features
            </a>
            <a href="#results" className="text-foreground hover:text-accent transition-smooth">
              Results
            </a>
          </nav>
          
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-accent" />
            <Button variant="outline" className="text-sm">
              English / हिंदी
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;