// Pattern Analysis API Service
// Integrates with free APIs to enhance pattern reporting functionality

import { imageAnalysisAPI, ImageAnalysisResult } from './imageAnalysisAPI';

export interface URLAnalysisResult {
  isValid: boolean;
  domain: string;
  title?: string;
  description?: string;
  screenshot?: string;
  riskScore: number;
  detectedPatterns: string[];
  imageAnalysis?: ImageAnalysisResult;
}

export interface CompanyInfo {
  name: string;
  domain: string;
  industry?: string;
  description?: string;
  logo?: string;
}

export interface PatternValidationResult {
  isValid: boolean;
  confidence: number;
  suggestedCategory: string;
  similarPatterns: string[];
  riskAssessment: {
    severity: number;
    userImpact: number;
    legalRisk: number;
  };
  imageAnalysis?: ImageAnalysisResult;
}

class PatternAnalysisAPI {
  private readonly SCREENSHOT_API = 'https://api.screenshotmachine.com';
  private readonly CLEARBIT_API = 'https://autocomplete.clearbit.com/v1/companies/suggest';
  
  /**
   * Analyze a URL for potential dark patterns
   */
  async analyzeURL(url: string): Promise<URLAnalysisResult> {
    try {
      const domain = new URL(url).hostname;
      
      // Validate URL and get basic info
      const urlInfo = await this.getURLInfo(url);
      
      // Analyze for dark patterns using multiple methods
      const patternAnalysis = await this.detectPatternsFromURL(url);
      
      const screenshot = await this.getScreenshot(url);
      let imageAnalysis: ImageAnalysisResult | undefined;
      
      // Analyze screenshot if available
      if (screenshot) {
        imageAnalysis = await imageAnalysisAPI.analyzeImage(screenshot);
      }
      
      return {
        isValid: true,
        domain,
        title: urlInfo.title,
        description: urlInfo.description,
        screenshot,
        riskScore: Math.max(patternAnalysis.riskScore, imageAnalysis?.overallRiskScore || 0),
        detectedPatterns: [...patternAnalysis.patterns, ...(imageAnalysis?.detectedPatterns.map(p => p.description) || [])],
        imageAnalysis
      };
    } catch (error) {
      return {
        isValid: false,
        domain: '',
        riskScore: 0,
        detectedPatterns: []
      };
    }
  }

  /**
   * Get company information from domain
   */
  async getCompanyInfo(domain: string): Promise<CompanyInfo | null> {
    try {
      // Use Clearbit API for company data
      const response = await fetch(`${this.CLEARBIT_API}?query=${domain}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const company = data[0];
        return {
          name: company.name,
          domain: company.domain,
          industry: company.category,
          description: company.description,
          logo: company.logo
        };
      }
      
      // Fallback to domain analysis
      return {
        name: domain.replace(/^www\./, '').split('.')[0],
        domain: domain
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Validate and enhance pattern submission
   */
  async validatePattern(patternData: any): Promise<PatternValidationResult> {
    try {
      // Analyze pattern description for keywords
      const keywords = this.extractKeywords(patternData.description);
      
      // Determine suggested category
      const suggestedCategory = this.categorizePattern(keywords);
      
      // Find similar patterns
      const similarPatterns = await this.findSimilarPatterns(keywords);
      
      // Assess risk levels
      const riskAssessment = this.assessRisk(patternData, keywords);
      
      // Analyze screenshot if provided
      let imageAnalysis: ImageAnalysisResult | undefined;
      if (patternData.screenshot_url) {
        imageAnalysis = await imageAnalysisAPI.analyzeImage(patternData.screenshot_url);
        
        // Enhance risk assessment with image analysis
        if (imageAnalysis.isValid && imageAnalysis.detectedPatterns.length > 0) {
          const maxSeverity = Math.max(...imageAnalysis.detectedPatterns.map(p => p.severity));
          riskAssessment.severity = Math.max(riskAssessment.severity, maxSeverity);
          riskAssessment.userImpact = Math.max(riskAssessment.userImpact, imageAnalysis.overallRiskScore);
        }
      }
      
      return {
        isValid: true,
        confidence: this.calculateConfidence(patternData, keywords, imageAnalysis),
        suggestedCategory,
        similarPatterns,
        riskAssessment,
        imageAnalysis
      };
    } catch (error) {
      return {
        isValid: false,
        confidence: 0,
        suggestedCategory: 'other',
        similarPatterns: [],
        riskAssessment: { severity: 1, userImpact: 1, legalRisk: 1 }
      };
    }
  }

  /**
   * Analyze uploaded image for dark patterns
   */
  async analyzeImageUpload(imageUrl: string): Promise<ImageAnalysisResult> {
    return await imageAnalysisAPI.analyzeImage(imageUrl);
  }

  /**
   * Get screenshot of URL
   */
  private async getScreenshot(url: string): Promise<string | undefined> {
    try {
      // Using a free screenshot service
      const screenshotUrl = `https://api.apiflash.com/v1/urltoimage?access_key=demo&url=${encodeURIComponent(url)}&format=jpeg&width=1200&height=800`;
      
      // Verify the screenshot URL is accessible
      const response = await fetch(screenshotUrl, { method: 'HEAD' });
      if (response.ok) {
        return screenshotUrl;
      }
      
      // Fallback to placeholder
      return `https://via.placeholder.com/1200x800/f3f4f6/6b7280?text=${encodeURIComponent(new URL(url).hostname)}`;
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Get basic URL information
   */
  private async getURLInfo(url: string): Promise<{ title?: string; description?: string }> {
    try {
      // Use a CORS proxy to fetch page metadata
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      const data = await response.json();
      
      if (data.contents) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, 'text/html');
        
        const title = doc.querySelector('title')?.textContent || 
                     doc.querySelector('meta[property="og:title"]')?.getAttribute('content');
        
        const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
                           doc.querySelector('meta[property="og:description"]')?.getAttribute('content');
        
        return { title, description };
      }
      
      return {};
    } catch (error) {
      return {};
    }
  }

  /**
   * Detect patterns from URL analysis
   */
  private async detectPatternsFromURL(url: string): Promise<{ riskScore: number; patterns: string[] }> {
    const patterns: string[] = [];
    let riskScore = 0;
    
    const domain = new URL(url).hostname.toLowerCase();
    const urlPath = url.toLowerCase();
    
    // Enhanced pattern detection based on domain and URL structure
    
    // LinkedIn-specific patterns
    if (domain.includes('linkedin.com')) {
      if (urlPath.includes('notifications')) {
        patterns.push('Notification engagement pattern - designed to increase user engagement and time on platform');
        riskScore += 2;
      }
      if (urlPath.includes('premium') || urlPath.includes('sales')) {
        patterns.push('Premium upselling detected in URL structure');
        riskScore += 3;
      }
      // LinkedIn generally has moderate engagement patterns
      patterns.push('Social media engagement optimization - uses behavioral nudges to increase platform usage');
      riskScore += 1;
    }
    
    // General suspicious URL patterns
    const suspiciousPatterns = [
      { keyword: 'free-trial', message: 'Free trial offer - check for auto-renewal terms', risk: 3 },
      { keyword: 'limited-time', message: 'Artificial urgency - limited time offer detected', risk: 2 },
      { keyword: 'act-now', message: 'Pressure tactic - immediate action required', risk: 2 },
      { keyword: 'urgent', message: 'Urgency manipulation detected', risk: 2 },
      { keyword: 'expires', message: 'Expiration pressure - time-sensitive offer', risk: 2 },
      { keyword: 'cancel-anytime', message: 'Potentially misleading cancellation claim', risk: 3 },
      { keyword: 'no-commitment', message: 'No commitment claim - verify actual terms', risk: 2 },
      { keyword: 'risk-free', message: 'Risk-free claim - check for hidden conditions', risk: 2 }
    ];
    
    suspiciousPatterns.forEach(pattern => {
      if (urlPath.includes(pattern.keyword)) {
        patterns.push(pattern.message);
        riskScore += pattern.risk;
      }
    });
    
    // Subscription and billing patterns
    if (urlPath.includes('subscribe') || urlPath.includes('subscription')) {
      patterns.push('Subscription signup page - verify auto-renewal terms and cancellation policy');
      riskScore += 2;
    }
    
    if (urlPath.includes('billing') || urlPath.includes('payment')) {
      patterns.push('Payment/billing page - check for hidden fees and pre-selected options');
      riskScore += 2;
    }
    
    if (urlPath.includes('checkout')) {
      patterns.push('Checkout process - watch for pre-checked add-ons and hidden costs');
      riskScore += 2;
    }
    
    // Social media and engagement patterns
    const socialDomains = ['facebook.com', 'instagram.com', 'twitter.com', 'tiktok.com', 'snapchat.com'];
    if (socialDomains.some(social => domain.includes(social))) {
      patterns.push('Social media platform - uses engagement optimization and behavioral nudges');
      riskScore += 1;
    }
    
    // E-commerce patterns
    const ecommerceDomains = ['amazon.com', 'ebay.com', 'shopify', 'store', 'shop'];
    if (ecommerceDomains.some(ecom => domain.includes(ecom))) {
      patterns.push('E-commerce platform - check for hidden shipping costs and return policies');
      riskScore += 1;
    }
    
    // Streaming service patterns
    const streamingDomains = ['netflix.com', 'hulu.com', 'disney', 'prime', 'spotify.com'];
    if (streamingDomains.some(stream => domain.includes(stream))) {
      patterns.push('Streaming service - verify auto-renewal settings and cancellation process');
      riskScore += 2;
    }
    
    // News and media patterns
    if (urlPath.includes('subscribe') && (domain.includes('news') || domain.includes('times') || domain.includes('post'))) {
      patterns.push('News subscription - check for introductory pricing and auto-renewal terms');
      riskScore += 3;
    }
    
    // Domain reputation and security
    const knownProblematicDomains = ['example-scam.com', 'fake-service.net', 'phishing-site.org'];
    if (knownProblematicDomains.some(d => domain.includes(d))) {
      patterns.push('Known problematic domain - high risk of deceptive practices');
      riskScore += 5;
    }
    
    // URL structure analysis
    if (urlPath.includes('ref=') || urlPath.includes('utm_') || urlPath.includes('affiliate')) {
      patterns.push('Tracking parameters detected - your activity may be monitored for marketing purposes');
      riskScore += 1;
    }
    
    // If no patterns detected, provide general assessment
    if (patterns.length === 0) {
      patterns.push('No obvious dark patterns detected in URL structure');
    }
    
    return {
      riskScore: Math.min(riskScore, 10),
      patterns
    };
  }

  /**
   * Extract keywords from pattern description
   */
  private extractKeywords(description: string): string[] {
    const keywords = description.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    const darkPatternKeywords = [
      'hidden', 'auto', 'renewal', 'cancel', 'difficult', 'confusing',
      'misleading', 'deceptive', 'trick', 'trap', 'forced', 'pre-checked',
      'countdown', 'urgent', 'limited', 'expires', 'fee', 'charge'
    ];
    
    return keywords.filter(keyword => 
      darkPatternKeywords.some(dpKeyword => keyword.includes(dpKeyword))
    );
  }

  /**
   * Categorize pattern based on keywords
   */
  private categorizePattern(keywords: string[]): string {
    const categoryMap = {
      saas: ['software', 'service', 'platform', 'tool', 'app'],
      streaming: ['video', 'music', 'stream', 'watch', 'listen'],
      news: ['news', 'article', 'media', 'publication'],
      fitness: ['fitness', 'health', 'workout', 'exercise', 'gym'],
      education: ['course', 'learn', 'education', 'training', 'study']
    };
    
    for (const [category, categoryKeywords] of Object.entries(categoryMap)) {
      if (keywords.some(keyword => 
        categoryKeywords.some(catKeyword => keyword.includes(catKeyword))
      )) {
        return category;
      }
    }
    
    return 'other';
  }

  /**
   * Find similar patterns using mock API
   */
  private async findSimilarPatterns(keywords: string[]): Promise<string[]> {
    // Mock similar patterns based on keywords
    const similarPatterns = [
      'Hidden auto-renewal checkbox',
      'Confusing cancellation process',
      'Pre-selected premium add-ons',
      'Misleading free trial terms',
      'Difficult unsubscribe process'
    ];
    
    // Return patterns that might be related based on keywords
    return similarPatterns.filter(() => Math.random() > 0.6).slice(0, 3);
  }

  /**
   * Assess risk levels
   */
  private assessRisk(patternData: any, keywords: string[]): { severity: number; userImpact: number; legalRisk: number } {
    let severity = 1;
    let userImpact = 1;
    let legalRisk = 1;
    
    // Assess severity based on keywords
    const highSeverityKeywords = ['hidden', 'deceptive', 'misleading', 'trap'];
    const mediumSeverityKeywords = ['confusing', 'difficult', 'auto'];
    
    if (keywords.some(k => highSeverityKeywords.some(h => k.includes(h)))) {
      severity = 5;
    } else if (keywords.some(k => mediumSeverityKeywords.some(m => k.includes(m)))) {
      severity = 3;
    }
    
    // Assess user impact
    if (patternData.impact_score) {
      userImpact = patternData.impact_score;
    } else {
      userImpact = Math.min(severity + 1, 5);
    }
    
    // Assess legal risk
    const legalRiskKeywords = ['hidden', 'deceptive', 'misleading', 'forced'];
    if (keywords.some(k => legalRiskKeywords.some(l => k.includes(l)))) {
      legalRisk = Math.min(severity, 5);
    }
    
    return { severity, userImpact, legalRisk };
  }

  /**
   * Calculate confidence score
   */
  private calculateConfidence(patternData: any, keywords: string[], imageAnalysis?: ImageAnalysisResult): number {
    let confidence = 0.5; // Base confidence
    
    // Increase confidence based on available data
    if (patternData.website_url) confidence += 0.2;
    if (patternData.company_name) confidence += 0.1;
    if (patternData.screenshot_url) confidence += 0.1;
    if (keywords.length > 0) confidence += 0.1;
    
    // Boost confidence with image analysis
    if (imageAnalysis?.isValid) {
      confidence += 0.2;
      if (imageAnalysis.detectedPatterns.length > 0) {
        confidence += 0.1;
      }
    }
    
    return Math.min(confidence, 1.0);
  }

  /**
   * Get pattern statistics from mock API
   */
  async getPatternStatistics(): Promise<any> {
    try {
      // Using JSONPlaceholder as a mock API for statistics
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      const posts = await response.json();
      
      // Transform the data into pattern statistics
      return {
        totalPatterns: posts.length,
        darkPatterns: Math.floor(posts.length * 0.7),
        ethicalAlternatives: Math.floor(posts.length * 0.3),
        topCategories: [
          { name: 'SaaS', count: Math.floor(posts.length * 0.3) },
          { name: 'Streaming', count: Math.floor(posts.length * 0.25) },
          { name: 'E-commerce', count: Math.floor(posts.length * 0.2) },
          { name: 'News', count: Math.floor(posts.length * 0.15) },
          { name: 'Other', count: Math.floor(posts.length * 0.1) }
        ],
        recentActivity: posts.slice(0, 5).map((post: any) => ({
          id: post.id,
          title: post.title,
          type: Math.random() > 0.5 ? 'dark_pattern' : 'ethical_alternative',
          timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        }))
      };
    } catch (error) {
      return {
        totalPatterns: 0,
        darkPatterns: 0,
        ethicalAlternatives: 0,
        topCategories: [],
        recentActivity: []
      };
    }
  }
}

export const patternAnalysisAPI = new PatternAnalysisAPI();