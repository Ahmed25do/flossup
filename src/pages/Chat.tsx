import React, { useState } from 'react';
import { 
  Send, 
  Search, 
  MoreVertical, 
  Paperclip, 
  Image, 
  Smile,
  Phone,
  VideoIcon,
  ArrowLeft,
  Check,
  CheckCheck,
  Mic,
  Plus,
  Camera
} from 'lucide-react';

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState('1');
  const [newMessage, setNewMessage] = useState('');
  const [showChatList, setShowChatList] = useState(true);

  const conversations = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      lastMessage: 'Thanks for sharing the X-ray images',
      time: '10:30',
      unread: 2,
      avatar: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=100',
      online: true,
      lastSeen: 'online'
    },
    {
      id: '2',
      name: 'Orthodontics Group',
      lastMessage: 'Dr. Mike: New case discussion started',
      time: '9:45',
      unread: 5,
      avatar: 'https://images.pexels.com/photos/3779706/pexels-photo-3779706.jpeg?auto=compress&cs=tinysrgb&w=100',
      isGroup: true,
      lastSeen: ''
    },
    {
      id: '3',
      name: 'Dr. Michael Chen',
      lastMessage: 'The conference was great!',
      time: 'Yesterday',
      unread: 0,
      avatar: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=100',
      online: false,
      lastSeen: 'last seen yesterday at 8:30 PM'
    },
    {
      id: '4',
      name: 'Lab Technician - ProDental',
      lastMessage: 'Crown is ready for pickup',
      time: 'Yesterday',
      unread: 1,
      avatar: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=100',
      online: true,
      lastSeen: 'online'
    },
    {
      id: '5',
      name: 'Dr. Emily Rodriguez',
      lastMessage: 'Patient follow-up scheduled',
      time: 'Monday',
      unread: 0,
      avatar: 'https://images.pexels.com/photos/4269697/pexels-photo-4269697.jpeg?auto=compress&cs=tinysrgb&w=100',
      online: false,
      lastSeen: 'last seen Monday at 2:15 PM'
    }
  ];

  const messages = [
    {
      id: '1',
      sender: 'Dr. Sarah Johnson',
      content: 'Hi! I wanted to get your opinion on this case.',
      time: '10:15',
      isOwn: false,
      status: 'delivered',
      avatar: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: '2',
      sender: 'You',
      content: 'Of course! What are the specifics?',
      time: '10:16',
      isOwn: true,
      status: 'read'
    },
    {
      id: '3',
      sender: 'Dr. Sarah Johnson',
      content: 'Patient has been experiencing sensitivity after the filling. Here are the X-rays.',
      time: '10:18',
      isOwn: false,
      status: 'delivered',
      avatar: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=100',
      attachments: [
        { type: 'image', name: 'xray-1.jpg', url: 'https://images.pexels.com/photos/3786249/pexels-photo-3786249.jpeg?auto=compress&cs=tinysrgb&w=300' },
        { type: 'image', name: 'xray-2.jpg', url: 'https://images.pexels.com/photos/3779709/pexels-photo-3779709.jpeg?auto=compress&cs=tinysrgb&w=300' }
      ]
    },
    {
      id: '4',
      sender: 'You',
      content: 'Looking at the X-rays, it appears there might be some inflammation. Have you considered prescribing anti-inflammatory medication?',
      time: '10:25',
      isOwn: true,
      status: 'read'
    },
    {
      id: '5',
      sender: 'Dr. Sarah Johnson',
      content: 'Thanks for sharing the X-ray images',
      time: '10:30',
      isOwn: false,
      status: 'delivered',
      avatar: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=100'
    }
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const selectedConversation = conversations.find(conv => conv.id === selectedChat);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Check className="h-4 w-4 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="h-4 w-4 text-gray-400" />;
      case 'read':
        return <CheckCheck className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[800px] flex overflow-hidden">
        {/* Chat List - WhatsApp Style */}
        <div className={`${showChatList ? 'w-full md:w-96' : 'hidden md:block md:w-96'} border-r border-gray-200 flex flex-col bg-white`}>
          {/* Header */}
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=100"
                  alt="Your avatar"
                  className="h-10 w-10 rounded-full object-cover"
                />
                <h2 className="text-lg font-semibold text-gray-900">Chats</h2>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200">
                  <Plus className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Search */}
            <div className="mt-3 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search or start new chat"
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => {
                  setSelectedChat(conversation.id);
                  setShowChatList(false);
                }}
                className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedChat === conversation.id ? 'bg-gray-100' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={conversation.avatar}
                      alt={conversation.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    {conversation.online && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{conversation.name}</h3>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-500">{conversation.time}</span>
                        {conversation.unread > 0 && (
                          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-green-500 rounded-full min-w-[20px]">
                            {conversation.unread}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 truncate mt-1">{conversation.lastMessage}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area - WhatsApp Style */}
        <div className={`${showChatList ? 'hidden md:flex' : 'flex'} flex-1 flex-col`}>
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button 
                    className="md:hidden p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200"
                    onClick={() => setShowChatList(true)}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <div className="relative">
                    <img
                      src={selectedConversation.avatar}
                      alt={selectedConversation.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    {selectedConversation.online && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{selectedConversation.name}</h3>
                    <p className="text-xs text-gray-500">
                      {selectedConversation.lastSeen}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200">
                    <VideoIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200">
                    <Phone className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Messages - WhatsApp Style */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex max-w-xs lg:max-w-md ${message.isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                        {!message.isOwn && (
                          <img
                            src={message.avatar}
                            alt={message.sender}
                            className="h-8 w-8 rounded-full object-cover mr-2 mt-1 flex-shrink-0"
                          />
                        )}
                        <div className={`relative px-4 py-2 rounded-lg shadow-sm ${
                          message.isOwn 
                            ? 'bg-green-500 text-white rounded-br-none' 
                            : 'bg-white text-gray-900 rounded-bl-none'
                        }`}>
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          
                          {message.attachments && (
                            <div className="mt-2 grid grid-cols-2 gap-2">
                              {message.attachments.map((attachment, index) => (
                                <div key={index} className="relative">
                                  <img
                                    src={attachment.url}
                                    alt={attachment.name}
                                    className="rounded-lg max-w-full h-32 object-cover cursor-pointer hover:opacity-90"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <div className={`flex items-center justify-end mt-1 space-x-1 ${
                            message.isOwn ? 'text-green-100' : 'text-gray-500'
                          }`}>
                            <span className="text-xs">{message.time}</span>
                            {message.isOwn && getStatusIcon(message.status)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message Input - WhatsApp Style */}
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                  <button
                    type="button"
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200"
                  >
                    <Smile className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200"
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message"
                      className="w-full px-4 py-2 pr-12 bg-white border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  {newMessage.trim() ? (
                    <button
                      type="submit"
                      className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200"
                    >
                      <Mic className="h-5 w-5" />
                    </button>
                  )}
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-64 h-64 mx-auto mb-8 opacity-20">
                  <svg viewBox="0 0 303 172" className="w-full h-full">
                    <defs>
                      <linearGradient id="a" x1="50%" x2="50%" y1="0%" y2="100%">
                        <stop offset="0%" stopColor="#f0f0f0"/>
                        <stop offset="100%" stopColor="#e0e0e0"/>
                      </linearGradient>
                    </defs>
                    <path fill="url(#a)" d="M229.221 63.123h57.795c11.045 0 20 8.954 20 20v69c0 11.045-8.955 20-20 20H75.016c-11.046 0-20-8.955-20-20v-69c0-11.046 8.954-20 20-20h115.205L229.221 63.123z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">FlossUp Chat</h3>
                <p className="text-gray-500 max-w-sm">
                  Send and receive messages with your dental colleagues. 
                  Select a chat to start messaging.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;