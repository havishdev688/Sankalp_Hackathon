import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThumbsUp, ThumbsDown, MessageCircle, ExternalLink, Search, Filter, TrendingUp, BarChart3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { patternAnalysisAPI } from '@/services/patternAnalysisAPI';
import { backendAPI } from '@/services/backendAPI';
import { useRealtimePatterns } from '@/hooks/useRealtime';

interface Pattern {
  id: string;
  title: string;
  description: string;
  company_name: string;
  website_url: string;
  pattern_type: 'dark_pattern' | 'ethical_alternative';
  category: string;
  screenshot_url: string;
  impact_score: number;
  upvotes: number;
  downvotes: number;
  created_at: string;
  profiles: {
    username: string;
    display_name: string;
  };
}

const Patterns = () => {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState('recent');
  const [statistics, setStatistics] = useState<any>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { events } = useRealtimePatterns();

  // Handle real-time pattern updates
  useEffect(() => {
    if (events.length > 0) {
      const latestEvent = events[0];
      if (latestEvent.type === 'pattern_added') {
        toast({
          title: "New Pattern Added",
          description: `${latestEvent.data.title} has been submitted`
        });
        fetchPatterns(); // Refresh patterns
      }
    }
  }, [events]);

  useEffect(() => {
    fetchPatterns();
    fetchStatistics();
  }, [sortBy, categoryFilter]);

  const fetchPatterns = async () => {
    setLoading(true);
    
    try {
      // Use backend API with fallback to Supabase
      const response = await backendAPI.getPatterns({
        category: categoryFilter,
        sortBy: sortBy
      });
      
      if (response.success && response.data) {
        setPatterns(response.data as any);
      } else {
        // Fallback to Supabase
        let query = supabase
          .from('patterns')
          .select(`
            *,
            profiles (
              username,
              display_name
            )
          `)
          .eq('status', 'approved');

        if (categoryFilter !== 'all') {
          query = query.eq('category', categoryFilter as any);
        }

        switch (sortBy) {
          case 'popular':
            query = query.order('upvotes', { ascending: false });
            break;
          case 'controversial':
            query = query.order('downvotes', { ascending: false });
            break;
          default:
            query = query.order('created_at', { ascending: false });
        }

        const { data, error } = await query;
        
        if (!error && data) {
          setPatterns(data as any);
        } else {
          throw new Error('Both backend and Supabase failed');
        }
      }
    } catch (error) {
      // Final fallback to sample data
      const { samplePatterns } = await import('@/data/samplePatterns');
      setPatterns(samplePatterns as any);
      toast({ title: "Demo Mode", description: "Using sample data for demonstration" });
    }
    
    setLoading(false);
  };

  const fetchStatistics = async () => {
    try {
      const response = await backendAPI.getDashboardStats();
      if (response.success && response.data) {
        setStatistics(response.data);
      } else {
        throw new Error('Backend stats failed');
      }
    } catch (error) {
      // Fallback to pattern analysis API
      try {
        const stats = await patternAnalysisAPI.getPatternStatistics();
        setStatistics(stats);
      } catch (fallbackError) {
        // Final fallback
        setStatistics({
          totalPatterns: 100,
          darkPatterns: 70,
          ethicalAlternatives: 30,
          topCategories: [
            { name: 'SaaS', count: 30 },
            { name: 'Streaming', count: 25 },
            { name: 'E-commerce', count: 20 },
            { name: 'News', count: 15 },
            { name: 'Other', count: 10 }
          ],
          recentActivity: [
            { id: 1, title: 'Hidden Auto-Renewal', type: 'dark_pattern', timestamp: new Date().toISOString() },
            { id: 2, title: 'Clear Cancellation', type: 'ethical_alternative', timestamp: new Date().toISOString() }
          ]
        });
      }
    }
  };

  const handleVote = async (patternId: string, voteType: 'upvote' | 'downvote') => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to vote" });
      return;
    }

    try {
      // Try backend API first
      const response = await backendAPI.votePattern(patternId, voteType);
      
      if (response.success) {
        fetchPatterns(); // Refresh to show updated vote counts
        toast({ title: "Vote recorded", description: `Your ${voteType} has been recorded` });
        return;
      }
    } catch (error) {
      // Fallback to Supabase
      const { error: supabaseError } = await supabase
        .from('pattern_votes')
        .upsert(
          { 
            pattern_id: patternId, 
            user_id: user.id, 
            vote_type: voteType 
          },
          { onConflict: 'user_id,pattern_id' }
        );

      if (supabaseError) {
        toast({ title: "Error", description: "Failed to record vote", variant: "destructive" });
      } else {
        fetchPatterns();
        toast({ title: "Vote recorded", description: `Your ${voteType} has been recorded` });
      }
    }
  };

  const filteredPatterns = patterns.filter(pattern =>
    pattern.title.toLowerCase().includes(search.toLowerCase()) ||
    pattern.description.toLowerCase().includes(search.toLowerCase()) ||
    pattern.company_name?.toLowerCase().includes(search.toLowerCase())
  );

  const darkPatterns = filteredPatterns.filter(p => p.pattern_type === 'dark_pattern');
  const ethicalPatterns = filteredPatterns.filter(p => p.pattern_type === 'ethical_alternative');

  const PatternCard = ({ pattern }: { pattern: Pattern }) => (
    <Card key={pattern.id} className="mb-6">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant={pattern.pattern_type === 'dark_pattern' ? 'destructive' : 'default'}>
                {pattern.pattern_type === 'dark_pattern' ? 'Dark Pattern' : 'Ethical Alternative'}
              </Badge>
              <Badge variant="outline">{pattern.category}</Badge>
              {pattern.impact_score && (
                <Badge variant="secondary">Impact: {pattern.impact_score}/5</Badge>
              )}
            </div>
            <h3 className="text-xl font-semibold">{pattern.title}</h3>
            {pattern.company_name && (
              <p className="text-sm text-muted-foreground">Company: {pattern.company_name}</p>
            )}
          </div>
          {pattern.website_url && (
            <Button variant="outline" size="sm" asChild>
              <a href={pattern.website_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{pattern.description}</p>
        
        {pattern.screenshot_url && (
          <img 
            src={pattern.screenshot_url} 
            alt={`Screenshot of ${pattern.title}`}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleVote(pattern.id, 'upvote')}
              className="flex items-center gap-2"
            >
              <ThumbsUp className="w-4 h-4" />
              {pattern.upvotes}
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleVote(pattern.id, 'downvote')}
              className="flex items-center gap-2"
            >
              <ThumbsDown className="w-4 h-4" />
              {pattern.downvotes}
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Discuss
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            by {pattern.profiles?.display_name || pattern.profiles?.username || 'Anonymous'} • 
            {new Date(pattern.created_at).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Pattern Database</h1>
          <p className="text-xl text-muted-foreground">
            Explore dark patterns and their ethical alternatives submitted by our community.
          </p>
          
          {/* Statistics Cards */}
          {statistics && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Patterns</p>
                      <p className="text-2xl font-bold">{statistics.totalPatterns}</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Dark Patterns</p>
                      <p className="text-2xl font-bold text-red-600">{statistics.darkPatterns}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Ethical Alternatives</p>
                      <p className="text-2xl font-bold text-green-600">{statistics.ethicalAlternatives}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Top Category</p>
                      <p className="text-lg font-bold">
                        {statistics.topCategories[0]?.name || 'N/A'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {statistics.topCategories[0]?.count || 0} patterns
                      </p>
                    </div>
                    <Filter className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patterns..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="saas">SaaS</SelectItem>
              <SelectItem value="streaming">Streaming</SelectItem>
              <SelectItem value="news">News</SelectItem>
              <SelectItem value="fitness">Fitness</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="popular">Most Upvoted</SelectItem>
              <SelectItem value="controversial">Most Controversial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Pattern Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Patterns ({filteredPatterns.length})</TabsTrigger>
            <TabsTrigger value="dark">Dark Patterns ({darkPatterns.length})</TabsTrigger>
            <TabsTrigger value="ethical">Ethical Alternatives ({ethicalPatterns.length})</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-8">
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
            ) : filteredPatterns.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No patterns found matching your criteria.</p>
                <Link to="/submit">
                  <Button>Submit First Pattern</Button>
                </Link>
              </div>
            ) : (
              filteredPatterns.map(pattern => <PatternCard key={pattern.id} pattern={pattern} />)
            )}
          </TabsContent>

          <TabsContent value="dark" className="mt-8">
            {darkPatterns.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No dark patterns found.</p>
              </div>
            ) : (
              darkPatterns.map(pattern => <PatternCard key={pattern.id} pattern={pattern} />)
            )}
          </TabsContent>

          <TabsContent value="ethical" className="mt-8">
            {ethicalPatterns.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No ethical alternatives found.</p>
              </div>
            ) : (
              ethicalPatterns.map(pattern => <PatternCard key={pattern.id} pattern={pattern} />)
            )}
          </TabsContent>

          <TabsContent value="trending" className="mt-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {statistics?.recentActivity ? (
                    <div className="space-y-3">
                      {statistics.recentActivity.map((activity: any) => (
                        <div key={activity.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{activity.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(activity.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant={activity.type === 'dark_pattern' ? 'destructive' : 'default'}>
                            {activity.type === 'dark_pattern' ? 'Dark' : 'Ethical'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Loading recent activity...</p>
                  )}
                </CardContent>
              </Card>

              {/* Top Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    Top Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {statistics?.topCategories ? (
                    <div className="space-y-3">
                      {statistics.topCategories.map((category: any, index: number) => (
                        <div key={category.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-purple-600">{index + 1}</span>
                            </div>
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-muted rounded-full h-2">
                              <div 
                                className="bg-purple-600 h-2 rounded-full" 
                                style={{ width: `${(category.count / statistics.totalPatterns) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium w-8">{category.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Loading categories...</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Patterns;