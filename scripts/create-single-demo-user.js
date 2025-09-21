/**
 * Quick Demo User Creation Script
 * 
 * This script creates a single demo user for testing purposes.
 * Run this in your browser console or as a Node.js script.
 */

// Import supabase client (adjust path as needed)
// For browser console, you'll need to import it first

const createSingleDemoUser = async () => {
  try {
    console.log('🚀 Creating demo user...');
    
    // Create Priya Sharma as a test user
    const { data, error } = await supabase.auth.signUp({
      email: 'priya.sharma@demo.com',
      password: 'DemoUser123!',
      options: {
        data: {
          username: 'priya_sharma',
          display_name: 'Priya Sharma'
        }
      }
    });

    if (error) {
      console.error('Error creating user:', error);
      return;
    }

    if (data.user) {
      console.log('✅ User created successfully!');
      console.log('Email: priya.sharma@demo.com');
      console.log('Password: DemoUser123!');
      
      // Update profile with additional info
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          bio: 'Software engineer from Mumbai. Passionate about user rights and ethical design.',
          is_verified: true
        })
        .eq('user_id', data.user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
      } else {
        console.log('✅ Profile updated successfully!');
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// For browser console use
if (typeof window !== 'undefined') {
  window.createSingleDemoUser = createSingleDemoUser;
  console.log('Demo user creation function loaded. Run createSingleDemoUser() to create a test user.');
}

// For Node.js use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createSingleDemoUser };
}
