import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, AlertTriangle, CheckCircle, Eye, DollarSign } from "lucide-react";

const PatternComparison = () => {
  const patterns = [
    {
      title: "Subscription Pricing",
      dark: {
        title: "Hidden Auto-Renewal",
        description: "Buried in fine print, charges appear without warning",
        example: "FREE TRIAL*",
        subtext: "*Auto-renews at $29.99/month after 7 days",
        icon: AlertTriangle,
        issues: ["Hidden costs", "Automatic billing", "No clear warning"]
      },
      ethical: {
        title: "Transparent Pricing",
        description: "Clear, upfront pricing with explicit renewal terms",
        example: "7-Day Free Trial",
        subtext: "Then $29.99/month. Cancel anytime before renewal.",
        icon: CheckCircle,
        benefits: ["Clear pricing", "Explicit terms", "Easy to understand"]
      }
    },
    {
      title: "Cancellation Process",
      dark: {
        title: "Maze of Confusion",
        description: "Hidden cancel options, multiple steps, retention tricks",
        example: "Are you sure you want to lose all these benefits?",
        subtext: "This action cannot be undone and you'll lose premium features",
        icon: X,
        issues: ["Hidden options", "Guilt trips", "Complex process"]
      },
      ethical: {
        title: "One-Click Cancel",
        description: "Simple, straightforward cancellation process",
        example: "Cancel Subscription",
        subtext: "You can reactivate anytime. No questions asked.",
        icon: CheckCircle,
        benefits: ["Simple process", "No guilt trips", "Easy reactivation"]
      }
    },
    {
      title: "Feature Access",
      dark: {
        title: "Locked Content Trap",
        description: "Features become unavailable without clear explanation",
        example: "Unlock Premium Features",
        subtext: "Continue with limited functionality or upgrade now",
        icon: DollarSign,
        issues: ["Unclear limitations", "Forced upgrades", "Feature hostaging"]
      },
      ethical: {
        title: "Clear Feature Tiers",
        description: "Transparent feature breakdown with clear value proposition",
        example: "Compare Plans",
        subtext: "See exactly what's included in each tier",
        icon: Eye,
        benefits: ["Clear boundaries", "Fair access", "Value transparency"]
      }
    }
  ];

  return (
    <section className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold">Dark Patterns vs Ethical Design</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See the stark difference between manipulative dark patterns and ethical, 
            user-first design approaches.
          </p>
        </div>

        <div className="space-y-12">
          {patterns.map((pattern, index) => (
            <div key={index} className="grid lg:grid-cols-2 gap-8">
              {/* Dark Pattern */}
              <Card className="p-8 border-destructive/20 bg-destructive/5 hover:shadow-lg transition-all">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                      <pattern.dark.icon className="w-5 h-5 text-destructive" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-destructive">
                        ❌ {pattern.dark.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{pattern.title}</p>
                    </div>
                  </div>

                  <p className="text-muted-foreground">{pattern.dark.description}</p>

                  <div className="bg-background/50 rounded-lg p-4 border border-destructive/20">
                    <div className="font-medium mb-1">{pattern.dark.example}</div>
                    <div className="text-xs text-muted-foreground">{pattern.dark.subtext}</div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium text-destructive">Problems:</div>
                    <ul className="space-y-1">
                      {pattern.dark.issues.map((issue, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                          <X className="w-3 h-3 text-destructive" />
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Ethical Pattern */}
              <Card className="p-8 border-accent/20 bg-accent/5 hover:shadow-lg transition-all">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <pattern.ethical.icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-accent">
                        ✅ {pattern.ethical.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{pattern.title}</p>
                    </div>
                  </div>

                  <p className="text-muted-foreground">{pattern.ethical.description}</p>

                  <div className="bg-background/50 rounded-lg p-4 border border-accent/20">
                    <div className="font-medium mb-1">{pattern.ethical.example}</div>
                    <div className="text-xs text-muted-foreground">{pattern.ethical.subtext}</div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium text-accent">Benefits:</div>
                    <ul className="space-y-1">
                      {pattern.ethical.benefits.map((benefit, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-accent" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button variant="hero" size="lg">
            Implement Ethical Patterns
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PatternComparison;