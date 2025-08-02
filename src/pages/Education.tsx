import React, { useState, useEffect } from 'react';
import { 
  Play, 
  BookOpen, 
  Users, 
  Clock, 
  Star, 
  Filter,
  Search,
  Grid,
  List,
  ShoppingCart,
  Heart,
  Share2
} from 'lucide-react';
import PaymentModal from '../components/PaymentModal';
import { supabase, getCourses, getVideos } from '../lib/supabase';
import { useAuthContext } from '../components/AuthProvider';

const Education = () => {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'courses' | 'videos' | 'reels'>('courses');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [courses, setCourses] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'endodontics', name: 'Endodontics' },
    { id: 'orthodontics', name: 'Orthodontics' },
    { id: 'periodontics', name: 'Periodontics' },
    { id: 'prosthodontics', name: 'Prosthodontics' },
    { id: 'oral_surgery', name: 'Oral Surgery' },
    { id: 'pediatric', name: 'Pediatric Dentistry' },
    { id: 'cosmetic', name: 'Cosmetic Dentistry' },
    { id: 'implantology', name: 'Implantology' },
  ];

  useEffect(() => {
    fetchContent();
  }, [activeTab]);

  const fetchContent = async () => {
    if (!supabase) {
      // Mock data when Supabase is not configured
      setCourses(mockCourses);
      setVideos(mockVideos);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      if (activeTab === 'courses') {
        const coursesData = await getCourses();
        setCourses(coursesData || []);
      } else {
        const videosData = await getVideos(activeTab === 'reels' ? 'reel' : 'lecture');
        setVideos(videosData || []);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const mockCourses = [
    {
      id: '1',
      title: 'Advanced Endodontics Masterclass',
      description: 'Comprehensive course covering modern endodontic techniques and case management.',
      instructor_id: '1',
      price: 299.99,
      duration_hours: 12,
      level: 'Advanced',
      category: 'endodontics',
      thumbnail_url: 'https://images.pexels.com/photos/3779709/pexels-photo-3779709.jpeg?auto=compress&cs=tinysrgb&w=600',
      enrollment_count: 1247,
      rating: 4.8,
      profiles: {
        full_name: 'Dr. Sarah Johnson',
        avatar_url: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=100',
        specialization: 'Endodontist'
      }
    },
    {
      id: '2',
      title: 'Digital Orthodontics Revolution',
      description: 'Learn the latest digital orthodontic techniques and clear aligner therapy.',
      instructor_id: '2',
      price: 399.99,
      duration_hours: 16,
      level: 'Intermediate',
      category: 'orthodontics',
      thumbnail_url: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=600',
      enrollment_count: 892,
      rating: 4.9,
      profiles: {
        full_name: 'Dr. Michael Chen',
        avatar_url: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=100',
        specialization: 'Orthodontist'
      }
    },
    {
      id: '3',
      title: 'Cosmetic Dentistry Essentials',
      description: 'Master the art of cosmetic dentistry with hands-on techniques and case studies.',
      instructor_id: '3',
      price: 249.99,
      duration_hours: 10,
      level: 'Beginner',
      category: 'cosmetic',
      thumbnail_url: 'https://images.pexels.com/photos/3786249/pexels-photo-3786249.jpeg?auto=compress&cs=tinysrgb&w=600',
      enrollment_count: 1456,
      rating: 4.7,
      profiles: {
        full_name: 'Dr. Emily Rodriguez',
        avatar_url: 'https://images.pexels.com/photos/4269697/pexels-photo-4269697.jpeg?auto=compress&cs=tinysrgb&w=100',
        specialization: 'Cosmetic Dentist'
      }
    }
  ];

  const mockVideos = [
    {
      id: '1',
      title: 'Root Canal Technique Demonstration',
      description: 'Step-by-step root canal procedure with modern techniques.',
      instructor_id: '1',
      video_url: 'https://example.com/video1',
      thumbnail_url: 'https://images.pexels.com/photos/3779709/pexels-photo-3779709.jpeg?auto=compress&cs=tinysrgb&w=600',
      duration_seconds: 1800,
      type: 'lecture',
      category: 'endodontics',
      views_count: 15420,
      likes_count: 892,
      profiles: {
        full_name: 'Dr. Sarah Johnson',
        avatar_url: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=100',
        specialization: 'Endodontist'
      }
    },
    {
      id: '2',
      title: 'Quick Orthodontic Tips',
      description: 'Fast tips for better orthodontic outcomes.',
      instructor_id: '2',
      video_url: 'https://example.com/video2',
      thumbnail_url: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=600',
      duration_seconds: 300,
      type: 'reel',
      category: 'orthodontics',
      views_count: 8934,
      likes_count: 567,
      profiles: {
        full_name: 'Dr. Michael Chen',
        avatar_url: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=100',
        specialization: 'Orthodontist'
      }
    }
  ];

  const filteredContent = () => {
    const content = activeTab === 'courses' ? courses : videos;
    return content.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  const handleEnrollCourse = (course: any) => {
    if (course.price > 0) {
      setSelectedCourse(course);
      setShowPaymentModal(true);
    } else {
      // Handle free course enrollment
      console.log('Enrolling in free course:', course.id);
    }
  };

  const handlePaymentSuccess = (transactionId: string) => {
    console.log('Payment successful:', transactionId);
    // Handle successful enrollment
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dental Education</h1>
        <p className="text-gray-600">Advance your dental knowledge with expert-led courses and videos</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'courses', label: 'Courses', icon: BookOpen },
            { key: 'videos', label: 'Videos', icon: Play },
            { key: 'reels', label: 'Reels', icon: Play }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`${
                activeTab === key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses and videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredContent().map((item) => (
            <div key={item.id} className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${viewMode === 'list' ? 'flex' : ''}`}>
              <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                <img
                  src={item.thumbnail_url}
                  alt={item.title}
                  className={`object-cover ${viewMode === 'list' ? 'w-full h-32' : 'w-full h-48'}`}
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Play className="h-12 w-12 text-white" />
                </div>
                {activeTab === 'courses' && (
                  <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                    {item.level}
                  </div>
                )}
                {(activeTab === 'videos' || activeTab === 'reels') && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                    {formatDuration(item.duration_seconds)}
                  </div>
                )}
              </div>
              
              <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{item.title}</h3>
                  <div className="flex items-center space-x-2 ml-2">
                    <button className="text-gray-400 hover:text-red-500 transition-colors">
                      <Heart className="h-4 w-4" />
                    </button>
                    <button className="text-gray-400 hover:text-blue-500 transition-colors">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={item.profiles?.avatar_url}
                    alt={item.profiles?.full_name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.profiles?.full_name}</p>
                    <p className="text-xs text-gray-500">{item.profiles?.specialization}</p>
                  </div>
                </div>

                {activeTab === 'courses' ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {item.duration_hours}h
                        </span>
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {item.enrollment_count}
                        </span>
                        <span className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                          {item.rating}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-blue-600">
                        {item.price > 0 ? `$${item.price}` : 'Free'}
                      </div>
                      <button
                        onClick={() => handleEnrollCourse(item)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                      >
                        {item.price > 0 ? (
                          <>
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Enroll Now
                          </>
                        ) : (
                          'Start Learning'
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      <span>{item.views_count?.toLocaleString()} views</span>
                      <span className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {item.likes_count}
                      </span>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Watch Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredContent().length === 0 && !loading && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedCourse && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
          amount={selectedCourse.price}
          currency="USD"
          sellerId={selectedCourse.instructor_id}
          commissionRate={10} // 10% commission for courses
          title="Enroll in Course"
          description={`Complete your enrollment in "${selectedCourse.title}"`}
        />
      )}
    </div>
  );
};

export default Education;