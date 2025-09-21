-- Create enum for pattern types
CREATE TYPE public.pattern_type AS ENUM ('dark_pattern', 'ethical_alternative', 'cancellation_trap', 'hidden_cost', 'misleading_language', 'forced_renewal');

-- Create enum for subscription categories
CREATE TYPE public.subscription_category AS ENUM ('saas', 'streaming', 'news', 'fitness', 'education', 'ecommerce', 'fintech', 'gaming', 'other');

-- Create enum for protection status
CREATE TYPE public.protection_status AS ENUM ('active', 'warning', 'blocked', 'safe');

-- Create enum for user subscription status
CREATE TYPE public.subscription_status AS ENUM ('active', 'cancelled', 'disputed', 'refunded');

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  website_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create patterns table for storing user-submitted patterns
CREATE TABLE public.patterns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  company_name TEXT,
  website_url TEXT,
  pattern_type pattern_type NOT NULL,
  category subscription_category NOT NULL,
  screenshot_url TEXT,
  impact_score INTEGER CHECK (impact_score >= 1 AND impact_score <= 5),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create votes table for tracking user votes on patterns
CREATE TABLE public.pattern_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pattern_id UUID NOT NULL REFERENCES public.patterns(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, pattern_id)
);

-- Create comments table for pattern discussions
CREATE TABLE public.pattern_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pattern_id UUID NOT NULL REFERENCES public.patterns(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user roles table
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'moderator', 'user')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create user subscriptions table for tracking user's subscriptions
CREATE TABLE public.user_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  service_name TEXT NOT NULL,
  subscription_type subscription_category NOT NULL,
  monthly_cost DECIMAL(10,2),
  status subscription_status DEFAULT 'active',
  start_date DATE NOT NULL,
  renewal_date DATE,
  cancellation_date DATE,
  cancellation_difficulty INTEGER CHECK (cancellation_difficulty >= 1 AND cancellation_difficulty <= 5),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create protection alerts table for real-time warnings
CREATE TABLE public.protection_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  website_url TEXT NOT NULL,
  pattern_detected pattern_type NOT NULL,
  severity INTEGER CHECK (severity >= 1 AND severity <= 5),
  alert_message TEXT NOT NULL,
  protection_action TEXT, -- 'warn', 'block', 'redirect'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cancellation guides table
CREATE TABLE public.cancellation_guides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  service_name TEXT NOT NULL,
  category subscription_category NOT NULL,
  difficulty_level INTEGER CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
  steps JSONB NOT NULL, -- Array of step objects
  direct_cancellation_url TEXT,
  phone_number TEXT,
  email TEXT,
  chat_support_url TEXT,
  estimated_time TEXT,
  tips TEXT[],
  legal_rights TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user protection settings table
CREATE TABLE public.user_protection_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  real_time_protection BOOLEAN DEFAULT true,
  email_alerts BOOLEAN DEFAULT true,
  browser_extension_enabled BOOLEAN DEFAULT false,
  auto_cancel_detection BOOLEAN DEFAULT true,
  report_automatically BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pattern_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pattern_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.protection_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cancellation_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_protection_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create RLS policies for patterns
CREATE POLICY "Approved patterns are viewable by everyone" 
  ON public.patterns FOR SELECT 
  USING (status = 'approved' OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own patterns" 
  ON public.patterns FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own patterns" 
  ON public.patterns FOR UPDATE 
  USING (auth.uid() = user_id AND status = 'pending');

-- Create RLS policies for votes
CREATE POLICY "Users can view all votes" 
  ON public.pattern_votes FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own votes" 
  ON public.pattern_votes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes" 
  ON public.pattern_votes FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes" 
  ON public.pattern_votes FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for comments
CREATE POLICY "Comments are viewable by everyone" 
  ON public.pattern_comments FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own comments" 
  ON public.pattern_comments FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
  ON public.pattern_comments FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
  ON public.pattern_comments FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for user roles (admin only)
CREATE POLICY "User roles are viewable by everyone" 
  ON public.user_roles FOR SELECT 
  USING (true);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, display_name)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'username',
    new.raw_user_meta_data ->> 'display_name'
  );
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  
  RETURN new;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patterns_updated_at
  BEFORE UPDATE ON public.patterns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pattern_comments_updated_at
  BEFORE UPDATE ON public.pattern_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update vote counts
CREATE OR REPLACE FUNCTION public.update_pattern_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.vote_type = 'upvote' THEN
      UPDATE public.patterns SET upvotes = upvotes + 1 WHERE id = NEW.pattern_id;
    ELSE
      UPDATE public.patterns SET downvotes = downvotes + 1 WHERE id = NEW.pattern_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle vote change
    IF OLD.vote_type = 'upvote' AND NEW.vote_type = 'downvote' THEN
      UPDATE public.patterns SET upvotes = upvotes - 1, downvotes = downvotes + 1 WHERE id = NEW.pattern_id;
    ELSIF OLD.vote_type = 'downvote' AND NEW.vote_type = 'upvote' THEN
      UPDATE public.patterns SET upvotes = upvotes + 1, downvotes = downvotes - 1 WHERE id = NEW.pattern_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.vote_type = 'upvote' THEN
      UPDATE public.patterns SET upvotes = upvotes - 1 WHERE id = OLD.pattern_id;
    ELSE
      UPDATE public.patterns SET downvotes = downvotes - 1 WHERE id = OLD.pattern_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for vote count updates
CREATE TRIGGER update_vote_counts_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.pattern_votes
  FOR EACH ROW EXECUTE FUNCTION public.update_pattern_vote_counts();

-- Create RLS policies for user subscriptions
CREATE POLICY "Users can view their own subscriptions" 
  ON public.user_subscriptions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" 
  ON public.user_subscriptions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" 
  ON public.user_subscriptions FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subscriptions" 
  ON public.user_subscriptions FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for protection alerts
CREATE POLICY "Users can view their own alerts" 
  ON public.protection_alerts FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own alerts" 
  ON public.protection_alerts FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alerts" 
  ON public.protection_alerts FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create RLS policies for cancellation guides (public read, admin write)
CREATE POLICY "Cancellation guides are viewable by everyone" 
  ON public.cancellation_guides FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage cancellation guides" 
  ON public.cancellation_guides FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- Create RLS policies for user protection settings
CREATE POLICY "Users can view their own protection settings" 
  ON public.user_protection_settings FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own protection settings" 
  ON public.user_protection_settings FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own protection settings" 
  ON public.user_protection_settings FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_patterns_status ON public.patterns(status);
CREATE INDEX idx_patterns_category ON public.patterns(category);
CREATE INDEX idx_patterns_pattern_type ON public.patterns(pattern_type);
CREATE INDEX idx_patterns_created_at ON public.patterns(created_at DESC);
CREATE INDEX idx_pattern_votes_pattern_id ON public.pattern_votes(pattern_id);
CREATE INDEX idx_pattern_comments_pattern_id ON public.pattern_comments(pattern_id);
CREATE INDEX idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON public.user_subscriptions(status);
CREATE INDEX idx_protection_alerts_user_id ON public.protection_alerts(user_id);
CREATE INDEX idx_protection_alerts_website ON public.protection_alerts(website_url);
CREATE INDEX idx_cancellation_guides_company ON public.cancellation_guides(company_name);
CREATE INDEX idx_cancellation_guides_category ON public.cancellation_guides(category);