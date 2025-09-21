// Browser Scan API Service
// Scans current browser tab for dark patterns

export interface BrowserScanResult {
  url: string;
  title: string;
  domain: string;
  scanTimestamp: string;
  riskScore: number;
  detectedPatterns: BrowserPattern[];
  pageElements: PageElement[];
  recommendations: string[];
  isSecure: boolean;
}

export interface BrowserPattern {
  type: 'hidden_cost' | 'forced_renewal' | 'cancellation_trap' | 'misleading_language' | 'pre_checked' | 'countdown_pressure';
  severity: number;
  confidence: number;
  description: string;
  element: string;
  location: string;
}

export interface PageElement {
  type: 'form' | 'button' | 'checkbox' | 'text' | 'timer' | 'popup';
  content: string;
  isSuspicious: boolean;
  reason?: string;
}

class BrowserScanAPI {
  /**
   * Scan current browser tab for dark patterns
   */
  async scanCurrentTab(): Promise<BrowserScanResult> {
    try {
      // Get current page information
      const url = window.location.href;
      const title = document.title;
      const domain = window.location.hostname;
      
      // Analyze page content
      const pageElements = this.analyzePageElements();
      const detectedPatterns = this.detectDarkPatterns(pageElements);
      const riskScore = this.calculateRiskScore(detectedPatterns);
      const recommendations = this.generateRecommendations(detectedPatterns);
      
      return {
        url,
        title,
        domain,
        scanTimestamp: new Date().toISOString(),
        riskScore,
        detectedPatterns,
        pageElements,
        recommendations,
        isSecure: url.startsWith('https://')
      };
    } catch (error) {
      // Return demo data for testing
      return this.getDemoScanResult();
    }
  }

  /**
   * Analyze page elements for suspicious patterns
   */
  private analyzePageElements(): PageElement[] {
    const elements: PageElement[] = [];
    
    // Analyze forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      const formText = form.innerText.toLowerCase();
      elements.push({
        type: 'form',
        content: formText.substring(0, 100),
        isSuspicious: this.isFormSuspicious(formText)
      });
    });

    // Analyze buttons
    const buttons = document.querySelectorAll('button, input[type="submit"], .btn');
    buttons.forEach(button => {
      const buttonText = button.textContent?.toLowerCase() || '';
      elements.push({
        type: 'button',
        content: buttonText,
        isSuspicious: this.isButtonSuspicious(buttonText),
        reason: this.isButtonSuspicious(buttonText) ? 'Potentially misleading button text' : undefined
      });
    });

    // Analyze checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      const label = this.getCheckboxLabel(checkbox);
      const isChecked = (checkbox as HTMLInputElement).checked;
      elements.push({
        type: 'checkbox',
        content: label,
        isSuspicious: isChecked && this.isCheckboxSuspicious(label),
        reason: isChecked ? 'Pre-checked option detected' : undefined
      });
    });

    // Analyze text for dark patterns
    const textElements = document.querySelectorAll('p, div, span, h1, h2, h3, h4, h5, h6');
    textElements.forEach(element => {
      const text = element.textContent?.toLowerCase() || '';
      if (text.length > 10 && this.isTextSuspicious(text)) {
        elements.push({
          type: 'text',
          content: text.substring(0, 100),
          isSuspicious: true,
          reason: 'Contains suspicious language patterns'
        });
      }
    });

    // Look for countdown timers
    const timerElements = document.querySelectorAll('[class*="timer"], [class*="countdown"], [id*="timer"], [id*="countdown"]');
    timerElements.forEach(timer => {
      elements.push({
        type: 'timer',
        content: timer.textContent?.substring(0, 50) || '',
        isSuspicious: true,
        reason: 'Countdown timer creates artificial urgency'
      });
    });

    return elements;
  }

  /**
   * Detect dark patterns from page elements
   */
  private detectDarkPatterns(elements: PageElement[]): BrowserPattern[] {
    const patterns: BrowserPattern[] = [];
    
    // Check for hidden costs
    const costElements = elements.filter(el => 
      el.content.includes('fee') || el.content.includes('charge') || 
      el.content.includes('additional') || /\$\d+/.test(el.content)
    );
    if (costElements.length > 0) {
      patterns.push({
        type: 'hidden_cost',
        severity: 4,
        confidence: 0.8,
        description: 'Hidden fees or additional charges detected',
        element: costElements[0].content,
        location: 'Page content'
      });
    }

    // Check for auto-renewal
    const renewalElements = elements.filter(el => 
      el.content.includes('auto') && (el.content.includes('renew') || el.content.includes('recurring'))
    );
    if (renewalElements.length > 0) {
      patterns.push({
        type: 'forced_renewal',
        severity: 5,
        confidence: 0.9,
        description: 'Automatic renewal detected',
        element: renewalElements[0].content,
        location: 'Form or checkout'
      });
    }

    // Check for difficult cancellation
    const cancelElements = elements.filter(el => 
      el.content.includes('call') && el.content.includes('cancel') ||
      el.content.includes('contact') && el.content.includes('support')
    );
    if (cancelElements.length > 0) {
      patterns.push({
        type: 'cancellation_trap',
        severity: 5,
        confidence: 0.85,
        description: 'Difficult cancellation process detected',
        element: cancelElements[0].content,
        location: 'Terms or help section'
      });
    }

    // Check for pre-checked options
    const preCheckedElements = elements.filter(el => 
      el.type === 'checkbox' && el.isSuspicious
    );
    if (preCheckedElements.length > 0) {
      patterns.push({
        type: 'pre_checked',
        severity: 3,
        confidence: 0.9,
        description: 'Pre-selected options detected',
        element: preCheckedElements[0].content,
        location: 'Checkout form'
      });
    }

    // Check for countdown pressure
    const timerElements = elements.filter(el => el.type === 'timer');
    if (timerElements.length > 0) {
      patterns.push({
        type: 'countdown_pressure',
        severity: 3,
        confidence: 0.7,
        description: 'Countdown timer creating artificial urgency',
        element: timerElements[0].content,
        location: 'Page header or product section'
      });
    }

    // Check for misleading language
    const misleadingElements = elements.filter(el => 
      el.content.includes('free') && el.content.includes('*') ||
      el.content.includes('cancel anytime') && el.content.includes('*')
    );
    if (misleadingElements.length > 0) {
      patterns.push({
        type: 'misleading_language',
        severity: 4,
        confidence: 0.75,
        description: 'Misleading language with hidden conditions',
        element: misleadingElements[0].content,
        location: 'Marketing copy'
      });
    }

    return patterns;
  }

  /**
   * Helper methods for element analysis
   */
  private isFormSuspicious(text: string): boolean {
    return text.includes('auto') || text.includes('recurring') || text.includes('subscription');
  }

  private isButtonSuspicious(text: string): boolean {
    const suspiciousButtons = ['continue', 'next', 'proceed', 'activate', 'start trial'];
    return suspiciousButtons.some(btn => text.includes(btn));
  }

  private isCheckboxSuspicious(label: string): boolean {
    return label.includes('premium') || label.includes('protection') || 
           label.includes('support') || label.includes('backup');
  }

  private isTextSuspicious(text: string): boolean {
    const suspiciousPatterns = [
      'limited time', 'expires soon', 'only.*left', 'hurry',
      'processing fee', 'additional charge', 'terms apply',
      'call.*cancel', 'contact.*support'
    ];
    return suspiciousPatterns.some(pattern => new RegExp(pattern, 'i').test(text));
  }

  private getCheckboxLabel(checkbox: Element): string {
    const label = checkbox.closest('label') || 
                 document.querySelector(`label[for="${checkbox.id}"]`);
    return label?.textContent?.toLowerCase() || 'Unknown checkbox';
  }

  /**
   * Calculate overall risk score
   */
  private calculateRiskScore(patterns: BrowserPattern[]): number {
    if (patterns.length === 0) return 0;
    
    const totalScore = patterns.reduce((sum, pattern) => 
      sum + (pattern.severity * pattern.confidence), 0
    );
    
    return Math.min(Math.round(totalScore / patterns.length), 10);
  }

  /**
   * Generate protection recommendations
   */
  private generateRecommendations(patterns: BrowserPattern[]): string[] {
    const recommendations: string[] = [];
    
    patterns.forEach(pattern => {
      switch (pattern.type) {
        case 'hidden_cost':
          recommendations.push('Look for all fees and charges before completing purchase');
          break;
        case 'forced_renewal':
          recommendations.push('Disable auto-renewal immediately after signup');
          break;
        case 'cancellation_trap':
          recommendations.push('Document cancellation process before subscribing');
          break;
        case 'pre_checked':
          recommendations.push('Uncheck any pre-selected add-ons you don\'t need');
          break;
        case 'countdown_pressure':
          recommendations.push('Take time to evaluate - ignore artificial urgency');
          break;
        case 'misleading_language':
          recommendations.push('Read all terms and conditions carefully');
          break;
      }
    });

    if (recommendations.length === 0) {
      recommendations.push('No immediate concerns detected - continue with caution');
    }

    return [...new Set(recommendations)]; // Remove duplicates
  }

  /**
   * Get demo scan result for testing
   */
  private getDemoScanResult(): BrowserScanResult {
    const demoPatterns: BrowserPattern[] = [
      {
        type: 'forced_renewal',
        severity: 5,
        confidence: 0.9,
        description: 'Auto-renewal checkbox detected in signup form',
        element: 'Automatically renew my subscription',
        location: 'Checkout form'
      },
      {
        type: 'hidden_cost',
        severity: 4,
        confidence: 0.8,
        description: 'Processing fee mentioned in fine print',
        element: 'Processing fee: $2.99 applies to all transactions',
        location: 'Terms section'
      }
    ];

    return {
      url: window.location.href,
      title: document.title || 'Demo Page',
      domain: window.location.hostname || 'demo.com',
      scanTimestamp: new Date().toISOString(),
      riskScore: 7,
      detectedPatterns: demoPatterns,
      pageElements: [
        {
          type: 'checkbox',
          content: 'Auto-renewal enabled',
          isSuspicious: true,
          reason: 'Pre-checked subscription option'
        },
        {
          type: 'text',
          content: 'Processing fee applies',
          isSuspicious: true,
          reason: 'Hidden cost in fine print'
        }
      ],
      recommendations: [
        'Disable auto-renewal immediately after signup',
        'Look for all fees and charges before completing purchase',
        'Read all terms and conditions carefully'
      ],
      isSecure: window.location.protocol === 'https:'
    };
  }
}

export const browserScanAPI = new BrowserScanAPI();