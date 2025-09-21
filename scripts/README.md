# Demo User Creation Script

This script creates realistic demo users for the Ethical Subscription Pillar platform, representing different segments of Indian users who are affected by dark UX patterns in digital subscriptions.

## Demo User Personas

The script creates 11 demo users representing various Indian user segments:

### 1. **Priya Sharma** - Young Urban Professional
- **Email**: priya.sharma@demo.com
- **Profile**: Software engineer from Mumbai, tech-savvy but busy
- **Pain Points**: Often falls victim to subscription traps due to busy schedule

### 2. **Ramesh Kumar** - Rural User
- **Email**: ramesh.kumar@demo.com  
- **Profile**: Farmer from rural Uttar Pradesh, new to digital payments
- **Pain Points**: Confused by complex subscription interfaces

### 3. **Sushila Devi** - Elderly User
- **Email**: sushila.devi@demo.com
- **Profile**: Retired teacher from Delhi, limited digital literacy
- **Pain Points**: Often accidentally subscribes to services

### 4. **Arjun Patel** - Student
- **Email**: arjun.patel@demo.com
- **Profile**: Engineering student from Bangalore, price-sensitive
- **Pain Points**: Frustrated by hidden costs in streaming/edtech platforms

### 5. **Meera Singh** - Small Business Owner
- **Email**: meera.singh@demo.com
- **Profile**: Small business owner from Pune, uses multiple SaaS tools
- **Pain Points**: Frustrated by auto-renewals and difficult cancellation

### 6. **Vijay Reddy** - Consumer Rights Activist
- **Email**: vijay.reddy@demo.com
- **Profile**: Consumer rights activist from Hyderabad, expert in dark patterns
- **Role**: Moderator

### 7. **Kavitha Nair** - Fintech User
- **Email**: kavitha.nair@demo.com
- **Profile**: Banking professional from Chennai, concerned about financial security
- **Pain Points**: Documents fintech dark patterns

### 8. **Rajesh Yadav** - Regional Language User
- **Email**: rajesh.yadav@demo.com
- **Profile**: Government employee from Bihar, prefers Hindi interfaces
- **Pain Points**: Encounters English-only subscription flows

### 9. **Anita Gupta** - Parent
- **Email**: anita.gupta@demo.com
- **Profile**: Mother of two from Jaipur, manages family subscriptions
- **Pain Points**: Children accidentally subscribing through games/apps

### 10. **Bhaskar Iyer** - Senior Citizen
- **Email**: bhaskar.iyer@demo.com
- **Profile**: Retired government officer from Kerala, limited tech knowledge
- **Pain Points**: Struggles with subscription management

### 11. **Platform Admin** - Administrator
- **Email**: admin@ethicalpatterns.in
- **Profile**: Platform administrator
- **Role**: Admin

## Sample Data Created

The script also creates:

- **5 Sample Patterns**: Mix of dark patterns and ethical alternatives across different categories (streaming, edtech, e-commerce, fintech, fitness)
- **Comments**: Realistic comments from users discussing their experiences
- **Votes**: Upvotes and downvotes on patterns to simulate community engagement

## Usage

### Prerequisites

1. Set up your Supabase service key as an environment variable:
   ```bash
   export SUPABASE_SERVICE_KEY="your-service-key-here"
   ```

2. Install dependencies:
   ```bash
   npm install @supabase/supabase-js
   ```

### Running the Script

```bash
# From the project root
node scripts/create-demo-users.js
```

Or using npm script:
```bash
npm run create-demo-users
```

## Demo User Credentials

All demo users have the password: `DemoUser123!`

Admin user has the password: `AdminDemo123!`

## Sample Patterns Created

1. **Hidden Auto-Renewal in OTT Streaming** (Dark Pattern)
2. **Confusing Pricing Tiers in EdTech** (Dark Pattern)  
3. **Pre-checked Add-ons in E-commerce** (Dark Pattern)
4. **Transparent Subscription Dashboard** (Ethical Alternative)
5. **Upfront Pricing in Fitness Apps** (Ethical Alternative)

## Notes

- The script uses Supabase Admin API to create users without email verification
- All users are created with realistic Indian names and backgrounds
- Patterns represent common issues faced by Indian users in the digital economy
- Comments reflect real user experiences and concerns
- The data is designed to showcase the platform's purpose of fighting dark UX patterns

## Cleanup

To remove demo data, you can either:
1. Delete users through the Supabase dashboard
2. Create a cleanup script (not included)
3. Reset your Supabase database if this is a development environment
