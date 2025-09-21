-- Demo Users Creation Script for Ethical Subscription Pillar
-- 
-- This SQL script creates realistic demo users representing different segments
-- of Indian users who are affected by dark UX patterns in digital subscriptions.
--
-- Run this script in your Supabase SQL editor or database console.
-- Note: This script creates users in the auth.users table directly, which requires
-- admin privileges or service role access.

-- First, let's create the demo users in the auth.users table
-- Note: In production, you would typically use the Supabase Admin API
-- This is a simplified approach for demo purposes

-- Create demo users (this requires admin access to auth.users table)
-- For security reasons, we'll create a function that can be called with proper permissions

-- Function to create demo users
CREATE OR REPLACE FUNCTION create_demo_users()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_id UUID;
    result_text TEXT := '';
BEGIN
    -- Note: This function requires admin access to auth.users table
    -- In practice, you would use the Supabase Admin API or service role
    
    result_text := 'Demo users creation function created. ';
    result_text := result_text || 'To create users, use the Supabase Admin API or the React component.';
    
    RETURN result_text;
END;
$$;

-- Create demo patterns that can be inserted once users exist
-- These will be linked to existing users

-- Sample patterns data
INSERT INTO public.patterns (
    user_id,
    title,
    description,
    company_name,
    website_url,
    pattern_type,
    category,
    impact_score,
    status,
    upvotes,
    downvotes
) VALUES 
-- Dark Patterns
(
    (SELECT user_id FROM public.profiles WHERE username = 'priya_sharma' LIMIT 1),
    'Hidden Auto-Renewal in OTT Streaming',
    'Popular streaming platform automatically renews subscription without clear notification. Users only discover charges on their bank statement. No easy way to cancel - requires calling customer service during business hours.',
    'StreamFlix India',
    'https://streamflix.in',
    'dark_pattern',
    'streaming',
    4,
    'approved',
    15,
    2
),
(
    (SELECT user_id FROM public.profiles WHERE username = 'arjun_patel' LIMIT 1),
    'Confusing Pricing Tiers in EdTech',
    'Educational platform shows ''Free Trial'' prominently but hides that it''s actually a paid subscription. Trial converts automatically after 7 days with no clear reminder. Cancellation requires multiple steps and confirmation screens.',
    'EduLearn Pro',
    'https://edulearnpro.com',
    'dark_pattern',
    'education',
    5,
    'approved',
    23,
    1
),
(
    (SELECT user_id FROM public.profiles WHERE username = 'meera_singh' LIMIT 1),
    'Pre-checked Add-ons in E-commerce',
    'Online shopping platform pre-selects expensive add-ons like insurance and extended warranty. Users must manually uncheck these options, and the interface makes it easy to miss them during checkout.',
    'ShopMax India',
    'https://shopmax.in',
    'dark_pattern',
    'other',
    3,
    'approved',
    12,
    0
),
-- Ethical Alternatives
(
    (SELECT user_id FROM public.profiles WHERE username = 'vijay_reddy' LIMIT 1),
    'Transparent Subscription Dashboard',
    'This fintech app provides a clear, easy-to-find subscription management section. Users can see all active subscriptions, upcoming charges, and cancel with one click. No hidden fees or confusing language.',
    'PayClear',
    'https://payclear.in',
    'ethical_alternative',
    'saas',
    5,
    'approved',
    18,
    0
),
(
    (SELECT user_id FROM public.profiles WHERE username = 'kavitha_nair' LIMIT 1),
    'Upfront Pricing in Fitness Apps',
    'Fitness app clearly displays all pricing options upfront. No hidden costs, no auto-renewal without explicit consent. Users receive clear reminders before charges and can cancel anytime through the app.',
    'FitRight',
    'https://fitright.app',
    'ethical_alternative',
    'fitness',
    4,
    'approved',
    14,
    0
)
ON CONFLICT DO NOTHING;

-- Create sample comments for the patterns
INSERT INTO public.pattern_comments (
    pattern_id,
    user_id,
    content
) VALUES 
-- Comments for first pattern
(
    (SELECT id FROM public.patterns WHERE title = 'Hidden Auto-Renewal in OTT Streaming' LIMIT 1),
    (SELECT user_id FROM public.profiles WHERE username = 'ramesh_kumar' LIMIT 1),
    'This happened to me too! I was charged ₹299 for a subscription I didn''t even know I had.'
),
(
    (SELECT id FROM public.patterns WHERE title = 'Hidden Auto-Renewal in OTT Streaming' LIMIT 1),
    (SELECT user_id FROM public.profiles WHERE username = 'sushila_devi' LIMIT 1),
    'My elderly mother fell victim to this pattern. She doesn''t understand English well and got confused by the interface.'
),
-- Comments for second pattern
(
    (SELECT id FROM public.patterns WHERE title = 'Confusing Pricing Tiers in EdTech' LIMIT 1),
    (SELECT user_id FROM public.profiles WHERE username = 'anita_gupta' LIMIT 1),
    'As a parent, I''m concerned about my children accidentally subscribing to services through games.'
),
(
    (SELECT id FROM public.patterns WHERE title = 'Confusing Pricing Tiers in EdTech' LIMIT 1),
    (SELECT user_id FROM public.profiles WHERE username = 'rajesh_yadav' LIMIT 1),
    'This is a common problem in rural areas where people are new to digital payments.'
),
-- Comments for ethical alternatives
(
    (SELECT id FROM public.patterns WHERE title = 'Transparent Subscription Dashboard' LIMIT 1),
    (SELECT user_id FROM public.profiles WHERE username = 'priya_sharma' LIMIT 1),
    'Great example of ethical design. More companies should follow this approach.'
),
(
    (SELECT id FROM public.patterns WHERE title = 'Upfront Pricing in Fitness Apps' LIMIT 1),
    (SELECT user_id FROM public.profiles WHERE username = 'bhaskar_iyer' LIMIT 1),
    'I appreciate that this company is being transparent. Will definitely consider using their service.'
)
ON CONFLICT DO NOTHING;

-- Create sample votes for the patterns
INSERT INTO public.pattern_votes (
    pattern_id,
    user_id,
    vote_type
) VALUES 
-- Votes for first pattern
(
    (SELECT id FROM public.patterns WHERE title = 'Hidden Auto-Renewal in OTT Streaming' LIMIT 1),
    (SELECT user_id FROM public.profiles WHERE username = 'ramesh_kumar' LIMIT 1),
    'upvote'
),
(
    (SELECT id FROM public.patterns WHERE title = 'Hidden Auto-Renewal in OTT Streaming' LIMIT 1),
    (SELECT user_id FROM public.profiles WHERE username = 'sushila_devi' LIMIT 1),
    'upvote'
),
(
    (SELECT id FROM public.patterns WHERE title = 'Hidden Auto-Renewal in OTT Streaming' LIMIT 1),
    (SELECT user_id FROM public.profiles WHERE username = 'anita_gupta' LIMIT 1),
    'upvote'
),
-- Votes for second pattern
(
    (SELECT id FROM public.patterns WHERE title = 'Confusing Pricing Tiers in EdTech' LIMIT 1),
    (SELECT user_id FROM public.profiles WHERE username = 'arjun_patel' LIMIT 1),
    'upvote'
),
(
    (SELECT id FROM public.patterns WHERE title = 'Confusing Pricing Tiers in EdTech' LIMIT 1),
    (SELECT user_id FROM public.profiles WHERE username = 'meera_singh' LIMIT 1),
    'upvote'
),
-- Votes for ethical alternatives
(
    (SELECT id FROM public.patterns WHERE title = 'Transparent Subscription Dashboard' LIMIT 1),
    (SELECT user_id FROM public.profiles WHERE username = 'kavitha_nair' LIMIT 1),
    'upvote'
),
(
    (SELECT id FROM public.patterns WHERE title = 'Upfront Pricing in Fitness Apps' LIMIT 1),
    (SELECT user_id FROM public.profiles WHERE username = 'bhaskar_iyer' LIMIT 1),
    'upvote'
)
ON CONFLICT (user_id, pattern_id) DO NOTHING;

-- Update user roles for specific users
UPDATE public.user_roles 
SET role = 'moderator' 
WHERE user_id = (SELECT user_id FROM public.profiles WHERE username = 'vijay_reddy' LIMIT 1);

UPDATE public.user_roles 
SET role = 'admin' 
WHERE user_id = (SELECT user_id FROM public.profiles WHERE username = 'admin' LIMIT 1);

-- Update profiles with additional information
UPDATE public.profiles 
SET 
    bio = 'Software engineer from Mumbai. Passionate about user rights and ethical design. Often falls victim to subscription traps due to busy schedule.',
    is_verified = true
WHERE username = 'priya_sharma';

UPDATE public.profiles 
SET 
    bio = 'Farmer from rural Uttar Pradesh. New to digital payments and online services. Often confused by complex subscription interfaces.',
    is_verified = false
WHERE username = 'ramesh_kumar';

UPDATE public.profiles 
SET 
    bio = 'Retired teacher from Delhi. Uses smartphone for basic needs but struggles with complex digital interfaces. Often accidentally subscribes to services.',
    is_verified = false
WHERE username = 'sushila_devi';

UPDATE public.profiles 
SET 
    bio = 'Engineering student from Bangalore. Heavy user of streaming and edtech platforms. Very price-conscious and frustrated by hidden costs.',
    is_verified = true
WHERE username = 'arjun_patel';

UPDATE public.profiles 
SET 
    bio = 'Small business owner from Pune. Uses multiple SaaS tools for business. Frustrated by auto-renewals and difficult cancellation processes.',
    is_verified = true
WHERE username = 'meera_singh';

UPDATE public.profiles 
SET 
    bio = 'Consumer rights activist from Hyderabad. Works with Consumer Protection Act cases. Expert in identifying and documenting dark patterns.',
    is_verified = true
WHERE username = 'vijay_reddy';

UPDATE public.profiles 
SET 
    bio = 'Banking professional from Chennai. Very concerned about financial security and transparency. Documents fintech dark patterns.',
    is_verified = true
WHERE username = 'kavitha_nair';

UPDATE public.profiles 
SET 
    bio = 'Government employee from Bihar. Prefers Hindi interfaces but often encounters English-only subscription flows. Advocates for regional language support.',
    is_verified = false
WHERE username = 'rajesh_yadav';

UPDATE public.profiles 
SET 
    bio = 'Mother of two from Jaipur. Manages family subscriptions and is frustrated by children accidentally subscribing to services through games and apps.',
    is_verified = false
WHERE username = 'anita_gupta';

UPDATE public.profiles 
SET 
    bio = 'Retired government officer from Kerala. Uses basic smartphone features but struggles with subscription management. Often needs family help.',
    is_verified = false
WHERE username = 'bhaskar_iyer';

UPDATE public.profiles 
SET 
    bio = 'Platform administrator for Ethical Patterns. Manages user submissions, moderates content, and ensures platform integrity.',
    is_verified = true
WHERE username = 'admin';

-- Return success message
SELECT 'Demo data created successfully! Created patterns, comments, votes, and updated user profiles.' as result;
