import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Users, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface DemoUser {
  email: string;
  password: string;
  username: string;
  display_name: string;
  bio: string;
  role: 'user' | 'moderator' | 'admin';
  region: string;
  userType: string;
}

const demoUsers: DemoUser[] = [
  {
    email: 'priya.sharma@demo.com',
    password: 'DemoUser123!',
    username: 'priya_sharma',
    display_name: 'Priya Sharma',
    bio: 'Software engineer from Mumbai. Passionate about user rights and ethical design. Often falls victim to subscription traps due to busy schedule.',
    role: 'user',
    region: 'Mumbai, Maharashtra',
    userType: 'Young Urban Professional'
  },
  {
    email: 'ramesh.kumar@demo.com',
    password: 'DemoUser123!',
    username: 'ramesh_kumar',
    display_name: 'Ramesh Kumar',
    bio: 'Farmer from rural Uttar Pradesh. New to digital payments and online services. Often confused by complex subscription interfaces.',
    role: 'user',
    region: 'Rural Uttar Pradesh',
    userType: 'Rural User'
  },
  {
    email: 'sushila.devi@demo.com',
    password: 'DemoUser123!',
    username: 'sushila_devi',
    display_name: 'Sushila Devi',
    bio: 'Retired teacher from Delhi. Uses smartphone for basic needs but struggles with complex digital interfaces. Often accidentally subscribes to services.',
    role: 'user',
    region: 'Delhi',
    userType: 'Elderly User'
  },
  {
    email: 'arjun.patel@demo.com',
    password: 'DemoUser123!',
    username: 'arjun_patel',
    display_name: 'Arjun Patel',
    bio: 'Engineering student from Bangalore. Heavy user of streaming and edtech platforms. Very price-conscious and frustrated by hidden costs.',
    role: 'user',
    region: 'Bangalore, Karnataka',
    userType: 'Student'
  },
  {
    email: 'meera.singh@demo.com',
    password: 'DemoUser123!',
    username: 'meera_singh',
    display_name: 'Meera Singh',
    bio: 'Small business owner from Pune. Uses multiple SaaS tools for business. Frustrated by auto-renewals and difficult cancellation processes.',
    role: 'user',
    region: 'Pune, Maharashtra',
    userType: 'Small Business Owner'
  },
  {
    email: 'vijay.reddy@demo.com',
    password: 'DemoUser123!',
    username: 'vijay_reddy',
    display_name: 'Vijay Reddy',
    bio: 'Consumer rights activist from Hyderabad. Works with Consumer Protection Act cases. Expert in identifying and documenting dark patterns.',
    role: 'moderator',
    region: 'Hyderabad, Telangana',
    userType: 'Consumer Rights Activist'
  },
  {
    email: 'kavitha.nair@demo.com',
    password: 'DemoUser123!',
    username: 'kavitha_nair',
    display_name: 'Kavitha Nair',
    bio: 'Banking professional from Chennai. Very concerned about financial security and transparency. Documents fintech dark patterns.',
    role: 'user',
    region: 'Chennai, Tamil Nadu',
    userType: 'Fintech User'
  },
  {
    email: 'rajesh.yadav@demo.com',
    password: 'DemoUser123!',
    username: 'rajesh_yadav',
    display_name: 'Rajesh Yadav',
    bio: 'Government employee from Bihar. Prefers Hindi interfaces but often encounters English-only subscription flows. Advocates for regional language support.',
    role: 'user',
    region: 'Bihar',
    userType: 'Regional Language User'
  },
  {
    email: 'anita.gupta@demo.com',
    password: 'DemoUser123!',
    username: 'anita_gupta',
    display_name: 'Anita Gupta',
    bio: 'Mother of two from Jaipur. Manages family subscriptions and is frustrated by children accidentally subscribing to services through games and apps.',
    role: 'user',
    region: 'Jaipur, Rajasthan',
    userType: 'Parent'
  },
  {
    email: 'bhaskar.iyer@demo.com',
    password: 'DemoUser123!',
    username: 'bhaskar_iyer',
    display_name: 'Bhaskar Iyer',
    bio: 'Retired government officer from Kerala. Uses basic smartphone features but struggles with subscription management. Often needs family help.',
    role: 'user',
    region: 'Kerala',
    userType: 'Senior Citizen'
  },
  {
    email: 'admin@ethicalpatterns.in',
    password: 'AdminDemo123!',
    username: 'admin',
    display_name: 'Platform Admin',
    bio: 'Platform administrator for Ethical Patterns. Manages user submissions, moderates content, and ensures platform integrity.',
    role: 'admin',
    region: 'Platform',
    userType: 'Administrator'
  }
];

const samplePatterns = [
  {
    title: "Hidden Auto-Renewal in OTT Streaming",
    description: "Popular streaming platform automatically renews subscription without clear notification. Users only discover charges on their bank statement. No easy way to cancel - requires calling customer service during business hours.",
    company_name: "StreamFlix India",
    website_url: "https://streamflix.in",
    pattern_type: "dark_pattern" as const,
    category: "streaming" as const,
    impact_score: 4
  },
  {
    title: "Confusing Pricing Tiers in EdTech",
    description: "Educational platform shows 'Free Trial' prominently but hides that it's actually a paid subscription. Trial converts automatically after 7 days with no clear reminder. Cancellation requires multiple steps and confirmation screens.",
    company_name: "EduLearn Pro",
    website_url: "https://edulearnpro.com",
    pattern_type: "dark_pattern" as const,
    category: "education" as const,
    impact_score: 5
  },
  {
    title: "Transparent Subscription Dashboard",
    description: "This fintech app provides a clear, easy-to-find subscription management section. Users can see all active subscriptions, upcoming charges, and cancel with one click. No hidden fees or confusing language.",
    company_name: "PayClear",
    website_url: "https://payclear.in",
    pattern_type: "ethical_alternative" as const,
    category: "saas" as const,
    impact_score: 5
  }
];

const sampleComments = [
  "This happened to me too! I was charged ₹299 for a subscription I didn't even know I had.",
  "Great example of ethical design. More companies should follow this approach.",
  "I had to call customer service 3 times to cancel. They kept trying to offer me discounts instead of just canceling.",
  "This is exactly why we need better consumer protection laws in India.",
  "My elderly mother fell victim to this pattern. She doesn't understand English well and got confused by the interface.",
  "The RBI guidelines should be enforced more strictly. Companies are still using these tricks.",
  "I appreciate that this company is being transparent. Will definitely consider using their service.",
  "This is a common problem in rural areas where people are new to digital payments.",
  "As a parent, I'm concerned about my children accidentally subscribing to services through games.",
  "We need more awareness campaigns about these dark patterns, especially in regional languages."
];

export const DemoUserCreator: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [createdUsers, setCreatedUsers] = useState<string[]>([]);
  const [createdPatterns, setCreatedPatterns] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const { toast } = useToast();

  const createDemoUsers = async () => {
    setIsCreating(true);
    setProgress(0);
    setCreatedUsers([]);
    setCreatedPatterns([]);
    setErrors([]);
    
    const totalSteps = demoUsers.length + samplePatterns.length + 1; // +1 for comments
    let currentStepIndex = 0;

    try {
      // Create users
      for (const user of demoUsers) {
        setCurrentStep(`Creating user: ${user.display_name}`);
        currentStepIndex++;
        setProgress((currentStepIndex / totalSteps) * 100);

        try {
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: user.email,
            password: user.password,
            options: {
              data: {
                username: user.username,
                display_name: user.display_name
              }
            }
          });

          if (authError) {
            setErrors(prev => [...prev, `Failed to create ${user.display_name}: ${authError.message}`]);
            continue;
          }

          if (authData.user) {
            // Update profile with additional data
            const { error: profileError } = await supabase
              .from('profiles')
              .update({
                bio: user.bio,
                is_verified: user.role === 'admin' || user.role === 'moderator'
              })
              .eq('user_id', authData.user.id);

            if (profileError) {
              console.error('Profile update error:', profileError);
            }

            // Update user role if not default 'user'
            if (user.role !== 'user') {
              const { error: roleError } = await supabase
                .from('user_roles')
                .update({ role: user.role })
                .eq('user_id', authData.user.id);

              if (roleError) {
                console.error('Role update error:', roleError);
              }
            }

            setCreatedUsers(prev => [...prev, user.display_name]);
          }
        } catch (error) {
          setErrors(prev => [...prev, `Error creating ${user.display_name}: ${error}`]);
        }
      }

      // Create sample patterns
      const userIds = await supabase
        .from('profiles')
        .select('user_id')
        .limit(3);

      if (userIds.data && userIds.data.length > 0) {
        for (const pattern of samplePatterns) {
          setCurrentStep(`Creating pattern: ${pattern.title}`);
          currentStepIndex++;
          setProgress((currentStepIndex / totalSteps) * 100);

          try {
            const randomUser = userIds.data[Math.floor(Math.random() * userIds.data.length)];
            
            const { data: patternData, error: patternError } = await supabase
              .from('patterns')
              .insert({
                ...pattern,
                user_id: randomUser.user_id,
                status: 'approved'
              })
              .select()
              .single();

            if (patternError) {
              setErrors(prev => [...prev, `Failed to create pattern ${pattern.title}: ${patternError.message}`]);
              continue;
            }

            setCreatedPatterns(prev => [...prev, pattern.title]);

            // Add some comments to the pattern
            for (let i = 0; i < 2; i++) {
              const randomUser = userIds.data[Math.floor(Math.random() * userIds.data.length)];
              const randomComment = sampleComments[Math.floor(Math.random() * sampleComments.length)];
              
              await supabase
                .from('pattern_comments')
                .insert({
                  pattern_id: patternData.id,
                  user_id: randomUser.user_id,
                  content: randomComment
                });
            }

            // Add some votes
            for (let i = 0; i < 3; i++) {
              const randomUser = userIds.data[Math.floor(Math.random() * userIds.data.length)];
              const voteType = Math.random() > 0.1 ? 'upvote' : 'downvote';
              
              await supabase
                .from('pattern_votes')
                .insert({
                  pattern_id: patternData.id,
                  user_id: randomUser.user_id,
                  vote_type: voteType
                });
            }

          } catch (error) {
            setErrors(prev => [...prev, `Error creating pattern ${pattern.title}: ${error}`]);
          }
        }
      }

      setCurrentStep('Demo data creation completed!');
      setProgress(100);

      toast({
        title: "Demo data created successfully!",
        description: `Created ${createdUsers.length} users and ${createdPatterns.length} patterns.`,
      });

    } catch (error) {
      setErrors(prev => [...prev, `General error: ${error}`]);
      toast({
        title: "Error creating demo data",
        description: "Some errors occurred while creating demo data. Check the details below.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Demo User Creator
          </CardTitle>
          <CardDescription>
            Create realistic demo users representing different segments of Indian users affected by dark UX patterns.
            This will help demonstrate the platform's purpose and showcase various user personas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Demo Users Preview */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Demo Users to be Created</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {demoUsers.map((user, index) => (
                <div key={index} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{user.display_name}</span>
                    <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'moderator' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{user.userType}</p>
                  <p className="text-xs text-muted-foreground">{user.region}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Patterns Preview */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Sample Patterns to be Created</h3>
            <div className="space-y-2">
              {samplePatterns.map((pattern, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{pattern.title}</span>
                    <Badge variant={pattern.pattern_type === 'dark_pattern' ? 'destructive' : 'default'}>
                      {pattern.pattern_type === 'dark_pattern' ? 'Dark Pattern' : 'Ethical Alternative'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{pattern.company_name}</p>
                  <p className="text-xs text-muted-foreground">{pattern.description.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          </div>

          {/* Progress */}
          {isCreating && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{currentStep}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Results */}
          {createdUsers.length > 0 && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Successfully created {createdUsers.length} users:</strong>
                <ul className="mt-2 list-disc list-inside">
                  {createdUsers.map((user, index) => (
                    <li key={index}>{user}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {createdPatterns.length > 0 && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Successfully created {createdPatterns.length} patterns:</strong>
                <ul className="mt-2 list-disc list-inside">
                  {createdPatterns.map((pattern, index) => (
                    <li key={index}>{pattern}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Errors occurred:</strong>
                <ul className="mt-2 list-disc list-inside">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Action Button */}
          <Button 
            onClick={createDemoUsers} 
            disabled={isCreating}
            className="w-full"
            size="lg"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Demo Data...
              </>
            ) : (
              <>
                <Users className="w-4 h-4 mr-2" />
                Create Demo Users & Sample Data
              </>
            )}
          </Button>

          {/* Credentials Info */}
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Demo User Credentials</h4>
            <p className="text-sm text-muted-foreground mb-2">
              All demo users have the password: <code className="bg-background px-1 rounded">DemoUser123!</code>
            </p>
            <p className="text-sm text-muted-foreground">
              Admin user has the password: <code className="bg-background px-1 rounded">AdminDemo123!</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
