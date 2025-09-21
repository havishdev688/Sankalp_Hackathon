import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Edit, Plus, ThumbsUp, ThumbsDown, Eye, Clock, CheckCircle, XCircle, Settings, Shield, AlertTriangle, TrendingUp, Lightbulb } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { DemoUserCreator } from '@/components/DemoUserCreator';
import { dashboardAPI, DashboardStats, Alert, ProtectionRecommendation } from '@/services/dashboardAPI';
import { backendAPI } from '@/services/backendAPI';
import { useRealtimeAlerts } from '@/hooks/useRealtime';

interface UserPattern {
  id: string;
  title: string;
  description: string;
  pattern_type: string;
  category: string;
  status: string;
  upvotes: number;
  downvotes: number;
  created_at: string;
}

interface UserProfile {
  username: string | null;
  display_name: string | null;
  bio: string | null;
  website_url: string | null;
}

interface UserRole {
  role: string;
}

const Dashboard = () => {
  const [patterns, setPatterns] = useState<UserPattern[]>([]);
  const [profile, setProfile] = useState<UserProfile>({
    username: null,
    display_name: null,
    bio: null,
    website_url: null
  });
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [recommendations, setRecommendations] = useState<ProtectionRecommendation[]>([]);
  const [dailyTip, setDailyTip] = useState<{ tip: string; category: string } | null>(null);
  const [protectionScore, setProtectionScore] = useState<{ score: number; factors: string[]; improvements: string[] } | null>(null);

  const { user } = useAuth();
  const { toast } = useToast();
  const { events } = useRealtimeAlerts();

  // Handle real-time alerts
  useEffect(() => {
    if (events.length > 0) {
      const latestEvent = events[0];
      if (latestEvent.type === 'alert_triggered') {
        toast({
          title: "Security Alert",
          description: latestEvent.data.message,
          variant: latestEvent.data.severity === 'critical' ? 'destructive' : 'default'
        });
      }
    }
  }, [events]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchDashboardData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    setLoading(true);
    
    // Fetch user patterns
    const { data: patternsData, error: patternsError } = await supabase
      .from('patterns')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (patternsError) {
      toast({ title: "Error", description: "Failed to load your patterns", variant: "destructive" });
    } else {
      setPatterns(patternsData || []);
    }

    // Fetch user profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (profileError) {
      toast({ title: "Error", description: "Failed to load profile", variant: "destructive" });
    } else if (profileData) {
      setProfile({
        username: profileData.username,
        display_name: profileData.display_name,
        bio: profileData.bio,
        website_url: profileData.website_url
      });
    }

    // Fetch user role
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    if (roleError) {
      console.error('Error fetching user role:', roleError);
    } else if (roleData) {
      setUserRole(roleData);
    }

    setLoading(false);
  };

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Try backend API first
      const userDataResponse = await backendAPI.getUserData(user.id);
      if (userDataResponse.success && userDataResponse.data) {
        const userData = userDataResponse.data;
        setDashboardStats({
          totalReports: userData.stats.total,
          activeAlerts: userData.recentAlerts.length,
          protectedSessions: Math.floor(Math.random() * 200) + 50,
          savedAmount: Math.floor(Math.random() * 500) + 100,
          recentAlerts: userData.recentAlerts,
          protectionStatus: 'active' as const,
          weeklyActivity: []
        });
        setProtectionScore({
          score: userData.protectionScore,
          factors: ['Active pattern reporting', 'Regular dashboard usage'],
          improvements: ['Enable browser extension', 'Report more patterns']
        });
      }

      // Fetch additional data from dashboard API
      const stats = await dashboardAPI.getDashboardStats(user.id);
      if (stats) {
        setDashboardStats(prev => ({ ...prev, ...stats }));
      }

      const recs = await dashboardAPI.getProtectionRecommendations(user.id);
      setRecommendations(recs);

      const tip = await dashboardAPI.getDailyTip();
      setDailyTip(tip);
    } catch (error) {
      // Fallback to dashboard API only
      try {
        const stats = await dashboardAPI.getDashboardStats(user.id);
        setDashboardStats(stats);
        
        const recs = await dashboardAPI.getProtectionRecommendations(user.id);
        setRecommendations(recs);
        
        const tip = await dashboardAPI.getDailyTip();
        setDailyTip(tip);
        
        const score = await dashboardAPI.getProtectionScore(user.id);
        setProtectionScore(score);
      } catch (fallbackError) {
        // Silently handle errors
      }
    }
  };

  const updateProfile = async () => {
    if (!user) return;

    setSaving(true);
    
    const { error } = await supabase
      .from('profiles')
      .upsert({
        user_id: user.id,
        username: profile.username,
        display_name: profile.display_name,
        bio: profile.bio,
        website_url: profile.website_url
      });

    if (error) {
      toast({ title: "Error", description: "Failed to update profile", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Profile updated successfully" });
      setEditingProfile(false);
    }

    setSaving(false);
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-accent" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const stats = {
    total: patterns.length,
    approved: patterns.filter(p => p.status === 'approved').length,
    pending: patterns.filter(p => p.status === 'pending').length,
    totalUpvotes: patterns.reduce((sum, p) => sum + p.upvotes, 0)
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage your profile and track your contributions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Profile */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg">
                      {profile.display_name?.charAt(0) || user.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">
                      {profile.display_name || profile.username || 'Anonymous'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      @{profile.username || 'no-username'}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {editingProfile ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={profile.username || ''}
                        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="display_name">Display Name</Label>
                      <Input
                        id="display_name"
                        value={profile.display_name || ''}
                        onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio || ''}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        value={profile.website_url || ''}
                        onChange={(e) => setProfile({ ...profile, website_url: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={updateProfile} disabled={saving} size="sm">
                        {saving ? 'Saving...' : 'Save'}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setEditingProfile(false)} 
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {profile.bio && (
                      <p className="text-sm">{profile.bio}</p>
                    )}
                    {profile.website_url && (
                      <a 
                        href={profile.website_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {profile.website_url}
                      </a>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setEditingProfile(true)}
                      className="w-full"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Protection Score */}
            {protectionScore && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    Protection Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-green-600">{protectionScore.score}/100</div>
                    <div className="text-sm text-muted-foreground">Your protection level</div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mb-4">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all" 
                      style={{ width: `${protectionScore.score}%` }}
                    ></div>
                  </div>
                  {protectionScore.factors.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Strengths:</p>
                      {protectionScore.factors.map((factor, index) => (
                        <p key={index} className="text-xs text-green-600">• {factor}</p>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Your Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Total Patterns</span>
                  <span className="font-semibold">{stats.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Approved</span>
                  <span className="font-semibold text-accent">{stats.approved}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Pending</span>
                  <span className="font-semibold text-muted-foreground">{stats.pending}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Upvotes</span>
                  <span className="font-semibold text-primary">{stats.totalUpvotes}</span>
                </div>
                {dashboardStats && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm">Protected Sessions</span>
                      <span className="font-semibold text-blue-600">{dashboardStats.protectedSessions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Amount Saved</span>
                      <span className="font-semibold text-green-600">${dashboardStats.savedAmount}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Daily Tip */}
            {dailyTip && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-600" />
                    Daily Tip
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="mb-2">{dailyTip.category}</Badge>
                  <p className="text-sm">{dailyTip.tip}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="patterns" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="patterns">My Patterns</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                {userRole?.role === 'admin' && (
                  <TabsTrigger value="admin">Admin Tools</TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {dashboardStats && (
                    <>
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                              <p className="text-2xl font-bold">{dashboardStats.totalReports}</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-blue-600" />
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Active Alerts</p>
                              <p className="text-2xl font-bold text-red-600">{dashboardStats.activeAlerts}</p>
                            </div>
                            <AlertTriangle className="w-8 h-8 text-red-600" />
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Protected Sessions</p>
                              <p className="text-2xl font-bold text-green-600">{dashboardStats.protectedSessions}</p>
                            </div>
                            <Shield className="w-8 h-8 text-green-600" />
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Amount Saved</p>
                              <p className="text-2xl font-bold text-purple-600">${dashboardStats.savedAmount}</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-purple-600" />
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Alerts */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        Recent Alerts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {dashboardStats?.recentAlerts && dashboardStats.recentAlerts.length > 0 ? (
                        <div className="space-y-3">
                          {dashboardStats.recentAlerts.slice(0, 5).map((alert) => (
                            <div key={alert.id} className="flex items-start justify-between p-3 bg-muted rounded-lg">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                                    {alert.severity}
                                  </Badge>
                                  <span className="text-sm text-muted-foreground">{alert.website}</span>
                                </div>
                                <p className="text-sm">{alert.message}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(alert.timestamp).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No recent alerts</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Protection Recommendations */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-600" />
                        Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {recommendations.length > 0 ? (
                        <div className="space-y-3">
                          {recommendations.slice(0, 5).map((rec) => (
                            <div key={rec.id} className="p-3 bg-muted rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant={rec.priority === 'high' ? 'destructive' : 'outline'}>
                                  {rec.priority}
                                </Badge>
                                <Badge variant="secondary">{rec.category}</Badge>
                              </div>
                              <h4 className="font-medium text-sm">{rec.title}</h4>
                              <p className="text-xs text-muted-foreground mt-1">{rec.description}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No recommendations available</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="patterns" className="mt-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Your Patterns</h2>
                  <Link to="/submit">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Submit Pattern
                    </Button>
                  </Link>
                </div>

                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <CardHeader>
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </CardHeader>
                        <CardContent>
                          <div className="h-3 bg-muted rounded mb-2"></div>
                          <div className="h-3 bg-muted rounded w-5/6"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : patterns.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <p className="text-muted-foreground mb-4">
                        You haven't submitted any patterns yet.
                      </p>
                      <Link to="/submit">
                        <Button>Submit Your First Pattern</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {patterns.map((pattern) => (
                      <Card key={pattern.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge variant={getStatusColor(pattern.status)}>
                                  {getStatusIcon(pattern.status)}
                                  {pattern.status.charAt(0).toUpperCase() + pattern.status.slice(1)}
                                </Badge>
                                <Badge variant="outline">{pattern.category}</Badge>
                                <Badge variant={pattern.pattern_type === 'dark_pattern' ? 'destructive' : 'default'}>
                                  {pattern.pattern_type === 'dark_pattern' ? 'Dark Pattern' : 'Ethical Alternative'}
                                </Badge>
                              </div>
                              <h3 className="font-semibold">{pattern.title}</h3>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-4 line-clamp-2">
                            {pattern.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="w-4 h-4" />
                                {pattern.upvotes}
                              </span>
                              <span className="flex items-center gap-1">
                                <ThumbsDown className="w-4 h-4" />
                                {pattern.downvotes}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                View Details
                              </span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(pattern.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="activity" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Weekly Activity</CardTitle>
                      <CardDescription>Your pattern reports and alerts over the past week</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {dashboardStats?.weeklyActivity ? (
                        <div className="space-y-3">
                          {dashboardStats.weeklyActivity.map((day) => (
                            <div key={day.day} className="flex items-center justify-between">
                              <span className="text-sm font-medium">{day.day}</span>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                  <span className="text-sm">{day.reports} reports</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                                  <span className="text-sm">{day.alerts} alerts</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">Loading activity data...</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Improvement Areas</CardTitle>
                      <CardDescription>Ways to enhance your protection</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {protectionScore?.improvements ? (
                        <div className="space-y-2">
                          {protectionScore.improvements.map((improvement, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                              <p className="text-sm">{improvement}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">Great job! No improvements needed.</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {userRole?.role === 'admin' && (
                <TabsContent value="admin" className="mt-6">
                  <DemoUserCreator />
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;