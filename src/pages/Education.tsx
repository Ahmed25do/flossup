import React, { useState } from 'react';
import { 
  BookOpen, 
  Play, 
  Clock, 
  Users, 
  Star, 
  Bookmark, 
  Search, 
  Filter,
  Calendar,
  Award,
  Download,
  Book,
  FileText,
  Video,
  Upload,
  Radio,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Eye,
  Minus,
  Image,
  Smile
} from 'lucide-react';

const Education = () => {
  const [activeTab, setActiveTab] = useState<'courses' | 'articles' | 'books' | 'live' | 'my-content'>('courses');
  const [savedItems, setSavedItems] = useState<string[]>([]);
  const [contentSubTab, setContentSubTab] = useState<'upload' | 'videos' | 'articles' | 'live' | 'analytics'>('upload');
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);
  const [newPost, setNewPost] = useState('');

  const toggleSaved = (id: string) => {
    setSavedItems(prev =>
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const courses = [
    {
      id: '1',
      title: 'Advanced Endodontics Masterclass',
      instructor: 'Dr. Sarah Johnson',
      duration: '6 hours',
      students: 1247,
      rating: 4.9,
      price: 299,
      image: 'https://images.pexels.com/photos/3779709/pexels-photo-3779709.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Endodontics',
      level: 'Advanced',
      description: 'Comprehensive course covering the latest techniques in root canal therapy and endodontic surgery.',
      modules: 12,
      certificate: true
    },
    {
      id: '2',
      title: 'Digital Dentistry Fundamentals',
      instructor: 'Dr. Michael Chen',
      duration: '4 hours',
      students: 892,
      rating: 4.7,
      price: 199,
      image: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Digital Dentistry',
      level: 'Intermediate',
      description: 'Learn about CAD/CAM technology, digital impressions, and 3D printing in dentistry.',
      modules: 8,
      certificate: true
    },
    {
      id: '3',
      title: 'Pediatric Dentistry Best Practices',
      instructor: 'Dr. Emily Rodriguez',
      duration: '3 hours',
      students: 654,
      rating: 4.8,
      price: 149,
      image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Pediatric',
      level: 'Beginner',
      description: 'Essential techniques for treating young patients with confidence and care.',
      modules: 6,
      certificate: true
    }
  ];

  const articles = [
    {
      id: 'a1',
      title: 'The Future of AI in Dental Diagnosis',
      author: 'Dr. James Wilson',
      readTime: '8 min',
      category: 'Technology',
      image: 'https://images.pexels.com/photos/3786249/pexels-photo-3786249.jpeg?auto=compress&cs=tinysrgb&w=600',
      excerpt: 'Exploring how artificial intelligence is revolutionizing dental diagnostics and treatment planning.',
      publishedAt: '2 days ago',
      views: 2341
    },
    {
      id: 'a2',
      title: 'Managing Patient Anxiety in Dental Practice',
      author: 'Dr. Lisa Park',
      readTime: '6 min',
      category: 'Patient Care',
      image: 'https://images.pexels.com/photos/3779706/pexels-photo-3779706.jpeg?auto=compress&cs=tinysrgb&w=600',
      excerpt: 'Proven strategies to help anxious patients feel comfortable during dental procedures.',
      publishedAt: '1 week ago',
      views: 1897
    },
    {
      id: 'a3',
      title: 'Latest Trends in Cosmetic Dentistry',
      author: 'Dr. Robert Kim',
      readTime: '10 min',
      category: 'Cosmetic',
      image: 'https://images.pexels.com/photos/263391/pexels-photo-263391.jpeg?auto=compress&cs=tinysrgb&w=600',
      excerpt: 'Discover the newest techniques and materials transforming cosmetic dental treatments.',
      publishedAt: '3 days ago',
      views: 3156
    }
  ];

  const books = [
    {
      id: 'b1',
      title: 'Comprehensive Endodontics: Theory and Practice',
      author: 'Dr. Michael Harrison',
      pages: 856,
      category: 'Endodontics',
      image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'The definitive guide to modern endodontic procedures, covering everything from basic principles to advanced surgical techniques.',
      price: 189,
      format: 'Digital + Print',
      rating: 4.8,
      reviews: 234,
      publishYear: '2024'
    },
    {
      id: 'b2',
      title: 'Digital Dentistry: A Comprehensive Guide',
      author: 'Dr. Sarah Chen',
      pages: 642,
      category: 'Digital Dentistry',
      image: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Complete coverage of digital workflows, CAD/CAM systems, and 3D printing applications in modern dental practice.',
      price: 159,
      format: 'Digital Only',
      rating: 4.7,
      reviews: 187,
      publishYear: '2024'
    },
    {
      id: 'b3',
      title: 'Oral Surgery: Principles and Techniques',
      author: 'Dr. Robert Martinez',
      pages: 724,
      category: 'Oral Surgery',
      image: 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Essential reference for oral and maxillofacial surgery procedures, with detailed illustrations and case studies.',
      price: 199,
      format: 'Print Only',
      rating: 4.9,
      reviews: 156,
      publishYear: '2023'
    },
    {
      id: 'b4',
      title: 'Pediatric Dentistry: Clinical Approaches',
      author: 'Dr. Jennifer Adams',
      pages: 512,
      category: 'Pediatric',
      image: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Practical guide to treating children and adolescents, covering behavior management and specialized procedures.',
      price: 139,
      format: 'Digital + Print',
      rating: 4.6,
      reviews: 203,
      publishYear: '2024'
    },
    {
      id: 'b5',
      title: 'Orthodontics: Contemporary Concepts',
      author: 'Dr. David Thompson',
      pages: 698,
      category: 'Orthodontics',
      image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Modern orthodontic treatment planning and execution, including clear aligner therapy and digital orthodontics.',
      price: 179,
      format: 'Digital Only',
      rating: 4.8,
      reviews: 178,
      publishYear: '2024'
    },
    {
      id: 'b6',
      title: 'Periodontics: Diagnosis and Treatment',
      author: 'Dr. Maria Rodriguez',
      pages: 589,
      category: 'Periodontics',
      image: 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Comprehensive approach to periodontal disease management, from non-surgical therapy to regenerative procedures.',
      price: 169,
      format: 'Print Only',
      rating: 4.7,
      reviews: 145,
      publishYear: '2023'
    }
  ];

  const liveEvents = [
    {
      id: 'l1',
      title: 'Live Surgery: Complex Implant Case',
      presenter: 'Dr. Alexandra Martinez',
      date: 'Dec 15, 2024',
      time: '2:00 PM EST',
      attendees: 847,
      image: 'https://images.pexels.com/photos/3845623/pexels-photo-3845623.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Watch live as Dr. Martinez performs a complex implant procedure with Q&A session.',
      price: 'Free',
      category: 'Surgery'
    },
    {
      id: 'l2',
      title: 'Orthodontics Round Table Discussion',
      presenter: 'Multiple Experts',
      date: 'Dec 18, 2024',
      time: '7:00 PM EST',
      attendees: 1203,
      image: 'https://images.pexels.com/photos/4269697/pexels-photo-4269697.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Panel discussion on the latest orthodontic techniques and case studies.',
      price: '$29',
      category: 'Orthodontics'
    }
  ];

  // My Content Data
  const myVideos = [
    {
      id: '1',
      title: 'Advanced Root Canal Techniques',
      thumbnail: 'https://images.pexels.com/photos/3786249/pexels-photo-3786249.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '45:30',
      views: 2847,
      likes: 156,
      uploadDate: '2024-12-01',
      status: 'Published'
    },
    {
      id: '2',
      title: 'Digital Impression Best Practices',
      thumbnail: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '32:15',
      views: 1923,
      likes: 89,
      uploadDate: '2024-11-28',
      status: 'Published'
    },
    {
      id: '3',
      title: 'Pediatric Dentistry Workshop',
      thumbnail: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '28:45',
      views: 0,
      likes: 0,
      uploadDate: '2024-12-10',
      status: 'Processing'
    }
  ];

  const myArticles = [
    {
      id: '1',
      title: 'The Future of AI in Dental Diagnosis',
      excerpt: 'Exploring how artificial intelligence is revolutionizing dental diagnostics...',
      readTime: '8 min',
      views: 3421,
      publishDate: '2024-12-05',
      status: 'Published'
    },
    {
      id: '2',
      title: 'Managing Complex Endodontic Cases',
      excerpt: 'A comprehensive guide to handling challenging root canal procedures...',
      readTime: '12 min',
      views: 2156,
      publishDate: '2024-11-30',
      status: 'Published'
    },
    {
      id: '3',
      title: 'Digital Workflow Integration',
      excerpt: 'How to seamlessly integrate digital tools into your practice...',
      readTime: '6 min',
      views: 0,
      publishDate: '2024-12-10',
      status: 'Draft'
    }
  ];

  const liveStreams = [
    {
      id: '1',
      title: 'Live Q&A: Endodontic Challenges',
      scheduledDate: '2024-12-15',
      scheduledTime: '2:00 PM EST',
      expectedViewers: 150,
      status: 'Scheduled'
    },
    {
      id: '2',
      title: 'Real-time Implant Surgery',
      scheduledDate: '2024-12-20',
      scheduledTime: '10:00 AM EST',
      expectedViewers: 300,
      status: 'Scheduled'
    }
  ];

  const categories = ['All', 'Endodontics', 'Orthodontics', 'Cosmetic', 'Pediatric', 'Surgery', 'Technology'];

  const handleStartLive = () => {
    setIsLiveModalOpen(true);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPost.trim()) {
      console.log('Creating post:', newPost);
      setNewPost('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Educational Resources</h1>
        <p className="text-gray-600">Advance your dental knowledge with expert-led courses and content</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'courses', label: 'Courses', icon: BookOpen },
            { key: 'articles', label: 'Articles', icon: FileText },
            { key: 'books', label: 'Books', icon: Book },
            { key: 'live', label: 'Live Events', icon: Calendar },
            { key: 'my-content', label: 'My Content', icon: Upload }
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

      {/* Search and Filter Bar */}
      {activeTab !== 'my-content' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search educational content..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-4">
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>All Categories</option>
                {categories.slice(1).map(category => (
                  <option key={category}>{category}</option>
                ))}
              </select>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>All Levels</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                  {course.category}
                </div>
                <button
                  onClick={() => toggleSaved(course.id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50"
                >
                  <Bookmark 
                    className={`h-4 w-4 ${savedItems.includes(course.id) ? 'text-blue-600 fill-current' : 'text-gray-400'}`} 
                  />
                </button>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {course.duration}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                    course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {course.level}
                  </span>
                  {course.certificate && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Award className="h-3 w-3 mr-1" />
                      Certificate
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <span>{course.instructor}</span>
                  <span className="mx-2">•</span>
                  <span>{course.modules} modules</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(course.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{course.rating}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    {course.students.toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">${course.price}</span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                    <Play className="h-4 w-4 mr-2" />
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'articles' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {articles.map((article) => (
            <div key={article.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex">
                <div className="w-32 h-32 flex-shrink-0">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      {article.category}
                    </span>
                    <button
                      onClick={() => toggleSaved(article.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Bookmark 
                        className={`h-4 w-4 ${savedItems.includes(article.id) ? 'text-purple-600 fill-current' : ''}`} 
                      />
                    </button>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-2">
                      <span>{article.author}</span>
                      <span>•</span>
                      <span>{article.publishedAt}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3 w-3" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'books' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-2 left-2 bg-indigo-600 text-white px-2 py-1 rounded text-xs font-semibold">
                  {book.category}
                </div>
                <button
                  onClick={() => toggleSaved(book.id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50"
                >
                  <Bookmark 
                    className={`h-4 w-4 ${savedItems.includes(book.id) ? 'text-indigo-600 fill-current' : 'text-gray-400'}`} 
                  />
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{book.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{book.author}</p>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{book.description}</p>
                
                <div className="space-y-2 mb-4 text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>Pages:</span>
                    <span>{book.pages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Format:</span>
                    <span>{book.format}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Published:</span>
                    <span>{book.publishYear}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(book.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{book.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">({book.reviews} reviews)</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">${book.price}</span>
                  <div className="flex space-x-2">
                    {book.format.includes('Digital') && (
                      <button className="bg-indigo-600 text-white px-3 py-2 rounded text-sm hover:bg-indigo-700 transition-colors flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        Buy Digital
                      </button>
                    )}
                    {book.format.includes('Print') && (
                      <button className="bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700 transition-colors">
                        Buy Print
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'live' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {liveEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                  LIVE
                </div>
                <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
                  {event.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{event.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-500">
                    <div className="flex items-center mb-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      {event.date} at {event.time}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      {event.attendees.toLocaleString()} registered
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">by {event.presenter}</p>
                    <p className="text-lg font-bold text-gray-900">{event.price}</p>
                  </div>
                </div>
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                  Register Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* My Content Tab */}
      {activeTab === 'my-content' && (
        <div className="space-y-6">
          {/* Content Sub-tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'upload', label: 'Upload Content', icon: Upload },
                { key: 'videos', label: 'My Videos', icon: Video },
                { key: 'articles', label: 'My Articles', icon: FileText },
                { key: 'live', label: 'Live Broadcasts', icon: Radio },
                { key: 'analytics', label: 'Analytics', icon: BarChart3 }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setContentSubTab(key as any)}
                  className={`${
                    contentSubTab === key
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

          {/* Upload Content Sub-tab */}
          {contentSubTab === 'upload' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Video Upload */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Video className="h-5 w-5 mr-2 text-blue-600" />
                  Upload Video
                </h3>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                    <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">Upload Video Lecture</p>
                    <p className="text-sm text-gray-600 mb-4">
                      Drag and drop your video file here, or click to browse
                    </p>
                    <p className="text-xs text-gray-500">
                      Supported formats: MP4, MOV, AVI (Max 2GB)
                    </p>
                    <input type="file" accept="video/*" className="hidden" />
                    <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Choose File
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Video Title</label>
                    <input
                      type="text"
                      placeholder="Enter video title..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      rows={4}
                      placeholder="Describe your video content..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Select category...</option>
                      <option>Endodontics</option>
                      <option>Orthodontics</option>
                      <option>Oral Surgery</option>
                      <option>Pediatric Dentistry</option>
                      <option>Cosmetic Dentistry</option>
                    </select>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    Upload Video
                  </button>
                </div>
              </div>

              {/* Article Upload */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-green-600" />
                  Write Article
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Article Title</label>
                    <input
                      type="text"
                      placeholder="Enter article title..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                    <textarea
                      rows={8}
                      placeholder="Write your article content..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                      <Image className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Upload featured image</p>
                      <input type="file" accept="image/*" className="hidden" />
                      <button className="mt-2 text-blue-600 hover:text-blue-700 text-sm">
                        Choose Image
                      </button>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <button className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                      Save as Draft
                    </button>
                    <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                      Publish Article
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* My Videos Sub-tab */}
          {contentSubTab === 'videos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myVideos.map((video) => (
                <div key={video.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="relative">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                      {video.duration}
                    </div>
                    <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-semibold ${
                      video.status === 'Published' ? 'bg-green-100 text-green-800' : 
                      video.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {video.status}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{video.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {video.views.toLocaleString()}
                        </span>
                        <span>{video.likes} likes</span>
                      </div>
                      <span>{video.uploadDate}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center">
                        <Play className="h-4 w-4 mr-1" />
                        View
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 border border-gray-300 rounded">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-red-400 hover:text-red-600 border border-gray-300 rounded">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* My Articles Sub-tab */}
          {contentSubTab === 'articles' && (
            <div className="space-y-6">
              {myArticles.map((article) => (
                <div key={article.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{article.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          article.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {article.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{article.excerpt}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {article.readTime}
                        </span>
                        <span className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {article.views.toLocaleString()} views
                        </span>
                        <span>{article.publishDate}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button className="p-2 text-blue-600 hover:text-blue-700 border border-blue-300 rounded">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-700 border border-gray-300 rounded">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-red-400 hover:text-red-600 border border-gray-300 rounded">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Live Broadcasts Sub-tab */}
          {contentSubTab === 'live' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-red-50 to-pink-100 rounded-lg border border-red-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Live Broadcast</h3>
                    <p className="text-gray-600">Share your knowledge in real-time with the dental community</p>
                  </div>
                  <button
                    onClick={handleStartLive}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                  >
                    <Radio className="h-5 w-5 mr-2" />
                    Go Live
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Scheduled Broadcasts</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {liveStreams.map((stream) => (
                    <div key={stream.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 mb-1">{stream.title}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {stream.scheduledDate}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {stream.scheduledTime}
                            </span>
                            <span className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {stream.expectedViewers} expected viewers
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors">
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-700 px-4 py-2 border border-red-300 rounded text-sm">
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Analytics Sub-tab */}
          {contentSubTab === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Content Performance</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Total Views</p>
                      <p className="text-2xl font-bold text-blue-600">8,347</p>
                    </div>
                    <div className="text-blue-600">
                      <BarChart3 className="h-8 w-8" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Total Likes</p>
                      <p className="text-2xl font-bold text-green-600">1,245</p>
                    </div>
                    <div className="text-green-600">
                      <BarChart3 className="h-8 w-8" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Subscribers</p>
                      <p className="text-2xl font-bold text-purple-600">567</p>
                    </div>
                    <div className="text-purple-600">
                      <Users className="h-8 w-8" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Video className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Video uploaded</p>
                      <p className="text-xs text-gray-500">Advanced Root Canal Techniques</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <FileText className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Article published</p>
                      <p className="text-xs text-gray-500">The Future of AI in Dental Diagnosis</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Radio className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Live stream scheduled</p>
                      <p className="text-xs text-gray-500">Live Q&A: Endodontic Challenges</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Live Broadcast Modal */}
      {isLiveModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Start Live Broadcast</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stream Title</label>
                <input
                  type="text"
                  placeholder="Enter stream title..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe your live stream..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setIsLiveModalOpen(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                  Start Live
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Education;