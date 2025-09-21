import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, User, LogOut, Plus, AlertTriangle, XCircle, BookOpen, Building2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { user, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-red-600" />
          <span className="text-xl font-bold">Dark Pattern Shield</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/protection" className="text-sm font-medium hover:text-red-600 transition-colors flex items-center gap-1">
            <AlertTriangle className="w-4 h-4" />
            Protection
          </Link>
          <Link to="/cancellation-assistant" className="text-sm font-medium hover:text-red-600 transition-colors flex items-center gap-1">
            <XCircle className="w-4 h-4" />
            Cancel Subs
          </Link>
          <Link to="/patterns" className="text-sm font-medium hover:text-red-600 transition-colors">
            Browse Patterns
          </Link>
          <Link to="/education" className="text-sm font-medium hover:text-red-600 transition-colors flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            Learn
          </Link>
          <Link to="/accountability" className="text-sm font-medium hover:text-red-600 transition-colors flex items-center gap-1">
            <Building2 className="w-4 h-4" />
            Accountability
          </Link>
          <Link to="/submit" className="text-sm font-medium hover:text-red-600 transition-colors">
            Report Pattern
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <Link to="/protection">
                <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                  <Shield className="w-4 h-4 mr-2" />
                  Protection
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/protection">
                      <Shield className="mr-2 h-4 w-4" />
                      Protection Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/cancellation-assistant">
                      <XCircle className="mr-2 h-4 w-4" />
                      Cancel Subscriptions
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/auth">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button variant="hero" size="sm">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;