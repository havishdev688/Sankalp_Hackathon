// Setup script for user protection features
// Populates the database with cancellation guides and sample data

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'your-service-key';

if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your-supabase-url' || supabaseKey === 'your-service-key') {
  console.error('Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample cancellation guides
const cancellationGuides = [
  {
    company_name: 'Netflix',
    service_name: 'Netflix Streaming',
    category: 'streaming',
    difficulty_level: 1,
    steps: [
      {
        title: 'Sign in to your account',
        description: 'Go to netflix.com and sign in with your email and password'
      },
      {
        title: 'Go to Account Settings',
        description: 'Click on your profile icon in the top right, then select "Account"'
      },
      {
        title: 'Cancel Membership',
        description: 'Scroll down to "Membership & Billing" and click "Cancel Membership"'
      },
      {
        title: 'Confirm Cancellation',
        description: 'Follow the prompts to confirm your cancellation'
      }
    ],
    direct_cancellation_url: 'https://www.netflix.com/youraccount',
    estimated_time: '2-3 minutes',
    tips: [
      'You can continue using Netflix until your current billing period ends',
      'You can reactivate your account anytime',
      'Download content before cancelling if you want to keep it offline'
    ],
    legal_rights: 'You have the right to cancel your subscription at any time without penalty.'
  },
  {
    company_name: 'Adobe',
    service_name: 'Creative Cloud',
    category: 'saas',
    difficulty_level: 4,
    steps: [
      {
        title: 'Sign in to Adobe Account',
        description: 'Go to account.adobe.com and sign in'
      },
      {
        title: 'Navigate to Plans',
        description: 'Click on "Plans" in the left sidebar'
      },
      {
        title: 'Manage Plan',
        description: 'Find your Creative Cloud plan and click "Manage plan"'
      },
      {
        title: 'Cancel Subscription',
        description: 'Click "Cancel plan" and follow the prompts'
      },
      {
        title: 'Contact Support if Needed',
        description: 'If cancellation is not available online, contact Adobe support'
      }
    ],
    direct_cancellation_url: 'https://account.adobe.com/plans',
    phone_number: '1-800-833-6687',
    email: 'support@adobe.com',
    chat_support_url: 'https://helpx.adobe.com/contact.html',
    estimated_time: '10-15 minutes',
    tips: [
      'Adobe may offer retention discounts - be firm if you want to cancel',
      'You may be charged an early termination fee for annual plans',
      'Download your files before cancelling as access will be lost',
      'Consider pausing instead of cancelling if you might return'
    ],
    legal_rights: 'You may be subject to early termination fees for annual subscriptions. Check your contract terms.'
  },
  {
    company_name: 'Spotify',
    service_name: 'Spotify Premium',
    category: 'streaming',
    difficulty_level: 2,
    steps: [
      {
        title: 'Go to Account Page',
        description: 'Visit spotify.com/account or open the app and go to Settings'
      },
      {
        title: 'Subscription Section',
        description: 'Find the "Subscription" section'
      },
      {
        title: 'Cancel Premium',
        description: 'Click "Cancel Premium" or "Cancel subscription"'
      },
      {
        title: 'Confirm Cancellation',
        description: 'Follow the prompts to confirm your cancellation'
      }
    ],
    direct_cancellation_url: 'https://www.spotify.com/account/subscription/',
    estimated_time: '3-5 minutes',
    tips: [
      'You can continue using Premium until your current billing period ends',
      'Your playlists and saved music will remain',
      'You can reactivate anytime',
      'Consider the free tier if you want to keep using Spotify'
    ],
    legal_rights: 'You have the right to cancel your subscription at any time without penalty.'
  },
  {
    company_name: 'Amazon',
    service_name: 'Prime Membership',
    category: 'ecommerce',
    difficulty_level: 3,
    steps: [
      {
        title: 'Sign in to Amazon',
        description: 'Go to amazon.com and sign in to your account'
      },
      {
        title: 'Account & Lists',
        description: 'Hover over "Account & Lists" in the top right corner'
      },
      {
        title: 'Prime Membership',
        description: 'Click on "Prime Membership" from the dropdown'
      },
      {
        title: 'End Membership',
        description: 'Click "End membership" and follow the prompts'
      }
    ],
    direct_cancellation_url: 'https://www.amazon.com/gp/primecentral',
    estimated_time: '5-7 minutes',
    tips: [
      'You may be offered a refund if you haven\'t used Prime benefits much',
      'You can continue using Prime until your current period ends',
      'Consider pausing instead of cancelling if you might return',
      'You can reactivate anytime'
    ],
    legal_rights: 'You have the right to cancel your subscription at any time. Refunds may be available based on usage.'
  },
  {
    company_name: 'Microsoft',
    service_name: 'Office 365',
    category: 'saas',
    difficulty_level: 3,
    steps: [
      {
        title: 'Sign in to Microsoft Account',
        description: 'Go to account.microsoft.com and sign in'
      },
      {
        title: 'Services & Subscriptions',
        description: 'Click on "Services & subscriptions"'
      },
      {
        title: 'Manage Subscription',
        description: 'Find your Office 365 subscription and click "Manage"'
      },
      {
        title: 'Cancel Subscription',
        description: 'Click "Cancel" and follow the prompts'
      }
    ],
    direct_cancellation_url: 'https://account.microsoft.com/services',
    phone_number: '1-800-642-7676',
    estimated_time: '5-10 minutes',
    tips: [
      'You may be charged an early termination fee for annual plans',
      'Download your files before cancelling',
      'Consider switching to a different plan instead of cancelling',
      'You can reactivate within 30 days without losing data'
    ],
    legal_rights: 'You may be subject to early termination fees for annual subscriptions. Check your contract terms.'
  },
  {
    company_name: 'Gym Membership',
    service_name: 'Planet Fitness',
    category: 'fitness',
    difficulty_level: 5,
    steps: [
      {
        title: 'Visit Your Home Club',
        description: 'You must visit your home club in person to cancel'
      },
      {
        title: 'Bring Required Documents',
        description: 'Bring your membership card and photo ID'
      },
      {
        title: 'Fill Out Cancellation Form',
        description: 'Complete the cancellation form at the front desk'
      },
      {
        title: 'Pay Any Outstanding Fees',
        description: 'Pay any outstanding fees or dues'
      },
      {
        title: 'Get Confirmation',
        description: 'Get written confirmation of your cancellation'
      }
    ],
    phone_number: '1-844-880-7180',
    estimated_time: '30-60 minutes (including travel)',
    tips: [
      'Cancellation must be done in person at your home club',
      'You may need to give 30 days notice',
      'Bring all required documents to avoid delays',
      'Get written confirmation of cancellation',
      'Consider freezing your membership instead of cancelling'
    ],
    legal_rights: 'You have the right to cancel your membership, but you may be required to visit in person and give notice.'
  }
];

// Sample protection alerts
const sampleAlerts = [
  {
    website_url: 'https://example-subscription-trap.com',
    pattern_detected: 'forced_renewal',
    severity: 4,
    alert_message: 'Auto-renewal detected! This subscription will charge you automatically.',
    protection_action: 'warn',
    is_active: true
  },
  {
    website_url: 'https://hidden-costs-example.com',
    pattern_detected: 'hidden_cost',
    severity: 3,
    alert_message: 'Hidden costs detected! Check for additional fees and taxes.',
    protection_action: 'warn',
    is_active: true
  },
  {
    website_url: 'https://difficult-cancel.com',
    pattern_detected: 'cancellation_trap',
    severity: 5,
    alert_message: 'Difficult cancellation process detected! Document the process.',
    protection_action: 'block',
    is_active: true
  }
];

async function setupUserProtection() {
  console.log('🚀 Setting up user protection features...');

  try {
    // Insert cancellation guides
    console.log('📝 Inserting cancellation guides...');
    const { data: guides, error: guidesError } = await supabase
      .from('cancellation_guides')
      .insert(cancellationGuides);

    if (guidesError) {
      console.error('Error inserting cancellation guides:', guidesError);
    } else {
      console.log(`✅ Inserted ${cancellationGuides.length} cancellation guides`);
    }

    // Insert sample protection alerts (for demo purposes)
    console.log('🚨 Inserting sample protection alerts...');
    const { data: alerts, error: alertsError } = await supabase
      .from('protection_alerts')
      .insert(sampleAlerts);

    if (alertsError) {
      console.error('Error inserting protection alerts:', alertsError);
    } else {
      console.log(`✅ Inserted ${sampleAlerts.length} sample protection alerts`);
    }

    // Create sample user protection settings
    console.log('⚙️ Creating sample user protection settings...');
    const { data: users } = await supabase.auth.admin.listUsers();
    
    if (users && users.users.length > 0) {
      const sampleSettings = users.users.slice(0, 3).map(user => ({
        user_id: user.id,
        real_time_protection: true,
        email_alerts: true,
        browser_extension_enabled: false,
        auto_cancel_detection: true,
        report_automatically: false
      }));

      const { error: settingsError } = await supabase
        .from('user_protection_settings')
        .upsert(sampleSettings);

      if (settingsError) {
        console.error('Error creating user protection settings:', settingsError);
      } else {
        console.log(`✅ Created protection settings for ${sampleSettings.length} users`);
      }
    }

    console.log('🎉 User protection setup completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- ${cancellationGuides.length} cancellation guides created`);
    console.log(`- ${sampleAlerts.length} sample protection alerts created`);
    console.log('- User protection settings configured');
    console.log('\n🔗 Next steps:');
    console.log('1. Test the protection dashboard at /protection');
    console.log('2. Try the cancellation assistant at /cancellation-assistant');
    console.log('3. Install the browser extension for real-time protection');

  } catch (error) {
    console.error('❌ Error setting up user protection:', error);
    process.exit(1);
  }
}

// Run the setup
setupUserProtection();
