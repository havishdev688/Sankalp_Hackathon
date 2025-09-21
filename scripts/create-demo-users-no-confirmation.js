/**
 * Demo User Creation Script - No Email Confirmation Required
 * 
 * This script creates demo users using the Supabase Admin API,
 * which bypasses email confirmation requirements.
 * 
 * Prerequisites:
 * 1. Set SUPABASE_SERVICE_KEY environment variable
 * 2. Make sure you have admin access to your Supabase project
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const SUPABASE_URL = "https://uzgwkfkeoeyeusscaajk.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ Please set SUPABASE_SERVICE_KEY environment variable');
  console.log('You can find your service key in:');
  console.log('Supabase Dashboard → Settings → API → service_role key');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Demo users data
const demoUsers = [
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
    email: 'admin@ethicalpatterns.in',
    password: 'AdminDemo123!',
    username: 'admin',
    display_name: 'Platform Admin',
    bio: 'Platform administrator for Ethical Patterns.',
    role: 'admin'
  }
];

async function createDemoUsers() {
  console.log('🚀 Creating demo users (no email confirmation required)...\n');
  
  const createdUsers = [];
  
  for (const userData of demoUsers) {
    try {
      console.log(`Creating user: ${userData.display_name} (${userData.email})`);
      
      // Use admin API to create user without email confirmation
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true, // This skips email confirmation
        user_metadata: {
          username: userData.username,
          display_name: userData.display_name
        }
      });
      
      if (authError) {
        console.error(`❌ Error creating user ${userData.email}:`, authError.message);
        continue;
      }
      
      if (authData.user) {
        const userId = authData.user.id;
        createdUsers.push({ ...userData, id: userId });
        
        // Update profile with additional data
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            bio: userData.bio,
            is_verified: userData.role === 'admin'
          })
          .eq('user_id', userId);
        
        if (profileError) {
          console.error(`⚠️  Profile update error for ${userData.email}:`, profileError.message);
        }
        
        // Update user role if not default 'user'
        if (userData.role !== 'user') {
          const { error: roleError } = await supabase
            .from('user_roles')
            .update({ role: userData.role })
            .eq('user_id', userId);
          
          if (roleError) {
            console.error(`⚠️  Role update error for ${userData.email}:`, roleError.message);
          }
        }
        
        console.log(`✅ Created user: ${userData.display_name}`);
      }
      
    } catch (error) {
      console.error(`❌ Error creating user ${userData.email}:`, error.message);
    }
  }
  
  console.log(`\n🎉 Demo user creation completed!`);
  console.log(`📊 Created ${createdUsers.length} users out of ${demoUsers.length} total`);
  
  if (createdUsers.length > 0) {
    console.log('\n🔑 Demo User Credentials:');
    console.log('All demo users have password: DemoUser123!');
    console.log('Admin user has password: AdminDemo123!');
    console.log('\n📧 Created Users:');
    createdUsers.forEach(user => {
      console.log(`- ${user.display_name}: ${user.email}`);
    });
  }
  
  return createdUsers;
}

// Run the script
if (require.main === module) {
  createDemoUsers().catch(console.error);
}

module.exports = { createDemoUsers, demoUsers };
