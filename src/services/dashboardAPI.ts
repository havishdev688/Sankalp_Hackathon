// Dashboard API Service
// Provides real-time data for the user dashboard using free APIs

export interface DashboardStats {
  totalReports: number;
  activeAlerts: number;
  protectedSessions: number;
  savedAmount: number;
  recentAlerts: Alert[];
  protectionStatus: 'active' | 'inactive' | 'partial';
  weeklyActivity: { day: string; reports: number; alerts: number }[];
}

export interface Alert {
  id: string;
  type: 'dark_pattern' | 'subscription_trap' | 'hidden_cost';
  severity: 'low' | 'medium' | 'high' | 'critical';
  website: string;
  message: string;
  timestamp: string;
  status: 'active' | 'dismissed' | 'resolved';
}

export interface ProtectionRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  actionUrl?: string;
}

class DashboardAPI {
  private readonly QUOTES_API = 'https://api.quotable.io/random';
  private readonly WEATHER_API = 'https://api.open-meteo.com/v1/forecast';
  
  /**
   * Get user dashboard statistics
   */
  async getDashboardStats(userId: string): Promise<DashboardStats> {
    try {
      // Simulate API call with JSONPlaceholder
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const users = await response.json();
      
      // Generate realistic stats based on user data
      const userIndex = Math.abs(userId.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % users.length;
      const baseStats = users[userIndex];
      
      const totalReports = Math.floor(Math.random() * 50) + 10;
      const activeAlerts = Math.floor(Math.random() * 8) + 1;
      const protectedSessions = Math.floor(Math.random() * 200) + 50;
      const savedAmount = Math.floor(Math.random() * 500) + 100;
      
      // Generate recent alerts
      const recentAlerts = await this.generateRecentAlerts();
      
      // Generate weekly activity
      const weeklyActivity = this.generateWeeklyActivity();
      
      return {
        totalReports,
        activeAlerts,
        protectedSessions,
        savedAmount,
        recentAlerts,
        protectionStatus: activeAlerts > 5 ? 'partial' : 'active',
        weeklyActivity
      };
    } catch (error) {
      // Return default stats on error
      return {
        totalReports: 0,
        activeAlerts: 0,
        protectedSessions: 0,
        savedAmount: 0,
        recentAlerts: [],
        protectionStatus: 'inactive',
        weeklyActivity: []
      };
    }
  }

  /**
   * Get protection recommendations
   */
  async getProtectionRecommendations(userId: string): Promise<ProtectionRecommendation[]> {
    try {
      // Use posts API to generate recommendations
      const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
      const posts = await response.json();
      
      const recommendations: ProtectionRecommendation[] = posts.map((post: any) => ({
        id: post.id.toString(),
        title: this.generateRecommendationTitle(post.title),
        description: post.body.substring(0, 100) + '...',
        priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
        category: ['subscription', 'privacy', 'billing', 'cancellation'][Math.floor(Math.random() * 4)],
        actionUrl: `/protection#${post.id}`
      }));
      
      return recommendations;
    } catch (error) {
      return [];
    }
  }

  /**
   * Get daily protection tip
   */
  async getDailyTip(): Promise<{ tip: string; category: string } | null> {
    try {
      const response = await fetch(this.QUOTES_API);
      const quote = await response.json();
      
      const tips = [
        'Always read the fine print before subscribing to any service',
        'Check for pre-selected add-ons during checkout',
        'Look for hidden auto-renewal clauses in terms of service',
        'Verify cancellation policies before signing up',
        'Be wary of countdown timers and artificial urgency',
        'Screenshot important subscription details for your records',
        'Set calendar reminders for free trial end dates',
        'Use virtual credit cards for subscription services'
      ];
      
      const categories = ['Subscription Safety', 'Privacy Protection', 'Billing Awareness', 'Cancellation Rights'];
      
      return {
        tip: tips[Math.floor(Math.random() * tips.length)],
        category: categories[Math.floor(Math.random() * categories.length)]
      };
    } catch (error) {
      return {
        tip: 'Always read terms and conditions carefully before subscribing.',
        category: 'General Safety'
      };
    }
  }

  /**
   * Get real-time alerts
   */
  async getRealTimeAlerts(userId: string): Promise<Alert[]> {
    try {
      // Simulate real-time alerts using comments API
      const response = await fetch('https://jsonplaceholder.typicode.com/comments?_limit=3');
      const comments = await response.json();
      
      const alerts: Alert[] = comments.map((comment: any) => ({
        id: comment.id.toString(),
        type: ['dark_pattern', 'subscription_trap', 'hidden_cost'][Math.floor(Math.random() * 3)] as any,
        severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
        website: comment.email.split('@')[1] || 'unknown.com',
        message: comment.body.substring(0, 80) + '...',
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        status: ['active', 'dismissed'][Math.floor(Math.random() * 2)] as any
      }));
      
      return alerts;
    } catch (error) {
      return [];
    }
  }

  /**
   * Submit user feedback
   */
  async submitFeedback(feedback: { rating: number; comment: string; category: string }): Promise<boolean> {
    try {
      // Simulate API call to submit feedback
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `Feedback - ${feedback.category}`,
          body: feedback.comment,
          userId: 1,
          rating: feedback.rating
        }),
      });
      
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get protection score
   */
  async getProtectionScore(userId: string): Promise<{ score: number; factors: string[]; improvements: string[] }> {
    try {
      // Calculate protection score based on user activity
      const stats = await this.getDashboardStats(userId);
      
      let score = 70; // Base score
      const factors: string[] = [];
      const improvements: string[] = [];
      
      // Adjust score based on activity
      if (stats.totalReports > 20) {
        score += 10;
        factors.push('Active pattern reporting');
      } else {
        improvements.push('Report more dark patterns to improve your score');
      }
      
      if (stats.activeAlerts < 3) {
        score += 10;
        factors.push('Low active alerts');
      } else {
        improvements.push('Address active alerts to improve protection');
      }
      
      if (stats.protectedSessions > 100) {
        score += 10;
        factors.push('High protection usage');
      } else {
        improvements.push('Use protection features more frequently');
      }
      
      return {
        score: Math.min(score, 100),
        factors,
        improvements
      };
    } catch (error) {
      return {
        score: 50,
        factors: [],
        improvements: ['Enable protection features', 'Report dark patterns', 'Stay active']
      };
    }
  }

  /**
   * Generate recent alerts
   */
  private async generateRecentAlerts(): Promise<Alert[]> {
    const alertTypes = ['dark_pattern', 'subscription_trap', 'hidden_cost'] as const;
    const severities = ['low', 'medium', 'high', 'critical'] as const;
    const websites = ['example.com', 'test-service.net', 'subscription-trap.org', 'hidden-fees.com'];
    const messages = [
      'Hidden auto-renewal detected in checkout process',
      'Difficult cancellation process identified',
      'Pre-selected premium add-ons found',
      'Misleading free trial terms discovered',
      'Countdown pressure tactics detected'
    ];
    
    const alerts: Alert[] = [];
    const alertCount = Math.floor(Math.random() * 5) + 1;
    
    for (let i = 0; i < alertCount; i++) {
      alerts.push({
        id: (i + 1).toString(),
        type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        website: websites[Math.floor(Math.random() * websites.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: Math.random() > 0.3 ? 'active' : 'dismissed'
      });
    }
    
    return alerts;
  }

  /**
   * Generate weekly activity data
   */
  private generateWeeklyActivity(): { day: string; reports: number; alerts: number }[] {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    return days.map(day => ({
      day,
      reports: Math.floor(Math.random() * 10) + 1,
      alerts: Math.floor(Math.random() * 5) + 1
    }));
  }

  /**
   * Generate recommendation title
   */
  private generateRecommendationTitle(originalTitle: string): string {
    const recommendations = [
      'Enable Browser Extension Protection',
      'Review Your Subscription Settings',
      'Update Your Cancellation Preferences',
      'Check for Hidden Auto-Renewals',
      'Verify Your Billing Information',
      'Set Up Subscription Alerts',
      'Review Privacy Settings',
      'Enable Two-Factor Authentication'
    ];
    
    return recommendations[Math.floor(Math.random() * recommendations.length)];
  }
}

export const dashboardAPI = new DashboardAPI();