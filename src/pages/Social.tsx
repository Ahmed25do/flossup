import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share, 
  MoreHorizontal, 
  Image, 
  Video, 
  FileText,
  Camera,
  Smile,
  TrendingUp,
  Users,
  Plus
} from 'lucide-react';

const Social = () => {
  const [newPost, setNewPost] = useState('');
  const [likedPosts, setLikedPosts] = useState<string[]>([]);

  const toggleLike = (postId: string) => {
    setLikedPosts(prev =>
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const posts = [
    {
      id: '1',
      author: 'Dr. Sarah Johnson',
      authorAvatar: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=100',
      title: 'Endodontist',
      timeAgo: '2 hours ago',
      content: 'Just completed a challenging root canal case. The patient had severe curvature in the MB2 canal. Used the latest rotary instruments and the result was fantastic! 🦷✨',
      images: [
        'https://images.pexels.com/photos/3786249/pexels-photo-3786249.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/3779709/pexels-photo-3779709.jpeg?auto=compress&cs=tinysrgb&w=600'
      ],
      likes: 47,
      comments: 12,
      shares: 5,
      isSponsored: false
    },
    {
      id: '2',
      author: 'DentalTech Pro',
      authorAvatar: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=100',
      title: 'Sponsored',
      timeAgo: '4 hours ago',
      content: '🔥 NEW: Revolutionary Digital Impression Scanner - 50% faster than traditional methods. Limited time offer for dental professionals!',
      images: [
        'https://images.pexels.com/photos/263391/pexels-photo-263391.jpeg?auto=compress&cs=tinysrgb&w=600'
      ],
      likes: 89,
      comments: 23,
      shares: 15,
      isSponsored: true,
      sponsoredLink: 'Learn More'
    },
    {
      id: '3',
      author: 'Dr. Michael Chen',
      authorAvatar: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=100',
      title: 'Orthodontist',
      timeAgo: '6 hours ago',
      content: 'Incredible transformation with Invisalign! This patient was so happy with the results. Clear aligners continue to amaze me with their effectiveness.',
      video: 'https://images.pexels.com/photos/3779706/pexels-photo-3779706.jpeg?auto=compress&cs=tinysrgb&w=600',
      likes: 156,
      comments: 34,
      shares: 28,
      isSponsored: false
    },
    {
      id: '4',
      author: 'Dr. Emily Rodriguez',
      authorAvatar: 'https://images.pexels.com/photos/4269697/pexels-photo-4269697.jpeg?auto=compress&cs=tinysrgb&w=100',
      title: 'Pediatric Dentist',
      timeAgo: '1 day ago',
      content: 'Tips for making dental visits fun for kids:\n\n1. Use positive language\n2. Show them the tools first\n3. Let them be the "helper"\n4. Reward good behavior\n\nWhat are your favorite techniques?',
      likes: 203,
      comments: 45,
      shares: 67,
      isSponsored: false
    }
  ];

  const trendingTopics = [
    { tag: '#DigitalDentistry', posts: '2.3k posts' },
    { tag: '#ImplantSurgery', posts: '1.8k posts' },
    { tag: '#CosmeticDentistry', posts: '3.1k posts' },
    { tag: '#DentalEducation', posts: '1.2k posts' },
    { tag: '#PatientCare', posts: '2.7k posts' }
  ];

  const suggestedConnections = [
    {
      name: 'Dr. Alex Thompson',
      title: 'Oral Surgeon',
      avatar: 'https://images.pexels.com/photos/3845623/pexels-photo-3845623.jpeg?auto=compress&cs=tinysrgb&w=100',
      mutualConnections: 15
    },
    {
      name: 'Dr. Lisa Wang',
      title: 'Periodontist',
      avatar: 'https://images.pexels.com/photos/3779709/pexels-photo-3779709.jpeg?auto=compress&cs=tinysrgb&w=100',
      mutualConnections: 8
    }
  ];

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPost.trim()) {
      console.log('Creating post:', newPost);
      setNewPost('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Trending Topics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-orange-500" />
              Trending
            </h3>
            <div className="space-y-3">
              {trendingTopics.map((topic, index) => (
                <div key={index} className="cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <p className="text-blue-600 font-medium text-sm">{topic.tag}</p>
                  <p className="text-gray-500 text-xs">{topic.posts}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Connections */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-500" />
              Connect
            </h3>
            <div className="space-y-4">
              {suggestedConnections.map((person, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <img
                    src={person.avatar}
                    alt={person.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{person.name}</p>
                    <p className="text-xs text-gray-500">{person.title}</p>
                    <p className="text-xs text-gray-400">{person.mutualConnections} mutual</p>
                  </div>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors">
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Post */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleCreatePost}>
              <div className="flex space-x-4">
                <img
                  src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=100"
                  alt="Your avatar"
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Share your dental insights, cases, or questions..."
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-4">
                      <button
                        type="button"
                        className="flex items-center text-gray-500 hover:text-blue-500 transition-colors"
                      >
                        <Image className="h-5 w-5 mr-1" />
                        Photo
                      </button>
                      <button
                        type="button"
                        className="flex items-center text-gray-500 hover:text-blue-500 transition-colors"
                      >
                        <Video className="h-5 w-5 mr-1" />
                        Video
                      </button>
                      <button
                        type="button"
                        className="flex items-center text-gray-500 hover:text-blue-500 transition-colors"
                      >
                        <FileText className="h-5 w-5 mr-1" />
                        Article
                      </button>
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      disabled={!newPost.trim()}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Posts Feed */}
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Post Header */}
                <div className="p-6 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={post.authorAvatar}
                        alt={post.author}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold text-gray-900">{post.author}</h3>
                          {post.isSponsored && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              Sponsored
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{post.title} • {post.timeAgo}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Post Content */}
                <div className="px-6 pb-3">
                  <p className="text-gray-800 whitespace-pre-line">{post.content}</p>
                </div>

                {/* Post Media */}
                {post.images && post.images.length > 0 && (
                  <div className={`px-6 pb-3 grid gap-2 ${
                    post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
                  }`}>
                    {post.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Post image ${index + 1}`}
                        className="rounded-lg object-cover w-full h-64 cursor-pointer hover:opacity-95"
                      />
                    ))}
                  </div>
                )}

                {post.video && (
                  <div className="px-6 pb-3">
                    <div className="relative rounded-lg overflow-hidden bg-gray-100 h-64 flex items-center justify-center cursor-pointer hover:bg-gray-200">
                      <img
                        src={post.video}
                        alt="Video thumbnail"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black bg-opacity-50 rounded-full p-4">
                          <Video className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Post Actions */}
                <div className="px-6 py-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>{post.likes} likes</span>
                    <div className="flex space-x-4">
                      <span>{post.comments} comments</span>
                      <span>{post.shares} shares</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-around">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        likedPosts.includes(post.id)
                          ? 'text-red-600 bg-red-50'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <Heart 
                        className={`h-5 w-5 ${likedPosts.includes(post.id) ? 'fill-current' : ''}`} 
                      />
                      <span>Like</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
                      <MessageCircle className="h-5 w-5" />
                      <span>Comment</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
                      <Share className="h-5 w-5" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>

                {/* Sponsored CTA */}
                {post.isSponsored && post.sponsoredLink && (
                  <div className="px-6 pb-4">
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                      {post.sponsoredLink}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Activity</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Posts this week</span>
                <span className="text-lg font-semibold text-blue-600">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Profile views</span>
                <span className="text-lg font-semibold text-green-600">847</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Connections</span>
                <span className="text-lg font-semibold text-purple-600">1,234</span>
              </div>
            </div>
          </div>

          {/* Sponsored Ad */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border border-blue-200 p-6">
            <div className="text-xs text-blue-600 mb-2">Sponsored</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced Dental Conference 2024</h3>
            <p className="text-sm text-gray-600 mb-4">Join 1000+ dental professionals for the latest in dental innovation.</p>
            <img
              src="https://images.pexels.com/photos/263391/pexels-photo-263391.jpeg?auto=compress&cs=tinysrgb&w=300"
              alt="Conference"
              className="w-full h-32 object-cover rounded-lg mb-4"
            />
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Register Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Social;