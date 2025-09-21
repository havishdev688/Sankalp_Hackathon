/**
 * Demo User Creation Script for Ethical Subscription Pillar
 * 
 * This script creates realistic demo users representing different segments
 * of Indian users who are affected by dark UX patterns in digital subscriptions.
 * 
 * Based on the context provided about India's digital economy and the challenges
 * faced by first-time internet adopters, rural consumers, and elderly citizens.
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const SUPABASE_URL = "https://uzgwkfkeoeyeusscaajk.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // You'll need to set this

if (!SUPABASE_SERVICE_KEY) {
  console.error('Please set SUPABASE_SERVICE_KEY environment variable');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Demo users representing different Indian user personas
const demoUsers = [
  {
    // Young urban professional - tech-savvy but busy
    email: 'priya.sharma@demo.com',
    password: 'DemoUser123!',
    userData: {
      username: 'priya_sharma',
      display_name: 'Priya Sharma'
    },
    profile: {
      bio: 'Software engineer from Mumbai. Passionate about user rights and ethical design. Often falls victim to subscription traps due to busy schedule.',
      website_url: 'https://github.com/priya-sharma',
      is_verified: true
    },
    role: 'user'
  },
  {
    // Rural user - first-time internet adopter
    email: 'ramesh.kumar@demo.com',
    password: 'DemoUser123!',
    userData: {
      username: 'ramesh_kumar',
      display_name: 'Ramesh Kumar'
    },
    profile: {
      bio: 'Farmer from rural Uttar Pradesh. New to digital payments and online services. Often confused by complex subscription interfaces.',
      website_url: null,
      is_verified: false
    },
    role: 'user'
  },
  {
    // Elderly user - limited digital literacy
    email: 'sushila.devi@demo.com',
    password: 'DemoUser123!',
    userData: {
      username: 'sushila_devi',
      display_name: 'Sushila Devi'
    },
    profile: {
      bio: 'Retired teacher from Delhi. Uses smartphone for basic needs but struggles with complex digital interfaces. Often accidentally subscribes to services.',
      website_url: null,
      is_verified: false
    },
    role: 'user'
  },
  {
    // Student - price-sensitive, frequent user
    email: 'arjun.patel@demo.com',
    password: 'DemoUser123!',
    userData: {
      username: 'arjun_patel',
      display_name: 'Arjun Patel'
    },
    profile: {
      bio: 'Engineering student from Bangalore. Heavy user of streaming and edtech platforms. Very price-conscious and frustrated by hidden costs.',
      website_url: 'https://linkedin.com/in/arjun-patel',
      is_verified: true
    },
    role: 'user'
  },
  {
    // Small business owner - time-pressed
    email: 'meera.singh@demo.com',
    password: 'DemoUser123!',
    userData: {
      username: 'meera_singh',
      display_name: 'Meera Singh'
    },
    profile: {
      bio: 'Small business owner from Pune. Uses multiple SaaS tools for business. Frustrated by auto-renewals and difficult cancellation processes.',
      website_url: 'https://meerasingh.com',
      is_verified: true
    },
    role: 'user'
  },
  {
    // Consumer rights activist - expert user
    email: 'vijay.reddy@demo.com',
    password: 'DemoUser123!',
    userData: {
      username: 'vijay_reddy',
      display_name: 'Vijay Reddy'
    },
    profile: {
      bio: 'Consumer rights activist from Hyderabad. Works with Consumer Protection Act cases. Expert in identifying and documenting dark patterns.',
      website_url: 'https://consumerrightsindia.org',
      is_verified: true
    },
    role: 'moderator'
  },
  {
    // Fintech user - concerned about financial security
    email: 'kavitha.nair@demo.com',
    password: 'DemoUser123!',
    userData: {
      username: 'kavitha_nair',
      display_name: 'Kavitha Nair'
    },
    profile: {
      bio: 'Banking professional from Chennai. Very concerned about financial security and transparency. Documents fintech dark patterns.',
      website_url: null,
      is_verified: true
    },
    role: 'user'
  },
  {
    // Regional language user - prefers Hindi/regional interfaces
    email: 'rajesh.yadav@demo.com',
    password: 'DemoUser123!',
    userData: {
      username: 'rajesh_yadav',
      display_name: 'Rajesh Yadav'
    },
    profile: {
      bio: 'Government employee from Bihar. Prefers Hindi interfaces but often encounters English-only subscription flows. Advocates for regional language support.',
      website_url: null,
      is_verified: false
    },
    role: 'user'
  },
  {
    // Parent - concerned about family subscriptions
    email: 'anita.gupta@demo.com',
    password: 'DemoUser123!',
    userData: {
      username: 'anita_gupta',
      display_name: 'Anita Gupta'
    },
    profile: {
      bio: 'Mother of two from Jaipur. Manages family subscriptions and is frustrated by children accidentally subscribing to services through games and apps.',
      website_url: null,
      is_verified: false
    },
    role: 'user'
  },
  {
    // Senior citizen - limited tech knowledge
    email: 'bhaskar.iyer@demo.com',
    password: 'DemoUser123!',
    userData: {
      username: 'bhaskar_iyer',
      display_name: 'Bhaskar Iyer'
    },
    profile: {
      bio: 'Retired government officer from Kerala. Uses basic smartphone features but struggles with subscription management. Often needs family help.',
      website_url: null,
      is_verified: false
    },
    role: 'user'
  },
  {
    // Admin user for platform management
    email: 'admin@ethicalpatterns.in',
    password: 'AdminDemo123!',
    userData: {
      username: 'admin',
      display_name: 'Platform Admin'
    },
    profile: {
      bio: 'Platform administrator for Ethical Patterns. Manages user submissions, moderates content, and ensures platform integrity.',
      website_url: 'https://ethicalpatterns.in',
      is_verified: true
    },
    role: 'admin'
  }
];

// Sample patterns that these users might submit
const samplePatterns = [
  {
    title: "Hidden Auto-Renewal in OTT Streaming",
    description: "Popular streaming platform automatically renews subscription without clear notification. Users only discover charges on their bank statement. No easy way to cancel - requires calling customer service during business hours.",
    company_name: "StreamFlix India",
    website_url: "https://streamflix.in",
    pattern_type: "dark_pattern",
    category: "streaming",
    impact_score: 4,
    status: "approved",
    upvotes: 15,
    downvotes: 2
  },
  {
    title: "Confusing Pricing Tiers in EdTech",
    description: "Educational platform shows 'Free Trial' prominently but hides that it's actually a paid subscription. Trial converts automatically after 7 days with no clear reminder. Cancellation requires multiple steps and confirmation screens.",
    company_name: "EduLearn Pro",
    website_url: "https://edulearnpro.com",
    pattern_type: "dark_pattern",
    category: "education",
    impact_score: 5,
    status: "approved",
    upvotes: 23,
    downvotes: 1
  },
  {
    title: "Pre-checked Add-ons in E-commerce",
    description: "Online shopping platform pre-selects expensive add-ons like insurance and extended warranty. Users must manually uncheck these options, and the interface makes it easy to miss them during checkout.",
    company_name: "ShopMax India",
    website_url: "https://shopmax.in",
    pattern_type: "dark_pattern",
    category: "other",
    impact_score: 3,
    status: "approved",
    upvotes: 12,
    downvotes: 0
  },
  {
    title: "Transparent Subscription Dashboard",
    description: "This fintech app provides a clear, easy-to-find subscription management section. Users can see all active subscriptions, upcoming charges, and cancel with one click. No hidden fees or confusing language.",
    company_name: "PayClear",
    website_url: "https://payclear.in",
    pattern_type: "ethical_alternative",
    category: "saas",
    impact_score: 5,
    status: "approved",
    upvotes: 18,
    downvotes: 0
  },
  {
    title: "Upfront Pricing in Fitness Apps",
    description: "Fitness app clearly displays all pricing options upfront. No hidden costs, no auto-renewal without explicit consent. Users receive clear reminders before charges and can cancel anytime through the app.",
    company_name: "FitRight",
    website_url: "https://fitright.app",
    pattern_type: "ethical_alternative",
    category: "fitness",
    impact_score: 4,
    status: "approved",
    upvotes: 14,
    downvotes: 0
  }
];

// Sample comments for patterns
const sampleComments = [
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
];

async function createDemoUsers() {
  console.log('🚀 Starting demo user creation...');
  
  const createdUsers = [];
  
  for (const userData of demoUsers) {
    try {
      console.log(`Creating user: ${userData.userData.display_name}`);
      
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true, // Skip email confirmation for demo users
        user_metadata: userData.userData
      });
      
      if (authError) {
        console.error(`Error creating auth user ${userData.email}:`, authError);
        continue;
      }
      
      const userId = authData.user.id;
      createdUsers.push({ ...userData, id: userId });
      
      // Update profile with additional data
      const { error: profileError } = await supabase
        .from('profiles')
        .update(userData.profile)
        .eq('user_id', userId);
      
      if (profileError) {
        console.error(`Error updating profile for ${userData.email}:`, profileError);
      }
      
      // Update user role if not default 'user'
      if (userData.role !== 'user') {
        const { error: roleError } = await supabase
          .from('user_roles')
          .update({ role: userData.role })
          .eq('user_id', userId);
        
        if (roleError) {
          console.error(`Error updating role for ${userData.email}:`, roleError);
        }
      }
      
      console.log(`✅ Created user: ${userData.userData.display_name}`);
      
    } catch (error) {
      console.error(`Error creating user ${userData.email}:`, error);
    }
  }
  
  return createdUsers;
}

async function createSamplePatterns(users) {
  console.log('📝 Creating sample patterns...');
  
  const createdPatterns = [];
  
  for (const patternData of samplePatterns) {
    try {
      // Assign pattern to a random user
      const randomUser = users[Math.floor(Math.random() * users.length)];
      
      const { data, error } = await supabase
        .from('patterns')
        .insert({
          ...patternData,
          user_id: randomUser.id
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating pattern:', error);
        continue;
      }
      
      createdPatterns.push(data);
      console.log(`✅ Created pattern: ${patternData.title}`);
      
    } catch (error) {
      console.error('Error creating pattern:', error);
    }
  }
  
  return createdPatterns;
}

async function createSampleComments(patterns, users) {
  console.log('💬 Creating sample comments...');
  
  for (const pattern of patterns) {
    // Create 2-4 random comments per pattern
    const numComments = Math.floor(Math.random() * 3) + 2;
    
    for (let i = 0; i < numComments; i++) {
      try {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomComment = sampleComments[Math.floor(Math.random() * sampleComments.length)];
        
        const { error } = await supabase
          .from('pattern_comments')
          .insert({
            pattern_id: pattern.id,
            user_id: randomUser.id,
            content: randomComment
          });
        
        if (error) {
          console.error('Error creating comment:', error);
        }
        
      } catch (error) {
        console.error('Error creating comment:', error);
      }
    }
  }
  
  console.log('✅ Created sample comments');
}

async function createSampleVotes(patterns, users) {
  console.log('👍 Creating sample votes...');
  
  for (const pattern of patterns) {
    // Create random votes for each pattern
    const numVotes = Math.floor(Math.random() * 8) + 5; // 5-12 votes per pattern
    const votedUsers = new Set();
    
    for (let i = 0; i < numVotes; i++) {
      try {
        let randomUser;
        do {
          randomUser = users[Math.floor(Math.random() * users.length)];
        } while (votedUsers.has(randomUser.id));
        
        votedUsers.add(randomUser.id);
        
        const voteType = Math.random() > 0.1 ? 'upvote' : 'downvote'; // 90% upvotes
        
        const { error } = await supabase
          .from('pattern_votes')
          .insert({
            pattern_id: pattern.id,
            user_id: randomUser.id,
            vote_type: voteType
          });
        
        if (error) {
          console.error('Error creating vote:', error);
        }
        
      } catch (error) {
        console.error('Error creating vote:', error);
      }
    }
  }
  
  console.log('✅ Created sample votes');
}

async function main() {
  try {
    console.log('🎯 Creating demo data for Ethical Subscription Pillar...\n');
    
    // Create demo users
    const users = await createDemoUsers();
    console.log(`\n📊 Created ${users.length} demo users\n`);
    
    // Create sample patterns
    const patterns = await createSamplePatterns(users);
    console.log(`\n📊 Created ${patterns.length} sample patterns\n`);
    
    // Create sample comments
    await createSampleComments(patterns, users);
    
    // Create sample votes
    await createSampleVotes(patterns, users);
    
    console.log('\n🎉 Demo data creation completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`- ${users.length} demo users created`);
    console.log(`- ${patterns.length} sample patterns created`);
    console.log('- Sample comments and votes added');
    console.log('\n🔑 Demo user credentials:');
    console.log('All demo users have password: DemoUser123!');
    console.log('Admin user: admin@ethicalpatterns.in / AdminDemo123!');
    
  } catch (error) {
    console.error('❌ Error creating demo data:', error);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  createDemoUsers,
  createSamplePatterns,
  createSampleComments,
  createSampleVotes,
  demoUsers,
  samplePatterns
};
