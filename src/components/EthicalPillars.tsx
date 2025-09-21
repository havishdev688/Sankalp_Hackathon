import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, Settings, Heart, ArrowRight } from "lucide-react";

const EthicalPillars = () => {
  const pillars = [
    {
      icon: Eye,
      title: "Radical Transparency",
      description: "Every cost, every term, every renewal date clearly communicated",
      features: [
        "Upfront pricing with no hidden fees",
        "Clear renewal schedules and notifications", 
        "Honest feature comparisons",
        "Transparent data usage policies"
      ],
      color: "primary",
      gradient: "bg-gradient-trust"
    },
    {
      icon: Settings,
      title: "Effortless Control",
      description: "Users have complete control over their subscription experience",
      features: [
        "One-click cancellation anytime",
        "Easy plan modifications",
        "Pause subscriptions without penalty",
        "Self-service account management"
      ],
      color: "accent",
      gradient: "bg-accent"
    },
    {
      icon: Heart,
      title: "Value-Based Retention",
      description: "Retain customers through genuine value, not manipulation",
      features: [
        "Focus on delivering real value",
        "No guilt trips or dark patterns",
        "Honest feedback collection",
        "Win-back campaigns based on improvements"
      ],
      color: "warning",
      gradient: "bg-warning"
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold">
            Three Pillars of{" "}
            <span className="bg-gradient-trust bg-clip-text text-transparent">
              Ethical Subscriptions
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our framework is built on three foundational principles that prioritize 
            user trust and long-term customer relationships over short-term gains.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {pillars.map((pillar, index) => (
            <Card key={index} className="p-8 hover:shadow-trust transition-all duration-300 group">
              <div className="space-y-6">
                <div className={`w-16 h-16 rounded-2xl ${pillar.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <pillar.icon className="w-8 h-8 text-white" />
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold">{pillar.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-medium text-primary">Key Features:</div>
                  <ul className="space-y-2">
                    {pillar.features.map((feature, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-3">
                        <ArrowRight className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="bg-gradient-subtle rounded-2xl p-12 text-center space-y-6">
          <h3 className="text-3xl font-bold">Ready to Build Trust?</h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Implement these ethical principles in your subscription model and watch 
            customer satisfaction and retention improve naturally.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="hero" size="lg">
              Start Implementation Guide
            </Button>
            <Button variant="outline" size="lg">
              View Success Stories
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EthicalPillars;