// Dark Pattern Detection Service
// This service detects common dark patterns in subscription flows

export interface DarkPatternDetectionResult {
  detected: boolean;
  patternType: string;
  severity: number; // 1-5 scale
  message: string;
  elements: string[];
  suggestions: string[];
}

export interface DetectionRule {
  id: string;
  name: string;
  patternType: string;
  severity: number;
  selectors: string[];
  textPatterns: RegExp[];
  attributes: { [key: string]: string[] };
  description: string;
  suggestion: string;
}

// Common dark pattern detection rules
export const DARK_PATTERN_RULES: DetectionRule[] = [
  {
    id: 'hidden-auto-renewal',
    name: 'Hidden Auto-Renewal',
    patternType: 'forced_renewal',
    severity: 4,
    selectors: [
      'input[type="checkbox"][checked]',
      '.auto-renewal',
      '.recurring-billing',
      '[data-auto-renew="true"]'
    ],
    textPatterns: [
      /automatically.*renew/i,
      /recurring.*billing/i,
      /auto.*renewal/i,
      /subscription.*continues/i
    ],
    attributes: {
      'data-auto-renew': ['true', '1', 'yes'],
      'data-recurring': ['true', '1', 'yes']
    },
    description: 'Subscription will automatically renew without clear user consent',
    suggestion: 'Look for auto-renewal settings and disable them before subscribing'
  },
  {
    id: 'confusing-cancellation',
    name: 'Confusing Cancellation Process',
    patternType: 'cancellation_trap',
    severity: 5,
    selectors: [
      '.cancellation-hidden',
      '.cancel-difficult',
      '[data-cancel-hidden="true"]',
      '.no-cancel-button'
    ],
    textPatterns: [
      /contact.*support.*to.*cancel/i,
      /call.*to.*cancel/i,
      /email.*to.*cancel/i,
      /cancellation.*not.*available/i
    ],
    attributes: {
      'data-cancel-hidden': ['true', '1', 'yes'],
      'data-cancel-difficult': ['true', '1', 'yes']
    },
    description: 'Cancellation process is hidden or overly complicated',
    suggestion: 'Document the cancellation process and consider legal action if necessary'
  },
  {
    id: 'hidden-costs',
    name: 'Hidden Additional Costs',
    patternType: 'hidden_cost',
    severity: 4,
    selectors: [
      '.hidden-fee',
      '.additional-cost',
      '.service-fee',
      '[data-hidden-cost="true"]'
    ],
    textPatterns: [
      /additional.*fees.*may.*apply/i,
      /service.*fee.*not.*included/i,
      /taxes.*and.*fees.*extra/i,
      /processing.*fee/i
    ],
    attributes: {
      'data-hidden-cost': ['true', '1', 'yes'],
      'data-additional-fee': ['true', '1', 'yes']
    },
    description: 'Additional costs are hidden or not clearly disclosed',
    suggestion: 'Look for fine print and calculate total cost before subscribing'
  },
  {
    id: 'misleading-language',
    name: 'Misleading Language',
    patternType: 'misleading_language',
    severity: 3,
    selectors: [
      '.misleading-text',
      '.confusing-terms',
      '[data-misleading="true"]'
    ],
    textPatterns: [
      /free.*trial.*credit.*card/i,
      /no.*commitment.*billing/i,
      /cancel.*anytime.*charges/i,
      /unlimited.*with.*restrictions/i
    ],
    attributes: {
      'data-misleading': ['true', '1', 'yes'],
      'data-confusing': ['true', '1', 'yes']
    },
    description: 'Language is misleading or creates false expectations',
    suggestion: 'Read terms carefully and ask for clarification if needed'
  },
  {
    id: 'pre-checked-addons',
    name: 'Pre-checked Add-ons',
    patternType: 'hidden_cost',
    severity: 3,
    selectors: [
      'input[type="checkbox"][checked]',
      '.addon-checked',
      '.premium-included',
      '[data-pre-checked="true"]'
    ],
    textPatterns: [
      /premium.*features.*included/i,
      /add.*protection.*plan/i,
      /extended.*warranty/i,
      /additional.*services/i
    ],
    attributes: {
      'data-pre-checked': ['true', '1', 'yes'],
      'data-default-checked': ['true', '1', 'yes']
    },
    description: 'Additional services are pre-selected without clear disclosure',
    suggestion: 'Uncheck any pre-selected add-ons you don\'t want'
  },
  {
    id: 'countdown-pressure',
    name: 'Artificial Countdown Pressure',
    patternType: 'misleading_language',
    severity: 2,
    selectors: [
      '.countdown-timer',
      '.limited-time',
      '.expires-soon',
      '[data-countdown="true"]'
    ],
    textPatterns: [
      /offer.*expires.*in/i,
      /limited.*time.*only/i,
      /hurry.*before.*gone/i,
      /only.*few.*left/i
    ],
    attributes: {
      'data-countdown': ['true', '1', 'yes'],
      'data-pressure': ['true', '1', 'yes']
    },
    description: 'Artificial time pressure to force quick decisions',
    suggestion: 'Take your time to evaluate the offer properly'
  }
];

export class DarkPatternDetector {
  private rules: DetectionRule[];

  constructor(customRules: DetectionRule[] = []) {
    this.rules = [...DARK_PATTERN_RULES, ...customRules];
  }

  /**
   * Scan a webpage for dark patterns
   */
  async scanPage(url: string = window.location.href): Promise<DarkPatternDetectionResult[]> {
    const results: DarkPatternDetectionResult[] = [];

    for (const rule of this.rules) {
      const result = this.detectPattern(rule);
      if (result.detected) {
        results.push(result);
      }
    }

    return results;
  }

  /**
   * Detect a specific pattern using a rule
   */
  private detectPattern(rule: DetectionRule): DarkPatternDetectionResult {
    const elements: string[] = [];
    const suggestions: string[] = [rule.suggestion];

    // Check DOM selectors
    for (const selector of rule.selectors) {
      const foundElements = document.querySelectorAll(selector);
      foundElements.forEach(element => {
        elements.push(element.outerHTML.substring(0, 100) + '...');
      });
    }

    // Check text patterns
    const pageText = document.body.innerText;
    for (const pattern of rule.textPatterns) {
      if (pattern.test(pageText)) {
        const matches = pageText.match(pattern);
        if (matches) {
          elements.push(`Text match: "${matches[0]}"`);
        }
      }
    }

    // Check attributes
    for (const [attr, values] of Object.entries(rule.attributes)) {
      const elementsWithAttr = document.querySelectorAll(`[${attr}]`);
      elementsWithAttr.forEach(element => {
        const value = element.getAttribute(attr);
        if (value && values.includes(value.toLowerCase())) {
          elements.push(`Attribute match: ${attr}="${value}"`);
        }
      });
    }

    return {
      detected: elements.length > 0,
      patternType: rule.patternType,
      severity: rule.severity,
      message: rule.description,
      elements,
      suggestions
    };
  }

  /**
   * Get protection recommendations based on detected patterns
   */
  getProtectionRecommendations(results: DarkPatternDetectionResult[]): string[] {
    const recommendations: string[] = [];

    if (results.some(r => r.patternType === 'forced_renewal')) {
      recommendations.push('⚠️ Auto-renewal detected! Disable automatic billing before subscribing.');
    }

    if (results.some(r => r.patternType === 'cancellation_trap')) {
      recommendations.push('🚫 Difficult cancellation detected! Document the cancellation process.');
    }

    if (results.some(r => r.patternType === 'hidden_cost')) {
      recommendations.push('💰 Hidden costs detected! Check for additional fees and taxes.');
    }

    if (results.some(r => r.patternType === 'misleading_language')) {
      recommendations.push('📝 Misleading language detected! Read terms carefully.');
    }

    if (results.length === 0) {
      recommendations.push('✅ No obvious dark patterns detected. Still, read terms carefully.');
    }

    return recommendations;
  }

  /**
   * Generate a protection alert
   */
  generateAlert(result: DarkPatternDetectionResult, url: string) {
    return {
      website_url: url,
      pattern_detected: result.patternType,
      severity: result.severity,
      alert_message: result.message,
      protection_action: result.severity >= 4 ? 'block' : 'warn',
      is_active: true
    };
  }
}

// Browser extension integration
export class BrowserExtensionDetector extends DarkPatternDetector {
  private port: chrome.runtime.Port | null = null;

  constructor() {
    super();
    this.initializeExtension();
  }

  private initializeExtension() {
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      this.port = chrome.runtime.connect({ name: 'dark-pattern-detector' });
    }
  }

  /**
   * Send detection results to extension background script
   */
  async reportResults(results: DarkPatternDetectionResult[], url: string) {
    if (this.port) {
      this.port.postMessage({
        type: 'DETECTION_RESULTS',
        url,
        results,
        timestamp: Date.now()
      });
    }
  }

  /**
   * Show protection overlay on page
   */
  showProtectionOverlay(results: DarkPatternDetectionResult[]) {
    const overlay = document.createElement('div');
    overlay.id = 'dark-pattern-shield-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      background: #fee2e2;
      border: 2px solid #dc2626;
      border-radius: 8px;
      padding: 16px;
      max-width: 300px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    const title = document.createElement('div');
    title.style.cssText = 'font-weight: bold; color: #dc2626; margin-bottom: 8px;';
    title.textContent = '🛡️ Dark Pattern Detected!';

    const content = document.createElement('div');
    content.style.cssText = 'font-size: 14px; color: #374151; line-height: 1.4;';

    results.forEach(result => {
      const item = document.createElement('div');
      item.style.cssText = 'margin-bottom: 8px; padding: 8px; background: white; border-radius: 4px;';
      item.innerHTML = `
        <div style="font-weight: 500; color: #dc2626;">${result.message}</div>
        <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">${result.suggestions[0]}</div>
      `;
      content.appendChild(item);
    });

    const closeButton = document.createElement('button');
    closeButton.style.cssText = `
      position: absolute;
      top: 8px;
      right: 8px;
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      color: #6b7280;
    `;
    closeButton.textContent = '×';
    closeButton.onclick = () => overlay.remove();

    overlay.appendChild(title);
    overlay.appendChild(content);
    overlay.appendChild(closeButton);
    document.body.appendChild(overlay);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.remove();
      }
    }, 10000);
  }
}

// Export singleton instance
export const darkPatternDetector = new DarkPatternDetector();
export const browserExtensionDetector = new BrowserExtensionDetector();
