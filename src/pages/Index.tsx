import Hero from "@/components/Hero";
import PatternComparison from "@/components/PatternComparison";
import EthicalPillars from "@/components/EthicalPillars";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  AlertTriangle, 
  Download, 
  Zap, 
  Eye, 
  CheckCircle,
  XCircle,
  DollarSign,
  Clock,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const protectionFeatures = [
    {
      icon: Shield,
      title: "Real-time Protection",
      description: "Get instant warnings when you encounter dark patterns while browsing",
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      icon: AlertTriangle,
      title: "Pattern Detection",
      description: "Automatically detect hidden costs, forced renewals, and misleading language",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      icon: XCircle,
      title: "Cancellation Assistant",
      description: "Step-by-step guides to cancel difficult subscriptions and escape traps",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Download,
      title: "Browser Extension",
      description: "Install our extension for automatic protection on every website you visit",
      color: "text-green-600",
      bgColor: "bg-green-50"
    }
  ];

  const stats = [
    { icon: Users, number: "10,000+", label: "Users Protected" },
    { icon: Shield, number: "50,000+", label: "Patterns Detected" },
    { icon: DollarSign, number: "$2M+", label: "Money Saved" },
    { icon: CheckCircle, number: "95%", label: "Success Rate" }
  ];

  return (
    <main className="min-h-screen">
      <Hero />
      
      {/* Protection Features */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">
              How We Protect You from{" "}
              <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                Deceptive Subscriptions
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive protection system detects and blocks dark patterns in real-time, 
              helping you avoid subscription traps and hidden costs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {protectionFeatures.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-red-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">Get Protected Today</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Don't let deceptive subscriptions drain your wallet. Start protecting yourself now.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Download className="w-6 h-6 text-blue-600" />
                  Install Extension
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Get real-time protection while browsing. Automatically detect and block dark patterns.
                </p>
                <Button className="w-full" size="lg">
                  Download Extension
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Shield className="w-6 h-6 text-green-600" />
                  Activate Protection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Sign up for our web platform and get access to advanced protection features.
                </p>
                <Button className="w-full" size="lg" asChild>
                  <Link to="/protection">Activate Protection</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <XCircle className="w-6 h-6 text-red-600" />
                  Cancel Subscriptions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Use our cancellation assistant to escape difficult subscription traps.
                </p>
                <Button className="w-full" size="lg" asChild>
                  <Link to="/cancellation-assistant">Get Help Canceling</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <PatternComparison />
      <EthicalPillars />
    </main>
  );
};

export default Index;
