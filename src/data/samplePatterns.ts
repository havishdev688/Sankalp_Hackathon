// Sample pattern data for testing
export const samplePatterns = [
  {
    id: '1',
    title: 'Hidden Auto-Renewal Checkbox',
    description: 'Netflix pre-checks auto-renewal option in small text during signup, making it easy to miss',
    company_name: 'Netflix',
    website_url: 'https://netflix.com/signup',
    pattern_type: 'dark_pattern',
    category: 'streaming',
    screenshot_url: 'https://via.placeholder.com/800x600/fee2e2/dc2626?text=Hidden+Auto-Renewal',
    impact_score: 4,
    upvotes: 45,
    downvotes: 3,
    created_at: '2024-01-15T10:30:00Z',
    status: 'approved',
    profiles: {
      username: 'user123',
      display_name: 'John Doe'
    }
  },
  {
    id: '2',
    title: 'Difficult Cancellation Process',
    description: 'Gym membership requires calling during business hours to cancel, no online option available',
    company_name: 'FitLife Gym',
    website_url: 'https://fitlifegym.com',
    pattern_type: 'dark_pattern',
    category: 'fitness',
    screenshot_url: 'https://via.placeholder.com/800x600/fef3c7/f59e0b?text=Call+to+Cancel',
    impact_score: 5,
    upvotes: 67,
    downvotes: 8,
    created_at: '2024-01-14T15:45:00Z',
    status: 'approved',
    profiles: {
      username: 'fitnessfan',
      display_name: 'Sarah Wilson'
    }
  },
  {
    id: '3',
    title: 'Pre-selected Premium Add-ons',
    description: 'Software checkout page has premium support and backup services pre-checked by default',
    company_name: 'CloudSoft Pro',
    website_url: 'https://cloudsoft.com/checkout',
    pattern_type: 'dark_pattern',
    category: 'saas',
    screenshot_url: 'https://via.placeholder.com/800x600/ddd6fe/8b5cf6?text=Pre-checked+Addons',
    impact_score: 3,
    upvotes: 32,
    downvotes: 5,
    created_at: '2024-01-13T09:20:00Z',
    status: 'approved',
    profiles: {
      username: 'techuser',
      display_name: 'Mike Chen'
    }
  },
  {
    id: '4',
    title: 'Clear Cancellation Button',
    description: 'Spotify provides easy-to-find cancel button with clear confirmation dialog',
    company_name: 'Spotify',
    website_url: 'https://spotify.com/account',
    pattern_type: 'ethical_alternative',
    category: 'streaming',
    screenshot_url: 'https://via.placeholder.com/800x600/dcfce7/16a34a?text=Easy+Cancel',
    impact_score: 0,
    upvotes: 89,
    downvotes: 2,
    created_at: '2024-01-12T14:10:00Z',
    status: 'approved',
    profiles: {
      username: 'musiclover',
      display_name: 'Emma Davis'
    }
  },
  {
    id: '5',
    title: 'Countdown Timer Pressure',
    description: 'E-commerce site shows fake countdown timer claiming limited stock to pressure quick purchase',
    company_name: 'QuickBuy Store',
    website_url: 'https://quickbuy.com/deals',
    pattern_type: 'dark_pattern',
    category: 'other',
    screenshot_url: 'https://via.placeholder.com/800x600/fee2e2/dc2626?text=Countdown+Timer',
    impact_score: 3,
    upvotes: 28,
    downvotes: 12,
    created_at: '2024-01-11T11:30:00Z',
    status: 'approved',
    profiles: {
      username: 'shopper99',
      display_name: 'Alex Johnson'
    }
  },
  {
    id: '6',
    title: 'Transparent Pricing Display',
    description: 'SaaS platform shows all costs upfront including taxes and fees before checkout',
    company_name: 'HonestSaaS',
    website_url: 'https://honestsaas.com/pricing',
    pattern_type: 'ethical_alternative',
    category: 'saas',
    screenshot_url: 'https://via.placeholder.com/800x600/dcfce7/16a34a?text=Clear+Pricing',
    impact_score: 0,
    upvotes: 56,
    downvotes: 1,
    created_at: '2024-01-10T16:45:00Z',
    status: 'approved',
    profiles: {
      username: 'developer',
      display_name: 'Lisa Park'
    }
  }
];

export const sampleImageAnalysisResults = {
  'hidden-auto-renewal': {
    isValid: true,
    detectedPatterns: [
      {
        type: 'forced_renewal' as const,
        confidence: 0.9,
        description: 'Auto-renewal checkbox detected in fine print',
        location: { x: 150, y: 300, width: 250, height: 30 },
        severity: 5
      },
      {
        type: 'hidden_cost' as const,
        confidence: 0.8,
        description: 'Processing fee mentioned in small text',
        location: { x: 100, y: 450, width: 200, height: 20 },
        severity: 4
      }
    ],
    overallRiskScore: 8,
    confidence: 0.85,
    analysisDetails: {
      textElements: [
        'Auto-renewal enabled',
        'Processing fee: $2.99',
        'Terms and conditions apply',
        'Cancel anytime*'
      ],
      uiElements: [
        {
          type: 'checkbox' as const,
          text: 'Auto-renewal enabled',
          isHidden: false,
          isSuspicious: true,
          coordinates: { x: 150, y: 300, width: 250, height: 30 }
        }
      ],
      colorScheme: ['Red urgency colors detected'],
      suspiciousElements: [
        {
          element: 'Auto-renewal enabled',
          reason: 'Pre-checked subscription renewal',
          riskLevel: 'critical' as const
        }
      ]
    }
  }
};