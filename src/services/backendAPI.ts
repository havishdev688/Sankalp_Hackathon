// Backend API Service
// Handles all backend operations with real-time capabilities

import { samplePatterns } from '@/data/samplePatterns';

export interface BackendResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface RealtimeEvent {
  type: 'pattern_added' | 'pattern_updated' | 'scan_completed' | 'alert_triggered';
  data: any;
  timestamp: string;
  userId?: string;
}

class BackendAPI {
  private eventListeners: Map<string, Function[]> = new Map();
  private mockDatabase: Map<string, any> = new Map();
  private realtimeInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeMockDatabase();
    this.startRealtimeUpdates();
  }

  /**
   * Initialize mock database with sample data
   */
  private initializeMockDatabase() {
    // Store patterns
    samplePatterns.forEach(pattern => {
      this.mockDatabase.set(`pattern_${pattern.id}`, pattern);
    });

    // Store user data
    this.mockDatabase.set('user_stats', {
      totalUsers: 1250,
      activeUsers: 89,
      patternsReported: 156,
      companiesTracked: 45
    });

    // Store real-time alerts
    this.mockDatabase.set('alerts', [
      {
        id: '1',
        type: 'dark_pattern',
        severity: 'high',
        message: 'New auto-renewal pattern detected on Netflix',
        timestamp: new Date().toISOString(),
        url: 'https://netflix.com/signup'
      }
    ]);

    // Store cancellation guides
    this.mockDatabase.set('cancellation_guides', [
      {
        id: '1',
        company_name: 'Netflix',
        service_name: 'Netflix Streaming',
        category: 'streaming',
        difficulty_level: 2
      }
    ]);
  }

  /**
   * Start real-time updates simulation
   */
  private startRealtimeUpdates() {
    this.realtimeInterval = setInterval(() => {
      this.simulateRealtimeEvent();
    }, 30000); // Every 30 seconds
  }

  /**
   * Simulate real-time events
   */
  private simulateRealtimeEvent() {
    const events = [
      {
        type: 'pattern_added' as const,
        data: {
          id: Date.now().toString(),
          title: 'New dark pattern detected',
          company: 'Sample Corp',
          severity: Math.floor(Math.random() * 5) + 1
        }
      },
      {
        type: 'scan_completed' as const,
        data: {
          url: window.location.href,
          riskScore: Math.floor(Math.random() * 10),
          patternsFound: Math.floor(Math.random() * 3)
        }
      },
      {
        type: 'alert_triggered' as const,
        data: {
          message: 'High-risk pattern detected on current page',
          severity: 'critical'
        }
      },
      {
        type: 'pattern_updated' as const,
        data: {
          id: 'subscription_update',
          message: 'Subscription cancellation guide updated',
          company: 'Adobe'
        }
      }
    ];

    const randomEvent = events[Math.floor(Math.random() * events.length)];
    this.emitEvent(randomEvent.type, randomEvent.data);
  }

  /**
   * Get all patterns with filtering and sorting
   */
  async getPatterns(filters?: {
    category?: string;
    type?: string;
    sortBy?: string;
    limit?: number;
  }): Promise<BackendResponse<any[]>> {
    try {
      let patterns = Array.from(this.mockDatabase.values())
        .filter(item => item.id && item.title);

      // Apply filters
      if (filters?.category && filters.category !== 'all') {
        patterns = patterns.filter(p => p.category === filters.category);
      }

      if (filters?.type && filters.type !== 'all') {
        patterns = patterns.filter(p => p.pattern_type === filters.type);
      }

      // Apply sorting
      switch (filters?.sortBy) {
        case 'popular':
          patterns.sort((a, b) => b.upvotes - a.upvotes);
          break;
        case 'controversial':
          patterns.sort((a, b) => b.downvotes - a.downvotes);
          break;
        default:
          patterns.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }

      // Apply limit
      if (filters?.limit) {
        patterns = patterns.slice(0, filters.limit);
      }

      return {
        success: true,
        data: patterns,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch patterns',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Submit new pattern
   */
  async submitPattern(patternData: any): Promise<BackendResponse<any>> {
    try {
      const newPattern = {
        ...patternData,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        status: 'pending',
        upvotes: 0,
        downvotes: 0,
        profiles: {
          username: 'current_user',
          display_name: 'Current User'
        }
      };

      this.mockDatabase.set(`pattern_${newPattern.id}`, newPattern);
      
      // Emit real-time event
      this.emitEvent('pattern_added', newPattern);

      return {
        success: true,
        data: newPattern,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to submit pattern',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<BackendResponse<any>> {
    try {
      const patterns = Array.from(this.mockDatabase.values())
        .filter(item => item.id && item.title);

      const stats = {
        totalPatterns: patterns.length,
        darkPatterns: patterns.filter(p => p.pattern_type === 'dark_pattern').length,
        ethicalAlternatives: patterns.filter(p => p.pattern_type === 'ethical_alternative').length,
        topCategories: this.getTopCategories(patterns),
        recentActivity: patterns.slice(0, 5).map(p => ({
          id: p.id,
          title: p.title,
          type: p.pattern_type,
          timestamp: p.created_at
        })),
        userStats: this.mockDatabase.get('user_stats')
      };

      return {
        success: true,
        data: stats,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch dashboard stats',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get user-specific data
   */
  async getUserData(userId: string): Promise<BackendResponse<any>> {
    try {
      const userPatterns = Array.from(this.mockDatabase.values())
        .filter(item => item.user_id === userId);

      const userData = {
        patterns: userPatterns,
        stats: {
          total: userPatterns.length,
          approved: userPatterns.filter(p => p.status === 'approved').length,
          pending: userPatterns.filter(p => p.status === 'pending').length,
          totalUpvotes: userPatterns.reduce((sum, p) => sum + (p.upvotes || 0), 0)
        },
        protectionScore: Math.floor(Math.random() * 100) + 1,
        recentAlerts: this.mockDatabase.get('alerts') || []
      };

      return {
        success: true,
        data: userData,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch user data',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Vote on pattern
   */
  async votePattern(patternId: string, voteType: 'upvote' | 'downvote'): Promise<BackendResponse<any>> {
    try {
      const pattern = this.mockDatabase.get(`pattern_${patternId}`);
      if (!pattern) {
        throw new Error('Pattern not found');
      }

      if (voteType === 'upvote') {
        pattern.upvotes = (pattern.upvotes || 0) + 1;
      } else {
        pattern.downvotes = (pattern.downvotes || 0) + 1;
      }

      this.mockDatabase.set(`pattern_${patternId}`, pattern);

      return {
        success: true,
        data: { upvotes: pattern.upvotes, downvotes: pattern.downvotes },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to record vote',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Real-time event system
   */
  addEventListener(eventType: string, callback: Function) {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(callback);
  }

  removeEventListener(eventType: string, callback: Function) {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emitEvent(eventType: string, data: any) {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      const event: RealtimeEvent = {
        type: eventType as any,
        data,
        timestamp: new Date().toISOString()
      };
      listeners.forEach(callback => callback(event));
    }
  }

  /**
   * Search patterns
   */
  async searchPatterns(query: string): Promise<BackendResponse<any[]>> {
    try {
      const patterns = Array.from(this.mockDatabase.values())
        .filter(item => item.id && item.title);

      const results = patterns.filter(pattern => 
        pattern.title.toLowerCase().includes(query.toLowerCase()) ||
        pattern.description.toLowerCase().includes(query.toLowerCase()) ||
        pattern.company_name?.toLowerCase().includes(query.toLowerCase())
      );

      return {
        success: true,
        data: results,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: 'Search failed',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get company accountability data
   */
  async getCompanyData(): Promise<BackendResponse<any>> {
    try {
      const patterns = Array.from(this.mockDatabase.values())
        .filter(item => item.id && item.title);

      const companies = this.groupPatternsByCompany(patterns);
      
      return {
        success: true,
        data: companies,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch company data',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Helper methods
   */
  private getTopCategories(patterns: any[]) {
    const categoryCount: { [key: string]: number } = {};
    patterns.forEach(pattern => {
      categoryCount[pattern.category] = (categoryCount[pattern.category] || 0) + 1;
    });

    return Object.entries(categoryCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  private groupPatternsByCompany(patterns: any[]) {
    const companies: { [key: string]: any } = {};
    
    patterns.forEach(pattern => {
      const companyName = pattern.company_name || 'Unknown';
      if (!companies[companyName]) {
        companies[companyName] = {
          id: companyName.toLowerCase().replace(/\s+/g, '-'),
          company_name: companyName,
          total_patterns: 0,
          severity_score: 0,
          user_impact: 0,
          last_updated: pattern.created_at,
          status: 'active',
          patterns: []
        };
      }
      
      companies[companyName].total_patterns++;
      companies[companyName].patterns.push({
        id: pattern.id,
        title: pattern.title,
        pattern_type: pattern.pattern_type,
        severity: pattern.impact_score || 3,
        reports_count: pattern.upvotes + pattern.downvotes
      });
      
      // Calculate average severity
      const totalSeverity = companies[companyName].patterns.reduce((sum: number, p: any) => sum + p.severity, 0);
      companies[companyName].severity_score = totalSeverity / companies[companyName].patterns.length;
      companies[companyName].user_impact = companies[companyName].total_patterns * 50; // Simulate user impact
    });

    return Object.values(companies);
  }

  /**
   * Get cancellation guides
   */
  async getCancellationGuides(): Promise<any[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const guides = [
      {
        id: '1',
        company_name: 'Netflix',
        service_name: 'Netflix Streaming',
        category: 'streaming',
        difficulty_level: 2,
        steps: [
          { title: 'Sign in to your account', description: 'Go to netflix.com and sign in' },
          { title: 'Go to Account settings', description: 'Click on your profile icon and select Account' },
          { title: 'Cancel membership', description: 'Click Cancel Membership under Membership & Billing' },
          { title: 'Confirm cancellation', description: 'Follow the prompts to confirm your cancellation' }
        ],
        direct_cancellation_url: 'https://www.netflix.com/cancelplan',
        phone_number: '1-866-579-7172',
        email: 'info@netflix.com',
        chat_support_url: 'https://help.netflix.com/contactus',
        estimated_time: '5 minutes',
        tips: [
          'You can continue watching until your billing period ends',
          'Download content before cancelling if you want to watch offline',
          'Consider downgrading instead of cancelling'
        ],
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
          { title: 'Prepare for retention offers', description: 'They will likely offer discounts to keep you' },
          { title: 'Request immediate cancellation', description: 'Be firm about wanting to cancel' },
          { title: 'Get confirmation number', description: 'Ensure you receive written confirmation' }
        ],
        direct_cancellation_url: null,
        phone_number: '1-800-833-6687',
        email: 'customer-service@adobe.com',
        chat_support_url: 'https://helpx.adobe.com/contact.html',
        estimated_time: '30-45 minutes',
        tips: [
          'Be prepared for a long wait time',
          'Have your account information ready',
          'May charge early termination fee',
          'Consider timing cancellation with billing cycle'
        ],
        legal_rights: 'Check your contract for early termination fees and cooling-off period rights'
      },
      {
        id: '3',
        company_name: 'Planet Fitness',
        service_name: 'Gym Membership',
        category: 'fitness',
        difficulty_level: 5,
        steps: [
          { title: 'Visit home gym location', description: 'Must cancel in person at your home gym' },
          { title: 'Bring required documents', description: 'Photo ID and possibly certified mail' },
          { title: 'Fill out cancellation form', description: 'Complete their specific cancellation paperwork' },
          { title: 'Get receipt', description: 'Ensure you get written proof of cancellation' }
        ],
        direct_cancellation_url: null,
        phone_number: '1-844-746-3887',
        email: null,
        chat_support_url: null,
        estimated_time: '1-2 hours (including travel)',
        tips: [
          'Cannot cancel online or by phone',
          'Must be done in person at home gym',
          'Some locations require certified mail',
          'Check state laws - some allow email cancellation'
        ],
        legal_rights: 'State laws may override gym cancellation policies - check your local regulations'
      },
      {
        id: '4',
        company_name: 'Amazon',
        service_name: 'Prime Membership',
        category: 'ecommerce',
        difficulty_level: 2,
        steps: [
          { title: 'Go to Prime membership', description: 'Visit Your Account > Prime Membership' },
          { title: 'End membership', description: 'Click End Membership and Benefits' },
          { title: 'Confirm cancellation', description: 'Follow prompts to confirm' }
        ],
        direct_cancellation_url: 'https://www.amazon.com/gp/prime/pipeline/cancel',
        phone_number: '1-888-280-4331',
        email: null,
        chat_support_url: 'https://www.amazon.com/gp/help/customer/contact-us',
        estimated_time: '3 minutes',
        tips: ['You can get a prorated refund if you haven\'t used Prime benefits'],
        legal_rights: 'Eligible for full refund within 3 days of signing up'
      },
      {
        id: '5',
        company_name: 'Spotify',
        service_name: 'Premium',
        category: 'streaming',
        difficulty_level: 1,
        steps: [
          { title: 'Go to account overview', description: 'Visit spotify.com/account' },
          { title: 'Change plan', description: 'Click Change Plan' },
          { title: 'Cancel Premium', description: 'Select Cancel Premium option' }
        ],
        direct_cancellation_url: 'https://www.spotify.com/account/subscription/',
        phone_number: null,
        email: null,
        chat_support_url: 'https://support.spotify.com/contact/',
        estimated_time: '2 minutes',
        tips: ['Premium continues until end of billing period'],
        legal_rights: 'Can cancel anytime without penalty'
      }
    ];
    
    return guides;
  }

  /**
   * Get user subscriptions
   */
  async getUserSubscriptions(userId: string): Promise<any[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const subscriptions = [
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
      },
      {
        id: '2',
        company_name: 'Adobe',
        service_name: 'Creative Cloud',
        subscription_type: 'annual',
        monthly_cost: 52.99,
        status: 'active',
        start_date: '2023-09-01',
        renewal_date: '2024-09-01',
        cancellation_difficulty: 4,
        notes: 'Requires phone call, early termination fee'
      },
      {
        id: '3',
        company_name: 'Spotify',
        service_name: 'Premium',
        subscription_type: 'monthly',
        monthly_cost: 9.99,
        status: 'active',
        start_date: '2023-12-01',
        renewal_date: '2024-02-01',
        cancellation_difficulty: 1,
        notes: 'Very easy to cancel'
      }
    ];
    
    return subscriptions;
  }

  /**
   * Add user subscription
   */
  async addUserSubscription(userId: string, subscriptionData: any): Promise<BackendResponse<any>> {
    try {
      const newSubscription = {
        ...subscriptionData,
        id: Date.now().toString(),
        user_id: userId,
        status: 'active',
        start_date: new Date().toISOString().split('T')[0]
      };

      // Store in mock database
      this.mockDatabase.set(`subscription_${newSubscription.id}`, newSubscription);

      return {
        success: true,
        data: newSubscription,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to add subscription',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Update subscription status
   */
  async updateSubscriptionStatus(subscriptionId: string, status: string): Promise<BackendResponse<any>> {
    try {
      const subscription = this.mockDatabase.get(`subscription_${subscriptionId}`);
      if (!subscription) {
        throw new Error('Subscription not found');
      }

      subscription.status = status;
      if (status === 'cancelled') {
        subscription.cancelled_date = new Date().toISOString().split('T')[0];
      }

      this.mockDatabase.set(`subscription_${subscriptionId}`, subscription);

      return {
        success: true,
        data: subscription,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update subscription',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Cleanup
   */
  destroy() {
    if (this.realtimeInterval) {
      clearInterval(this.realtimeInterval);
    }
    this.eventListeners.clear();
  }
}

export const backendAPI = new BackendAPI();