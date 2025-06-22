import React from 'react';
import { 
  TrendingUp, 
  MessageSquare, 
  BookOpen, 
  ShoppingCart, 
  Users, 
  Award,
  ArrowRight,
  Calendar,
  Clock
} from 'lucide-react';

const Home = () => {
  const stats = [
    { name: 'Active Discussions', value: '1,247', icon: MessageSquare, change: '+12%' },
    { name: 'Course Completions', value: '892', icon: Award, change: '+8%' },
    { name: 'Products Sold', value: '3,456', icon: ShoppingCart, change: '+23%' },
    { name: 'Community Members', value: '12,847', icon: Users, change: '+15%' },
  ];

  const trendingProducts = [
    { name: 'Digital X-Ray Sensor', price: '$2,899', image: 'https://images.pexels.com/photos/3786249/pexels-photo-3786249.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Ultrasonic Scaler', price: '$899', image: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'LED Curing Light', price: '$459', image: 'https://images.pexels.com/photos/3779706/pexels-photo-3779706.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ];

  const recentDiscussions = [
    { title: 'Best practices for root canal treatment', replies: 23, time: '2h ago' },
    { title: 'Digital impressions vs traditional', replies: 18, time: '4h ago' },
    { title: 'Patient anxiety management techniques', replies: 31, time: '6h ago' },
  ];

  const upcomingCourses = [
    { title: 'Advanced Endodontics Masterclass', date: 'Dec 15', instructor: 'Dr. Sarah Johnson' },
    { title: 'Cosmetic Dentistry Trends 2024', date: 'Dec 18', instructor: 'Dr. Michael Chen' },
    { title: 'Pediatric Dentistry Best Practices', date: 'Dec 22', instructor: 'Dr. Emily Rodriguez' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, Dr. Smith</h1>
        <p className="text-gray-600">Here's what's happening in your dental community today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    <p className="ml-2 text-sm font-medium text-green-600">{stat.change}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trending Products */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                Trending Products
              </h2>
              <button className="text-blue-600 hover:text-blue-700 flex items-center text-sm">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {trendingProducts.map((product, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-sm text-blue-600 font-semibold">{product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Discussions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
                Recent Discussions
              </h2>
              <button className="text-green-600 hover:text-green-700 flex items-center text-sm">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentDiscussions.map((discussion, index) => (
                <div key={index} className="border-l-2 border-green-200 pl-4">
                  <p className="text-sm font-medium text-gray-900 mb-1">{discussion.title}</p>
                  <div className="flex items-center text-xs text-gray-500 space-x-4">
                    <span className="flex items-center">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      {discussion.replies} replies
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {discussion.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Courses */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-purple-600" />
                Upcoming Courses
              </h2>
              <button className="text-purple-600 hover:text-purple-700 flex items-center text-sm">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingCourses.map((course, index) => (
                <div key={index} className="border border-gray-100 rounded-lg p-3 hover:border-purple-200 transition-colors">
                  <p className="text-sm font-medium text-gray-900 mb-1">{course.title}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {course.date}
                    </span>
                    <span>{course.instructor}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;