import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, GraduationCap, MapPin } from 'lucide-react';
import { signIn, signUp, createProfile, isSupabaseConfigured } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    specialization: '',
    location: '',
    phone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      setError('Database connection not configured. Please set up Supabase credentials.');
      setLoading(false);
      return;
    }

    try {
      if (mode === 'signin') {
        await signIn(formData.email, formData.password);
        navigate('/');
      } else {
        // Validate password confirmation
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        const result = await signUp(formData.email, formData.password, {
          full_name: formData.full_name
        });
        
        // Create profile for the new user
        if (result.user) {
          await createProfile({
            id: result.user.id,
            email: formData.email,
            full_name: formData.full_name,
            specialization: formData.specialization,
            location: formData.location,
            phone: formData.phone,
            is_verified: false
          });
        }
        
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSocialAuth = (provider: string) => {
    // Placeholder for social authentication
    console.log(`${provider} authentication not implemented yet`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-8">
      {/* Logo and Header */}
      <div className="mb-8 text-center">
        <div className="mb-6">
          <img
            src="/WhatsApp Image 2025-08-02 at 01.50.51_fa244b23.jpg"
            alt="FlossUp Logo"
            className="h-32 w-auto mx-auto"
          />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome to FlossUp!
        </h1>
        <p className="text-gray-600 text-lg">
          Your complete dental companion.
        </p>
      </div>

      {/* Mode Switch */}
      <div className="flex mb-8 bg-gray-100 rounded-full p-1">
        <button
          className={`px-8 py-3 rounded-full font-medium transition-all duration-200 ${
            mode === 'signin' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setMode('signin')}
        >
          Sign In
        </button>
        <button
          className={`px-8 py-3 rounded-full font-medium transition-all duration-200 ${
            mode === 'signup' 
              ? 'bg-green-600 text-white shadow-md' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setMode('signup')}
        >
          Sign Up
        </button>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="full_name"
                  required
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Dr. John Smith"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                  mode === 'signin' ? 'focus:ring-blue-500' : 'focus:ring-green-500'
                }`}
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                  mode === 'signin' ? 'focus:ring-blue-500' : 'focus:ring-green-500'
                }`}
                placeholder="Enter your password"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    placeholder="Confirm your password"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialization
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select specialization</option>
                    <option value="General Dentist">General Dentist</option>
                    <option value="Endodontist">Endodontist</option>
                    <option value="Orthodontist">Orthodontist</option>
                    <option value="Periodontist">Periodontist</option>
                    <option value="Oral Surgeon">Oral Surgeon</option>
                    <option value="Prosthodontist">Prosthodontist</option>
                    <option value="Pediatric Dentist">Pediatric Dentist</option>
                    <option value="Dental Hygienist">Dental Hygienist</option>
                    <option value="Dental Assistant">Dental Assistant</option>
                    <option value="Lab Technician">Lab Technician</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    placeholder="City, Country"
                  />
                </div>
              </div>
            </>
          )}

          {mode === 'signin' && (
            <div className="text-right">
              <button
                type="button"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              mode === 'signin'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Please wait...
              </div>
            ) : (
              mode === 'signin' ? 'Sign In' : 'Sign Up'
            )}
          </button>
        </form>

        {/* Social Authentication */}
        <div className="mt-8">
          <div className="flex items-center mb-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500 text-sm font-medium">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleSocialAuth('google')}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <button
              type="button"
              onClick={() => handleSocialAuth('apple')}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Continue with Apple
            </button>
          </div>
        </div>

        {/* Terms and Privacy */}
        <p className="text-xs text-center text-gray-500 mt-6">
          By continuing, you agree to FlossUp's{' '}
          <button className="text-blue-600 hover:underline">Terms of Service</button>
          {' '}&{' '}
          <button className="text-blue-600 hover:underline">Privacy Policy</button>.
        </p>
      </div>
    </div>
  );
};

export default AuthPage;