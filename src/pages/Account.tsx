import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award, 
  Settings,
  Bell,
  Shield,
  Globe,
  Camera,
  Edit3,
  Save,
  X,
  HelpCircle,
  MessageCircle,
  Search,
  ChevronDown,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Headphones,
  FileText,
  Video,
  Book,
  DollarSign
} from 'lucide-react';
import SellerDashboard from '../components/SellerDashboard';

const Account = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'notifications' | 'help' | 'contact' | 'tickets' | 'earnings'>('profile');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: '',
    priority: '',
    description: ''
  });

  const [profile, setProfile] = useState({
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    specialization: 'Endodontist',
    licenseNumber: 'DEN-2024-001',
    yearsExperience: '12',
    location: 'New York, NY',
    bio: 'Experienced endodontist specializing in root canal therapy and dental trauma. Passionate about continuing education and sharing knowledge with fellow dental professionals.',
    website: 'www.drjohnsonendo.com',
    graduationYear: '2012',
    university: 'NYU College of Dentistry'
  });

  const achievements = [
    { title: 'Top Contributor', description: 'Most helpful answers in Endodontics', date: '2024' },
    { title: 'Course Completion', description: 'Advanced Digital Dentistry Certification', date: '2024' },
    { title: 'Community Leader', description: '500+ successful case discussions', date: '2023' },
  ];

  const stats = [
    { label: 'Cases Shared', value: '247', color: 'text-blue-600' },
    { label: 'Connections', value: '1,234', color: 'text-green-600' },
    { label: 'Courses Completed', value: '18', color: 'text-purple-600' },
    { label: 'Lab Orders', value: '89', color: 'text-orange-600' },
  ];

  const faqCategories = [
    {
      title: 'Account & Profile',
      questions: [
        {
          id: '1',
          question: 'How do I update my professional credentials?',
          answer: 'Go to your Profile page, click on "Edit" in the Professional Information section, and update your credentials. Changes may require verification.'
        },
        {
          id: '2',
          question: 'How can I change my subscription plan?',
          answer: 'Navigate to Profile > Account Settings > Subscription. You can upgrade or downgrade your plan at any time. Changes take effect immediately.'
        },
        {
          id: '3',
          question: 'How do I delete my account?',
          answer: 'Contact our support team to request account deletion. Please note that this action is irreversible and all your data will be permanently removed.'
        }
      ]
    },
    {
      title: 'Content & Education',
      questions: [
        {
          id: '4',
          question: 'How do I upload educational videos?',
          answer: 'Go to Education > My Content, select the video tab, and follow the upload process. Videos are reviewed before publication.'
        },
        {
          id: '5',
          question: 'Can I schedule live broadcasts?',
          answer: 'Yes! In the Education section, go to My Content > Live Broadcasts and click "Schedule Broadcast" to set up future live sessions.'
        },
        {
          id: '6',
          question: 'How do I access purchased courses?',
          answer: 'All purchased courses are available in the Education section under "My Courses". You can access them anytime with your account.'
        }
      ]
    },
    {
      title: 'Shop & Orders',
      questions: [
        {
          id: '7',
          question: 'How do I track my order?',
          answer: 'Go to Account > Order History to view all your orders and their current status. You\'ll also receive email updates.'
        },
        {
          id: '8',
          question: 'What is your return policy?',
          answer: 'We offer a 30-day return policy for most items. Products must be in original condition. Contact support to initiate a return.'
        },
        {
          id: '9',
          question: 'Do you offer bulk discounts?',
          answer: 'Yes, we offer volume discounts for orders over $1,000. Contact our sales team for custom pricing.'
        }
      ]
    },
    {
      title: 'Lab Services',
      questions: [
        {
          id: '10',
          question: 'How do I submit a lab case?',
          answer: 'Go to Lab Services > New Request, fill out the case details, upload necessary files, and submit. You\'ll receive a confirmation email.'
        },
        {
          id: '11',
          question: 'How long does lab work typically take?',
          answer: 'Turnaround times vary by service type. Standard cases take 5-7 business days, while rush orders can be completed in 2-3 days for an additional fee.'
        }
      ]
    }
  ];

  const supportTickets = [
    {
      id: 'TK-001',
      subject: 'Video upload failing',
      category: 'Technical',
      priority: 'High',
      status: 'Open',
      created: '2024-12-10',
      lastUpdate: '2024-12-10'
    },
    {
      id: 'TK-002',
      subject: 'Billing question about subscription',
      category: 'Billing',
      priority: 'Medium',
      status: 'In Progress',
      created: '2024-12-08',
      lastUpdate: '2024-12-09'
    },
    {
      id: 'TK-003',
      subject: 'Course certificate not generated',
      category: 'Education',
      priority: 'Low',
      status: 'Resolved',
      created: '2024-12-05',
      lastUpdate: '2024-12-07'
    }
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Here you would save the profile data
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Here you would reset the form data
  };

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting ticket:', newTicket);
    // Reset form
    setNewTicket({ subject: '', category: '', priority: '', description: '' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'text-red-600 bg-red-100';
      case 'In Progress': return 'text-yellow-600 bg-yellow-100';
      case 'Resolved': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="relative inline-block mb-4">
              <img
                src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=200"
                alt="Profile"
                className="h-24 w-24 rounded-full object-cover mx-auto"
              />
              <button className="absolute bottom-0 right-0 p-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                <Camera className="h-3 w-3" />
              </button>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{profile.name}</h2>
            <p className="text-gray-600 mb-4">{profile.specialization}</p>
            <div className="grid grid-cols-2 gap-4 text-center">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                View My Posts
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                My Course Progress
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                Order History
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                Saved Content
              </button>
            </div>
          </div>

          {/* Support Quick Actions */}
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                <MessageCircle className="h-4 w-4 mr-2" />
                Live Chat
              </button>
              <div className="text-center text-sm text-gray-600">
                <p>Call us: (555) 123-4567</p>
                <p className="text-xs">Mon-Fri 9AM-6PM EST</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'profile', label: 'Profile', icon: User },
                { key: 'settings', label: 'Settings', icon: Settings },
                { key: 'notifications', label: 'Notifications', icon: Bell },
                { key: 'earnings', label: 'Earnings', icon: DollarSign },
                { key: 'help', label: 'Help Center', icon: Book },
                { key: 'contact', label: 'Contact Support', icon: Headphones },
                { key: 'tickets', label: 'My Tickets', icon: FileText }
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

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                    >
                      <Edit3 className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                  ) : (
                    <div className="space-x-2">
                      <button
                        onClick={handleSave}
                        className="flex items-center bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center text-gray-600 hover:text-gray-700 text-sm"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {profile.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {profile.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) => setProfile({...profile, location: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        {profile.location}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  {isEditing ? (
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.bio}</p>
                  )}
                </div>
              </div>

              {/* Professional Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Professional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                    <p className="text-gray-900">{profile.specialization}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                    <p className="text-gray-900">{profile.licenseNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                    <p className="text-gray-900">{profile.yearsExperience} years</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">University</label>
                    <p className="text-gray-900">{profile.university}</p>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-yellow-500" />
                  Achievements
                </h3>
                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <Award className="h-5 w-5 text-yellow-500 mt-0.5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{achievement.title}</h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{achievement.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Account Security */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-green-500" />
                  Account Security
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Password</h4>
                      <p className="text-sm text-gray-600">Last changed 3 months ago</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Change Password
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600">Add an extra layer of security</p>
                    </div>
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                      Enable
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Login Sessions</h4>
                      <p className="text-sm text-gray-600">Manage your active sessions</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View Sessions
                    </button>
                  </div>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Privacy Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Profile Visibility</h4>
                      <p className="text-sm text-gray-600">Who can see your profile</p>
                    </div>
                    <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                      <option>Everyone</option>
                      <option>Connections Only</option>
                      <option>Private</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Show Online Status</h4>
                      <p className="text-sm text-gray-600">Let others see when you're online</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Language & Region */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-blue-500" />
                  Language & Region
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                      <option>English (US)</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                      <option>Eastern Time (ET)</option>
                      <option>Central Time (CT)</option>
                      <option>Mountain Time (MT)</option>
                      <option>Pacific Time (PT)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h3>
              <div className="space-y-6">
                {[
                  { title: 'Email Notifications', items: [
                    'New messages', 'Course updates', 'Lab order status', 'Weekly digest'
                  ]},
                  { title: 'Push Notifications', items: [
                    'Direct messages', 'Mentions', 'Live events', 'Emergency alerts'
                  ]},
                  { title: 'Social Notifications', items: [
                    'New followers', 'Post likes', 'Comments', 'Shares'
                  ]}
                ].map((section, index) => (
                  <div key={index}>
                    <h4 className="text-md font-medium text-gray-900 mb-3">{section.title}</h4>
                    <div className="space-y-3">
                      {section.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{item}</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Earnings Tab */}
          {activeTab === 'earnings' && (
            <SellerDashboard />
          )}

          {/* Help Center Tab */}
          {activeTab === 'help' && (
            <div className="space-y-8">
              {/* Search */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="relative max-w-md mx-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for help articles..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                </div>
              </div>

              {/* FAQ Categories */}
              <div className="space-y-6">
                {faqCategories.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {category.questions.map((faq) => (
                        <div key={faq.id}>
                          <button
                            onClick={() => toggleFaq(faq.id)}
                            className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                          >
                            <span className="font-medium text-gray-900">{faq.question}</span>
                            {expandedFaq === faq.id ? (
                              <ChevronDown className="h-5 w-5 text-gray-500" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-gray-500" />
                            )}
                          </button>
                          {expandedFaq === faq.id && (
                            <div className="px-6 pb-4">
                              <p className="text-gray-600">{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Support Tab */}
          {activeTab === 'contact' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Submit a Support Ticket</h3>
                <form onSubmit={handleTicketSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                    <input
                      type="text"
                      required
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                      placeholder="Brief description of your issue"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                      <select
                        required
                        value={newTicket.category}
                        onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select category</option>
                        <option value="Technical">Technical Issue</option>
                        <option value="Billing">Billing & Payments</option>
                        <option value="Account">Account & Profile</option>
                        <option value="Education">Education & Courses</option>
                        <option value="Lab Services">Lab Services</option>
                        <option value="Shop">Shop & Orders</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priority *</label>
                      <select
                        required
                        value={newTicket.priority}
                        onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select priority</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <textarea
                      required
                      rows={6}
                      value={newTicket.description}
                      onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                      placeholder="Please provide detailed information about your issue..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                      <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Drag and drop files here, or click to browse
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Max file size: 10MB. Supported formats: PDF, JPG, PNG, DOC
                      </p>
                      <input type="file" multiple className="hidden" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Submit Ticket
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* My Tickets Tab */}
          {activeTab === 'tickets' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Support Tickets</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ticket ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subject
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Priority
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {supportTickets.map((ticket) => (
                        <tr key={ticket.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {ticket.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {ticket.subject}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {ticket.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`font-medium ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(ticket.status)}`}>
                              {ticket.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {ticket.created}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                            <button className="hover:text-blue-700">View Details</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;