import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from './AuthProvider';
import AuthModal from './AuthModal';
import { signOut, isSupabaseConfigured } from '../lib/supabase';
import { 
  Home, 
  ShoppingBag, 
  MessageCircle, 
  GraduationCap, 
  Users, 
  Microscope, 
  UserPlus,
  User,
  Menu,
  X,
  Bell,
  Search,
  LogOut
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, profile, isAuthenticated } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Shop', href: '/shop', icon: ShoppingBag },
    { name: 'Chat', href: '/chat', icon: MessageCircle },
    { name: 'Education', href: '/education', icon: GraduationCap },
    { name: 'Social', href: '/social', icon: Users },
    { name: 'Lab Services', href: '/lab-services', icon: Microscope },
    { name: 'Referrals', href: '/referrals', icon: UserPlus },
    { name: 'Account', href: '/account', icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured - cannot sign out');
      return;
    }
    
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <img 
                  src="/WhatsApp Image 2025-06-12 at 07.13.50_9ffe3f55.jpg" 
                  alt="FlossUp Logo" 
                  className="h-10 w-auto"
                />
                <span className="ml-2 text-xl font-bold text-gray-900">FlossUp</span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products, courses, discussions..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Bell className="h-5 w-5" />
                  </button>
                  
                  <div className="flex items-center space-x-3">
                    <img
                      src={profile?.avatar_url || 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=100'}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <span className="hidden md:block text-sm font-medium text-gray-700">
                      {profile?.full_name || 'User'}
                    </span>
                    <button
                      onClick={handleSignOut}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Sign Out"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => navigate('/auth')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </button>
              )}
              
              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 text-gray-400 hover:text-gray-600"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <nav className="hidden md:block fixed left-0 top-16 bottom-0 w-64 bg-white shadow-lg z-40">
        <div className="flex flex-col h-full pt-5">
          <div className="flex-1 px-4 pb-4 overflow-y-auto">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`${
                        isActive(item.href)
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-3 py-2 text-sm font-medium rounded-l-md transition-colors`}
                    >
                      <Icon className={`${
                        isActive(item.href) ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                      } mr-3 h-5 w-5 transition-colors`} />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-7 h-16">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  isActive(item.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700'
                } flex flex-col items-center justify-center px-1 py-2 text-xs font-medium transition-colors`}
              >
                <Icon className={`${
                  isActive(item.href) ? 'text-blue-600' : 'text-gray-400'
                } h-5 w-5 mb-1`} />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-gray-600 bg-opacity-75">
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full pt-20">
              <div className="flex-1 px-4 pb-4 overflow-y-auto">
                <ul className="space-y-2">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          className={`${
                            isActive(item.href)
                              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          } group flex items-center px-3 py-2 text-sm font-medium rounded-l-md transition-colors`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Icon className={`${
                            isActive(item.href) ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                          } mr-3 h-5 w-5 transition-colors`} />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="md:ml-64">
        <div className="py-6">
          {children}
        </div>
      </main>

    </div>
  );
};

export default Layout;