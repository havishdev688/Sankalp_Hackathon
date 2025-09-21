import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Shield,
  DollarSign,
  Clock,
  Users,
  FileText,
  Play,
  ArrowRight,
  Lightbulb
} from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  example: string;
  warning: string;
  tip: string;
  completed: boolean;
}

interface DarkPatternType {
  id: string;
  name: string;
  description: string;
  icon: any;
  severity: number;
  examples: string[];
  howToAvoid: string[];
  legalRights: string;
}

const Education = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const darkPatternTypes: DarkPatternType[] = [
    {
      id: 'hidden-auto-renewal',
      name: 'Hidden Auto-Renewal',
      description: 'Subscriptions that automatically renew without clear user consent',
      icon: AlertTriangle,
      severity: 4,
      examples: [
        'Pre-checked auto-renewal boxes',
        'Auto-renewal buried in terms and conditions',
        'No clear notification about automatic billing',
        'Difficult to find renewal settings'
      ],
      howToAvoid: [
        'Always look for auto-renewal settings before subscribing',
        'Set calendar reminders for subscription renewals',
        'Use virtual credit cards with spending limits',
        'Read the fine print carefully'
      ],
      legalRights: 'You have the right to cancel auto-renewal and receive clear information about billing cycles.'
    },
    {
      id: 'cancellation-trap',
      name: 'Cancellation Trap',
      description: 'Making it extremely difficult or impossible to cancel subscriptions',
      icon: XCircle,
      severity: 5,
      examples: [
        'No online cancellation option',
        'Requiring phone calls to cancel',
        'Long hold times or unhelpful support',
        'Hidden cancellation links',
        'Multiple confirmation steps'
      ],
      howToAvoid: [
        'Check cancellation process before subscribing',
        'Document all cancellation attempts',
        'Use our cancellation assistant',
        'Contact your bank if necessary',
        'Know your legal rights'
      ],
      legalRights: 'You have the right to cancel subscriptions easily and receive confirmation of cancellation.'
    },
    {
      id: 'hidden-costs',
      name: 'Hidden Costs',
      description: 'Additional fees and charges not clearly disclosed upfront',
      icon: DollarSign,
      severity: 4,
      examples: [
        'Processing fees not mentioned in pricing',
        'Taxes calculated at checkout',
        'Service fees hidden in terms',
        'Currency conversion fees',
        'Premium features auto-added'
      ],
      howToAvoid: [
        'Calculate total cost before subscribing',
        'Look for all fees in the checkout process',
        'Read terms and conditions',
        'Ask for a complete cost breakdown',
        'Use price comparison tools'
      ],
      legalRights: 'You have the right to know all costs upfront before making a purchase.'
    },
    {
      id: 'misleading-language',
      name: 'Misleading Language',
      description: 'Using confusing or deceptive language to mislead users',
      icon: FileText,
      severity: 3,
      examples: [
        '"Free trial" that requires credit card',
        '"Cancel anytime" with hidden restrictions',
        '"Unlimited" with hidden limitations',
        'Confusing pricing tiers',
        'Misleading feature descriptions'
      ],
      howToAvoid: [
        'Read all terms carefully',
        'Ask for clarification if confused',
        'Look for asterisks and fine print',
        'Test the service during trial period',
        'Don\'t trust marketing claims alone'
      ],
      legalRights: 'You have the right to clear, honest information about products and services.'
    },
    {
      id: 'pre-checked-addons',
      name: 'Pre-checked Add-ons',
      description: 'Additional services pre-selected without clear disclosure',
      icon: CheckCircle,
      severity: 3,
      examples: [
        'Insurance automatically added',
        'Premium features pre-selected',
        'Extended warranties included',
        'Additional services bundled',
        'Upsells disguised as features'
      ],
      howToAvoid: [
        'Review all pre-selected options',
        'Uncheck unwanted add-ons',
        'Read what each add-on includes',
        'Calculate total cost with add-ons',
        'Be aware of upsell tactics'
      ],
      legalRights: 'You have the right to choose which additional services you want to purchase.'
    },
    {
      id: 'countdown-pressure',
      name: 'Artificial Time Pressure',
      description: 'Creating false urgency to force quick decisions',
      icon: Clock,
      severity: 2,
      examples: [
        'Countdown timers on offers',
        '"Limited time only" promotions',
        '"Only X left in stock" messages',
        'Expiring discount codes',
        'Flash sale notifications'
      ],
      howToAvoid: [
        'Take your time to evaluate offers',
        'Research the company and service',
        'Don\'t be pressured by timers',
        'Look for similar offers elsewhere',
        'Sleep on major decisions'
      ],
      legalRights: 'You have the right to make informed decisions without artificial pressure.'
    }
  ];

  const tutorialSteps: TutorialStep[] = [
    {
      id: 'step-1',
      title: 'What are Dark Patterns?',
      description: 'Learn the basics of deceptive subscription practices',
      example: 'Dark patterns are design tricks that companies use to manipulate users into making decisions they wouldn\'t normally make.',
      warning: 'These patterns are designed to benefit the company, not the user.',
      tip: 'Always be skeptical of designs that seem too good to be true.',
      completed: completedSteps.includes(0)
    },
    {
      id: 'step-2',
      title: 'Recognizing Hidden Auto-Renewal',
      description: 'Spot when subscriptions will automatically charge you',
      example: 'Look for pre-checked boxes or small text saying "automatically renews" or "recurring billing".',
      warning: 'Auto-renewal can drain your bank account if you forget to cancel.',
      tip: 'Set calendar reminders for subscription renewals.',
      completed: completedSteps.includes(1)
    },
    {
      id: 'step-3',
      title: 'Identifying Hidden Costs',
      description: 'Find additional fees before they surprise you',
      example: 'Check for processing fees, taxes, service charges, or premium add-ons that aren\'t clearly shown.',
      warning: 'Hidden costs can double or triple your expected payment.',
      tip: 'Always calculate the total cost, not just the base price.',
      completed: completedSteps.includes(2)
    },
    {
      id: 'step-4',
      title: 'Escaping Cancellation Traps',
      description: 'Navigate difficult cancellation processes',
      example: 'Some companies hide cancellation options or require phone calls with long wait times.',
      warning: 'Difficult cancellation is often intentional to keep you paying.',
      tip: 'Use our cancellation assistant for step-by-step help.',
      completed: completedSteps.includes(3)
    },
    {
      id: 'step-5',
      title: 'Protecting Yourself',
      description: 'Use tools and strategies to avoid dark patterns',
      example: 'Install our browser extension, use virtual credit cards, and always read terms carefully.',
      warning: 'Dark patterns are constantly evolving, so stay vigilant.',
      tip: 'Report new dark patterns to help protect other users.',
      completed: completedSteps.includes(4)
    }
  ];

  const progress = (completedSteps.length / tutorialSteps.length) * 100;

  const markStepComplete = (stepIndex: number) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex]);
    }
  };

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      markStepComplete(currentStep);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 4) return 'destructive';
    if (severity >= 3) return 'default';
    return 'secondary';
  };

  const getSeverityText = (severity: number) => {
    if (severity >= 4) return 'High Risk';
    if (severity >= 3) return 'Medium Risk';
    return 'Low Risk';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <BookOpen className="w-10 h-10 text-blue-600" />
            Dark Pattern Education Center
          </h1>
          <p className="text-xl text-gray-600">
            Learn to identify and protect yourself from deceptive subscription practices.
          </p>
        </div>

        <Tabs defaultValue="tutorial" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tutorial">Interactive Tutorial</TabsTrigger>
            <TabsTrigger value="patterns">Dark Pattern Types</TabsTrigger>
            <TabsTrigger value="resources">Resources & Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="tutorial" className="mt-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Play className="w-5 h-5 text-blue-600" />
                        Step {currentStep + 1}: {tutorialSteps[currentStep].title}
                      </CardTitle>
                      <Badge variant="outline">
                        {currentStep + 1} of {tutorialSteps.length}
                      </Badge>
                    </div>
                    <Progress value={progress} className="w-full" />
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">What You'll Learn:</h3>
                      <p className="text-gray-600">{tutorialSteps[currentStep].description}</p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Example:</h4>
                      <p className="text-blue-800">{tutorialSteps[currentStep].example}</p>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-medium text-red-900 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Warning:
                      </h4>
                      <p className="text-red-800">{tutorialSteps[currentStep].warning}</p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Pro Tip:
                      </h4>
                      <p className="text-green-800">{tutorialSteps[currentStep].tip}</p>
                    </div>

                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        onClick={prevStep}
                        disabled={currentStep === 0}
                      >
                        Previous
                      </Button>
                      <Button 
                        onClick={nextStep}
                        disabled={currentStep === tutorialSteps.length - 1}
                      >
                        {currentStep === tutorialSteps.length - 1 ? 'Complete Tutorial' : 'Next Step'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tutorialSteps.map((step, index) => (
                        <div 
                          key={step.id}
                          className={`flex items-center gap-3 p-3 rounded-lg ${
                            index === currentStep ? 'bg-blue-50 border border-blue-200' : 
                            completedSteps.includes(index) ? 'bg-green-50' : 'bg-gray-50'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            completedSteps.includes(index) ? 'bg-green-500 text-white' :
                            index === currentStep ? 'bg-blue-500 text-white' : 'bg-gray-300'
                          }`}>
                            {completedSteps.includes(index) ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <span className="text-xs font-medium">{index + 1}</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${
                              index === currentStep ? 'text-blue-900' : 'text-gray-900'
                            }`}>
                              {step.title}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="patterns" className="mt-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {darkPatternTypes.map((pattern) => (
                <Card key={pattern.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <pattern.icon className="w-5 h-5 text-red-600" />
                        {pattern.name}
                      </CardTitle>
                      <Badge variant={getSeverityColor(pattern.severity)}>
                        {getSeverityText(pattern.severity)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{pattern.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Common Examples:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {pattern.examples.slice(0, 3).map((example, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <XCircle className="w-3 h-3 text-red-500 mt-1 flex-shrink-0" />
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">How to Avoid:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {pattern.howToAvoid.slice(0, 2).map((tip, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Shield className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="font-medium text-blue-900 text-sm mb-1">Your Rights:</h4>
                      <p className="text-blue-800 text-xs">{pattern.legalRights}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="mt-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    Protection Tools
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Eye className="w-5 h-5 text-green-600" />
                      <div>
                        <h4 className="font-medium">Browser Extension</h4>
                        <p className="text-sm text-gray-600">Real-time dark pattern detection</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <XCircle className="w-5 h-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium">Cancellation Assistant</h4>
                        <p className="text-sm text-gray-600">Step-by-step cancellation guides</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-purple-600" />
                      <div>
                        <h4 className="font-medium">Pattern Database</h4>
                        <p className="text-sm text-gray-600">Community-reported dark patterns</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Legal Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium">Consumer Protection Laws</h4>
                      <p className="text-sm text-gray-600">Know your rights under consumer protection laws</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium">Dispute Resolution</h4>
                      <p className="text-sm text-gray-600">How to dispute unauthorized charges</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium">Regulatory Agencies</h4>
                      <p className="text-sm text-gray-600">Where to report deceptive practices</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Education;
