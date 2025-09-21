/**
 * Simple Demo User Creation Script
 * 
 * This is a simplified version that can be run directly in the browser console
 * or as a Node.js script without requiring environment variables.
 * 
 * Note: This version uses the public Supabase client, so it will only work
 * if you have admin access or if you modify the RLS policies temporarily.
 */

// Demo users data - you can copy this and run in browser console
const demoUsersData = {
  users: [
    {
      email: 'priya.sharma@demo.com',
      password: 'DemoUser123!',
      username: 'priya_sharma',
      display_name: 'Priya Sharma',
      bio: 'Software engineer from Mumbai. Passionate about user rights and ethical design.',
      role: 'user'
    },
    {
      email: 'ramesh.kumar@demo.com',
      password: 'DemoUser123!',
      username: 'ramesh_kumar',
      display_name: 'Ramesh Kumar',
      bio: 'Farmer from rural Uttar Pradesh. New to digital payments and online services.',
      role: 'user'
    },
    {
      email: 'sushila.devi@demo.com',
      password: 'DemoUser123!',
      username: 'sushila_devi',
      display_name: 'Sushila Devi',
      bio: 'Retired teacher from Delhi. Uses smartphone for basic needs but struggles with complex digital interfaces.',
      role: 'user'
    },
    {
      email: 'arjun.patel@demo.com',
      password: 'DemoUser123!',
      username: 'arjun_patel',
      display_name: 'Arjun Patel',
      bio: 'Engineering student from Bangalore. Heavy user of streaming and edtech platforms.',
      role: 'user'
    },
    {
      email: 'meera.singh@demo.com',
      password: 'DemoUser123!',
      username: 'meera_singh',
      display_name: 'Meera Singh',
      bio: 'Small business owner from Pune. Uses multiple SaaS tools for business.',
      role: 'user'
    },
    {
      email: 'vijay.reddy@demo.com',
      password: 'DemoUser123!',
      username: 'vijay_reddy',
      display_name: 'Vijay Reddy',
      bio: 'Consumer rights activist from Hyderabad. Expert in identifying and documenting dark patterns.',
      role: 'moderator'
    },
    {
      email: 'kavitha.nair@demo.com',
      password: 'DemoUser123!',
      username: 'kavitha_nair',
      display_name: 'Kavitha Nair',
      bio: 'Banking professional from Chennai. Very concerned about financial security and transparency.',
      role: 'user'
    },
    {
      email: 'rajesh.yadav@demo.com',
      password: 'DemoUser123!',
      username: 'rajesh_yadav',
      display_name: 'Rajesh Yadav',
      bio: 'Government employee from Bihar. Prefers Hindi interfaces but often encounters English-only subscription flows.',
      role: 'user'
    },
    {
      email: 'anita.gupta@demo.com',
      password: 'DemoUser123!',
      username: 'anita_gupta',
      display_name: 'Anita Gupta',
      bio: 'Mother of two from Jaipur. Manages family subscriptions and is frustrated by children accidentally subscribing to services.',
      role: 'user'
    },
    {
      email: 'bhaskar.iyer@demo.com',
      password: 'DemoUser123!',
      username: 'bhaskar_iyer',
      display_name: 'Bhaskar Iyer',
      bio: 'Retired government officer from Kerala. Uses basic smartphone features but struggles with subscription management.',
      role: 'user'
    },
    {
      email: 'admin@ethicalpatterns.in',
      password: 'AdminDemo123!',
      username: 'admin',
      display_name: 'Platform Admin',
      bio: 'Platform administrator for Ethical Patterns. Manages user submissions and moderates content.',
      role: 'admin'
    }
  ],
  
  patterns: [
    {
      title: "Hidden Auto-Renewal in OTT Streaming",
      description: "Popular streaming platform automatically renews subscription without clear notification. Users only discover charges on their bank statement. No easy way to cancel - requires calling customer service during business hours.",
      company_name: "StreamFlix India",
      website_url: "https://streamflix.in",
      pattern_type: "dark_pattern",
      category: "streaming",
      impact_score: 4
    },
    {
      title: "Confusing Pricing Tiers in EdTech",
      description: "Educational platform shows 'Free Trial' prominently but hides that it's actually a paid subscription. Trial converts automatically after 7 days with no clear reminder. Cancellation requires multiple steps and confirmation screens.",
      company_name: "EduLearn Pro",
      website_url: "https://edulearnpro.com",
      pattern_type: "dark_pattern",
      category: "education",
      impact_score: 5
    },
    {
      title: "Pre-checked Add-ons in E-commerce",
      description: "Online shopping platform pre-selects expensive add-ons like insurance and extended warranty. Users must manually uncheck these options, and the interface makes it easy to miss them during checkout.",
      company_name: "ShopMax India",
      website_url: "https://shopmax.in",
      pattern_type: "dark_pattern",
      category: "other",
      impact_score: 3
    },
    {
      title: "Transparent Subscription Dashboard",
      description: "This fintech app provides a clear, easy-to-find subscription management section. Users can see all active subscriptions, upcoming charges, and cancel with one click. No hidden fees or confusing language.",
      company_name: "PayClear",
      website_url: "https://payclear.in",
      pattern_type: "ethical_alternative",
      category: "saas",
      impact_score: 5
    },
    {
      title: "Upfront Pricing in Fitness Apps",
      description: "Fitness app clearly displays all pricing options upfront. No hidden costs, no auto-renewal without explicit consent. Users receive clear reminders before charges and can cancel anytime through the app.",
      company_name: "FitRight",
      website_url: "https://fitright.app",
      pattern_type: "ethical_alternative",
      category: "fitness",
      impact_score: 4
    }
  ],
  
  comments: [
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
  ]
};

// Function to create users (for browser console use)
async function createDemoUsersInBrowser() {
  console.log('🚀 Creating demo users...');
  
  // You would need to import supabase client here
  // import { supabase } from '@/integrations/supabase/client';
  
  for (const user of demoUsersData.users) {
    try {
      console.log(`Creating user: ${user.display_name}`);
      
      // This would be the actual signup call
      // const { data, error } = await supabase.auth.signUp({
      //   email: user.email,
      //   password: user.password,
      //   options: {
      //     data: {
      //       username: user.username,
      //       display_name: user.display_name
      //     }
      //   }
      // });
      
      console.log(`✅ Would create user: ${user.display_name}`);
      
    } catch (error) {
      console.error(`Error creating user ${user.email}:`, error);
    }
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = demoUsersData;
}

// For browser console use
if (typeof window !== 'undefined') {
  window.demoUsersData = demoUsersData;
  window.createDemoUsersInBrowser = createDemoUsersInBrowser;
}
