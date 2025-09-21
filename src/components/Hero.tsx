import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, Zap, Download, Eye, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-orange-500/5 to-yellow-500/5"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium">
                <AlertTriangle className="w-4 h-4" />
                Dark Pattern Protection
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Shield Yourself from{" "}
                <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  Deceptive Subscriptions
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Real-time protection against hidden costs, forced auto-renewals, and misleading language. 
                Get instant warnings and escape subscription traps with our powerful tools.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white" asChild>
                <Link to="/protection">
                  <Shield className="w-5 h-5 mr-2" />
                  Activate Protection
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/cancellation-assistant">
                  <Zap className="w-5 h-5 mr-2" />
                  Cancel Subscriptions
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-red-600">Real-time</div>
                <div className="text-sm text-gray-600">Protection</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-orange-600">Instant</div>
                <div className="text-sm text-gray-600">Warnings</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-yellow-600">Easy</div>
                <div className="text-sm text-gray-600">Cancellation</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white p-8">
              {/* Browser mockup showing dark pattern detection */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="ml-2">subscription-trap.com</span>
                </div>
                
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  
                  {/* Dark pattern warning overlay */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2 text-red-800">
                      <AlertCircle className="w-4 h-4" />
                      <span className="font-semibold text-sm">Dark Pattern Detected!</span>
                    </div>
                    <p className="text-xs text-red-700">
                      Hidden auto-renewal detected. This subscription will charge you automatically.
                    </p>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white text-xs">
                      Block This Site
                    </Button>
                  </div>
                  
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
            
            {/* Floating protection indicators */}
            <div className="absolute -top-4 -right-4 bg-red-500 text-white px-4 py-2 rounded-xl shadow-lg">
              <Shield className="w-5 h-5 inline mr-2" />
              Protected
            </div>
            <div className="absolute -bottom-4 -left-4 bg-green-500 text-white px-4 py-2 rounded-xl shadow-lg">
              <Download className="w-5 h-5 inline mr-2" />
              Extension Ready
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;