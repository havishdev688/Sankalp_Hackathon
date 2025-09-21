import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  ExternalLink, 
  Phone, 
  Mail, 
  MessageCircle, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  DollarSign,
  Calendar,
  FileText,
  Copy,
  Send
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const CancellationAssistant = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [guides, setGuides] = useState([]);
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuide, setSelectedGuide] = useState(null);

  useEffect(() => {
    // Load sample data immediately
    setGuides([
      {
        id: '1',
        company_name: 'Netflix',
        service_name: 'Netflix Streaming',
        category: 'streaming',
        difficulty_level: 2,
        steps: [
          { title: 'Sign in to your account', description: 'Go to netflix.com and sign in' },
          { title: 'Go to Account settings', description: 'Click on your profile icon and select Account' },
          { title: 'Cancel membership', description: 'Click Cancel Membership under Membership & Billing' }
        ],
        direct_cancellation_url: 'https://www.netflix.com/cancelplan',
        phone_number: '1-866-579-7172',
        email: 'info@netflix.com',
        chat_support_url: 'https://help.netflix.com/contactus',
        estimated_time: '5 minutes',
        tips: ['You can continue watching until your billing period ends'],
        legal_rights: 'You have the right to cancel at any time without penalty'
      },
      {
        id: '2',
        company_name: 'Adobe',
        service_name: 'Creative Cloud',
        category: 'saas',
        difficulty_level: 4,
        steps: [
          { title: 'Contact customer service', description: 'Adobe requires phone or chat contact for cancellation' },
          { title: 'Prepare for retention offers', description: 'They will likely offer discounts to keep you' }
        ],
        direct_cancellation_url: null,
        phone_number: '1-800-833-6687',
        email: 'customer-service@adobe.com',
        chat_support_url: 'https://helpx.adobe.com/contact.html',
        estimated_time: '30-45 minutes',
        tips: ['Be prepared for a long wait time'],
        legal_rights: 'Check your contract for early termination fees'
      }
    ]);
    
    if (user) {
      setUserSubscriptions([
        {
          id: '1',
          company_name: 'Netflix',
          service_name: 'Netflix Premium',
          subscription_type: 'monthly',
          monthly_cost: 15.49,
          status: 'active',
          start_date: '2024-01-15',
          renewal_date: '2024-02-15',
          cancellation_difficulty: 2,
          notes: 'Easy to cancel online'
        }
      ]);
    }
    
    setLoading(false);
  }, [user]);

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = guide.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.service_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (level) => {
    if (level >= 4) return 'destructive';
    if (level >= 3) return 'default';
    return 'secondary';
  };

  const getDifficultyText = (level) => {
    if (level >= 4) return 'Very Difficult';
    if (level >= 3) return 'Difficult';
    if (level >= 2) return 'Moderate';
    return 'Easy';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cancellation guides...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <XCircle className="w-10 h-10 text-red-600" />
            Cancellation Assistant
          </h1>
          <p className="text-xl text-gray-600">
            Get step-by-step help to cancel difficult subscriptions and escape subscription traps.
          </p>
        </div>

        <Tabs defaultValue="guides" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="guides">Cancellation Guides</TabsTrigger>
            <TabsTrigger value="my-subscriptions">My Subscriptions</TabsTrigger>
            <TabsTrigger value="templates">Email Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="guides" className="mt-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Find Cancellation Guide</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search company or service..."
                          className="pl-10"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="saas">SaaS</SelectItem>
                          <SelectItem value="streaming">Streaming</SelectItem>
                          <SelectItem value="fitness">Fitness</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      {filteredGuides.map((guide) => (
                        <Card 
                          key={guide.id} 
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => setSelectedGuide(guide)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold">{guide.company_name}</h3>
                                <p className="text-sm text-gray-600">{guide.service_name}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="outline">{guide.category}</Badge>
                                  <Badge variant={getDifficultyColor(guide.difficulty_level)}>
                                    {getDifficultyText(guide.difficulty_level)}
                                  </Badge>
                                  {guide.estimated_time && (
                                    <Badge variant="secondary">
                                      <Clock className="w-3 h-3 mr-1" />
                                      {guide.estimated_time}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                View Guide
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                {selectedGuide ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>{selectedGuide.company_name}</CardTitle>
                      <p className="text-sm text-gray-600">{selectedGuide.service_name}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <h4 className="font-medium">Cancellation Steps:</h4>
                        {selectedGuide.steps.map((step, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{step.title}</p>
                              <p className="text-sm text-gray-600">{step.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium">Contact Information:</h4>
                        {selectedGuide.direct_cancellation_url && (
                          <Button variant="outline" className="w-full justify-start" asChild>
                            <a href={selectedGuide.direct_cancellation_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Direct Cancellation Link
                            </a>
                          </Button>
                        )}
                        {selectedGuide.phone_number && (
                          <Button variant="outline" className="w-full justify-start">
                            <Phone className="w-4 h-4 mr-2" />
                            {selectedGuide.phone_number}
                          </Button>
                        )}
                        {selectedGuide.email && (
                          <Button variant="outline" className="w-full justify-start">
                            <Mail className="w-4 h-4 mr-2" />
                            {selectedGuide.email}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Select a company to view cancellation guide</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="my-subscriptions" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>My Active Subscriptions</CardTitle>
              </CardHeader>
              <CardContent>
                {userSubscriptions.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-600">No active subscriptions found.</p>
                    <p className="text-sm text-gray-500 mt-2">Add subscriptions to track them here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userSubscriptions.map((subscription) => (
                      <Card key={subscription.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold">{subscription.company_name}</h3>
                              <p className="text-sm text-gray-600">{subscription.service_name}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline">{subscription.subscription_type}</Badge>
                                <Badge variant="default">{subscription.status}</Badge>
                                {subscription.monthly_cost && (
                                  <Badge variant="secondary">
                                    <DollarSign className="w-3 h-3 mr-1" />
                                    ${subscription.monthly_cost}/month
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <Button variant="outline" size="sm">
                                Cancel Subscription
                              </Button>
                              {subscription.renewal_date && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Renews: {new Date(subscription.renewal_date).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Email Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Select a company to generate email template</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CancellationAssistant;