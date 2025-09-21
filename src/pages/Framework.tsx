import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Heart, Eye, CheckCircle, Users, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const Framework = () => {
  const principles = [
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Radical Transparency",
      description: "Users should always know what they're signing up for, how much it costs, and when they'll be charged.",
      examples: [
        "Clear pricing displayed upfront",
        "No hidden fees or surprise charges",
        "Transparent renewal notifications",
        "Easy-to-find subscription details"
      ]
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Effortless Control",  
      description: "Canceling should be as easy as signing up. Users should have complete control over their subscription.",
      examples: [
        "One-click cancellation",
        "Self-service account management",
        "Pause subscription options",
        "Immediate cancellation processing"
      ]
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Value-Based Retention",
      description: "Keep customers through value and satisfaction, not tricks or barriers.",
      examples: [
        "Focus on product improvement",
        "Genuine customer feedback",
        "Fair retention offers",
        "Respect user decisions"
      ]
    }
  ];

  const darkPatterns = [
    {
      name: "Confirmshaming",
      description: "Using guilt or shame to manipulate user decisions",
      example: "Making the cancel button say 'No, I hate saving money'"
    },
    {
      name: "Roach Motel",
      description: "Making it easy to get into a situation but hard to get out",
      example: "Easy signup but hidden cancellation process"
    },
    {
      name: "Friend Spam",
      description: "Requesting access to contacts and spamming them without clear consent",
      example: "Auto-sending invites to all contacts"
    },
    {
      name: "Forced Continuity",
      description: "Charging users for services without clear consent to continue",
      example: "Silent subscription renewals after free trials"
    },
    {
      name: "Bait and Switch",
      description: "Advertising one thing but delivering another",
      example: "Free trial that becomes paid without clear warning"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            The Ethical Subscription{" "}
            <span className="bg-gradient-trust bg-clip-text text-transparent">
              Framework
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A comprehensive guide to building subscription experiences that respect users, build trust, and create sustainable business relationships.
          </p>
        </div>

        {/* Three Pillars */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Three Core Pillars</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {principles.map((principle, index) => (
              <Card key={index} className="shadow-card">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {principle.icon}
                    </div>
                    <CardTitle className="text-xl">{principle.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    {principle.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {principle.examples.map((example, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Common Dark Patterns */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Common Dark Patterns to Avoid</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {darkPatterns.map((pattern, index) => (
              <Card key={index} className="border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">AVOID</Badge>
                    {pattern.name}
                  </CardTitle>
                  <CardDescription>
                    {pattern.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                    <p className="text-sm text-destructive">
                      <strong>Example:</strong> {pattern.example}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Implementation Guide */}
        <section className="mb-16">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Target className="w-6 h-6" />
                Implementation Checklist
              </CardTitle>
              <CardDescription>
                Use this checklist to audit your subscription experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4 text-accent">✅ Transparency Checklist</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Pricing clearly visible before signup</li>
                    <li>• All fees disclosed upfront</li>
                    <li>• Renewal terms clearly stated</li>
                    <li>• Email confirmations for all changes</li>
                    <li>• Clear billing history available</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-4 text-accent">✅ Control Checklist</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Cancel button prominently displayed</li>
                    <li>• No confirmation shaming language</li>
                    <li>• Immediate cancellation processing</li>
                    <li>• No retention dark patterns</li>
                    <li>• Account settings easily accessible</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Community Call to Action */}
        <section className="text-center">
          <Card className="bg-gradient-hero/10">
            <CardContent className="py-12">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Join the Movement</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Help us build a database of ethical and unethical subscription patterns. 
                Together, we can create a more transparent digital economy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/patterns">
                  <Button size="lg" variant="outline">
                    Browse Pattern Database
                  </Button>
                </Link>
                <Link to="/submit">
                  <Button size="lg">
                    Submit a Pattern
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Framework;