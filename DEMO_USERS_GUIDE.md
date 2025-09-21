# Demo Users Guide - Ethical Subscription Pillar

This guide explains how to create demo users for the Ethical Subscription Pillar platform. The demo users represent different segments of Indian users who are affected by dark UX patterns in digital subscriptions.

## Overview

The demo users are designed to showcase the platform's purpose of fighting dark UX patterns in India's digital economy. They represent various user personas including:

- **Young Urban Professionals** - Tech-savvy but busy users
- **Rural Users** - First-time internet adopters
- **Elderly Users** - Limited digital literacy
- **Students** - Price-sensitive, frequent users
- **Small Business Owners** - Time-pressed users
- **Consumer Rights Activists** - Expert users
- **Fintech Users** - Security-conscious users
- **Regional Language Users** - Prefer Hindi/regional interfaces
- **Parents** - Concerned about family subscriptions
- **Senior Citizens** - Limited tech knowledge
- **Administrators** - Platform management

## Demo User Personas

### 1. Priya Sharma - Young Urban Professional
- **Email**: priya.sharma@demo.com
- **Password**: DemoUser123!
- **Role**: User
- **Profile**: Software engineer from Mumbai, passionate about user rights
- **Pain Points**: Often falls victim to subscription traps due to busy schedule

### 2. Ramesh Kumar - Rural User
- **Email**: ramesh.kumar@demo.com
- **Password**: DemoUser123!
- **Role**: User
- **Profile**: Farmer from rural Uttar Pradesh, new to digital payments
- **Pain Points**: Confused by complex subscription interfaces

### 3. Sushila Devi - Elderly User
- **Email**: sushila.devi@demo.com
- **Password**: DemoUser123!
- **Role**: User
- **Profile**: Retired teacher from Delhi, limited digital literacy
- **Pain Points**: Often accidentally subscribes to services

### 4. Arjun Patel - Student
- **Email**: arjun.patel@demo.com
- **Password**: DemoUser123!
- **Role**: User
- **Profile**: Engineering student from Bangalore, price-sensitive
- **Pain Points**: Frustrated by hidden costs in streaming/edtech platforms

### 5. Meera Singh - Small Business Owner
- **Email**: meera.singh@demo.com
- **Password**: DemoUser123!
- **Role**: User
- **Profile**: Small business owner from Pune, uses multiple SaaS tools
- **Pain Points**: Frustrated by auto-renewals and difficult cancellation

### 6. Vijay Reddy - Consumer Rights Activist
- **Email**: vijay.reddy@demo.com
- **Password**: DemoUser123!
- **Role**: Moderator
- **Profile**: Consumer rights activist from Hyderabad, expert in dark patterns
- **Pain Points**: Documents and fights against dark patterns

### 7. Kavitha Nair - Fintech User
- **Email**: kavitha.nair@demo.com
- **Password**: DemoUser123!
- **Role**: User
- **Profile**: Banking professional from Chennai, concerned about financial security
- **Pain Points**: Documents fintech dark patterns

### 8. Rajesh Yadav - Regional Language User
- **Email**: rajesh.yadav@demo.com
- **Password**: DemoUser123!
- **Role**: User
- **Profile**: Government employee from Bihar, prefers Hindi interfaces
- **Pain Points**: Encounters English-only subscription flows

### 9. Anita Gupta - Parent
- **Email**: anita.gupta@demo.com
- **Password**: DemoUser123!
- **Role**: User
- **Profile**: Mother of two from Jaipur, manages family subscriptions
- **Pain Points**: Children accidentally subscribing through games/apps

### 10. Bhaskar Iyer - Senior Citizen
- **Email**: bhaskar.iyer@demo.com
- **Password**: DemoUser123!
- **Role**: User
- **Profile**: Retired government officer from Kerala, limited tech knowledge
- **Pain Points**: Struggles with subscription management

### 11. Platform Admin - Administrator
- **Email**: admin@ethicalpatterns.in
- **Password**: AdminDemo123!
- **Role**: Admin
- **Profile**: Platform administrator for Ethical Patterns
- **Pain Points**: Manages platform and user submissions

## Methods to Create Demo Users

### Method 1: Using the React Component (Recommended)

1. **Access the Admin Panel**:
   - Sign in as an admin user
   - Go to Dashboard
   - Click on the "Admin Tools" tab

2. **Create Demo Users**:
   - Click "Create Demo Users & Sample Data" button
   - Wait for the process to complete
   - Review the created users and patterns

**Advantages**:
- User-friendly interface
- Real-time progress tracking
- Automatic error handling
- Creates complete demo data (users, patterns, comments, votes)

### Method 2: Using Node.js Script

1. **Prerequisites**:
   ```bash
   # Set your Supabase service key
   export SUPABASE_SERVICE_KEY="your-service-key-here"
   
   # Install dependencies
   npm install @supabase/supabase-js
   ```

2. **Run the Script**:
   ```bash
   # From project root
   npm run create-demo-users
   
   # Or directly
   node scripts/create-demo-users.js
   ```

**Advantages**:
- Automated process
- Creates comprehensive demo data
- Can be run in CI/CD pipelines

### Method 3: Using SQL Script

1. **Access Supabase SQL Editor**:
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Create a new query

2. **Run the SQL Script**:
   - Copy the contents of `scripts/create-demo-users.sql`
   - Paste into the SQL editor
   - Execute the script

**Note**: This method only creates patterns, comments, and votes. Users must be created first using Method 1 or 2.

### Method 4: Manual Creation

1. **Create Users Manually**:
   - Use the signup form at `/auth`
   - Create each user with the provided credentials
   - Update profiles with additional information

2. **Create Sample Data**:
   - Use the submit form to create patterns
   - Add comments and votes manually

## Sample Data Created

### Patterns
The demo data includes 5 sample patterns:

1. **Hidden Auto-Renewal in OTT Streaming** (Dark Pattern)
   - Company: StreamFlix India
   - Category: Streaming
   - Impact Score: 4

2. **Confusing Pricing Tiers in EdTech** (Dark Pattern)
   - Company: EduLearn Pro
   - Category: Education
   - Impact Score: 5

3. **Pre-checked Add-ons in E-commerce** (Dark Pattern)
   - Company: ShopMax India
   - Category: Other
   - Impact Score: 3

4. **Transparent Subscription Dashboard** (Ethical Alternative)
   - Company: PayClear
   - Category: SaaS
   - Impact Score: 5

5. **Upfront Pricing in Fitness Apps** (Ethical Alternative)
   - Company: FitRight
   - Category: Fitness
   - Impact Score: 4

### Comments and Votes
- Realistic comments from users discussing their experiences
- Upvotes and downvotes to simulate community engagement
- Comments reflect real user concerns about dark patterns

## Testing the Demo Data

### 1. User Authentication
- Test login with each demo user
- Verify profile information is correct
- Check user roles and permissions

### 2. Pattern Submission
- Login as different users
- Submit new patterns
- Verify pattern approval workflow

### 3. Community Features
- Test voting on patterns
- Add comments to existing patterns
- Verify moderation features

### 4. Admin Functions
- Login as admin user
- Test user management features
- Verify pattern approval/rejection

## Cleanup

To remove demo data:

### Option 1: Delete Users
- Use Supabase dashboard to delete users
- This will cascade delete related data

### Option 2: Reset Database
- If in development, reset your Supabase database
- Re-run migrations to restore clean state

### Option 3: Manual Cleanup
- Delete patterns, comments, and votes
- Keep users for continued testing

## Best Practices

1. **Use Demo Data Responsibly**:
   - Only use in development/staging environments
   - Don't use real user data in demo accounts
   - Clear demo data before production deployment

2. **Regular Updates**:
   - Update demo patterns to reflect current dark patterns
   - Add new user personas as needed
   - Keep comments and interactions realistic

3. **Documentation**:
   - Keep this guide updated
   - Document any customizations made
   - Share with team members

## Troubleshooting

### Common Issues

1. **Users Not Created**:
   - Check Supabase service key permissions
   - Verify email confirmation settings
   - Check for duplicate email addresses

2. **Patterns Not Appearing**:
   - Verify user IDs are correct
   - Check pattern status (should be 'approved')
   - Ensure RLS policies allow viewing

3. **Comments/Votes Not Working**:
   - Check foreign key relationships
   - Verify user permissions
   - Ensure proper data types

### Getting Help

- Check Supabase logs for detailed error messages
- Verify database schema matches expected structure
- Test with a single user first before creating all demo data

## Conclusion

The demo users provide a realistic representation of Indian users affected by dark UX patterns. They help demonstrate the platform's purpose and showcase various user personas and their specific challenges with digital subscriptions.

Use these demo users to:
- Test platform functionality
- Demonstrate the platform to stakeholders
- Train moderators and administrators
- Develop new features with realistic data

Remember to keep the demo data updated and relevant to current dark pattern trends in India's digital economy.
