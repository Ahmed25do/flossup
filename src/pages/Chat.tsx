import React, { useState } from 'react';
import { 
  Send, 
  Search, 
  MoreVertical, 
  Paperclip, 
  Image, 
  FileText, 
  Video,
  Phone,
  VideoIcon,
  Users,
  Plus
} from 'lucide-react';

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState('1');
  const [newMessage, setNewMessage] = useState('');

  const conversations = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      lastMessage: 'Thanks for sharing the X-ray images',
      time: '10:30 AM',
      unread: 2,
      avatar: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=100',
      online: true
    },
    {
      id: '2',
      name: 'Orthodontics Group',
      lastMessage: 'New case discussion started',
      time: '9:45 AM',
      unread: 5,
      avatar: 'https://images.pexels.com/photos/3779706/pexels-photo-3779706.jpeg?auto=compress&cs=tinysrgb&w=100',
      isGroup: true,
      online: false
    },
    {
      id: '3',
      name: 'Dr. Michael Chen',
      lastMessage: 'The conference was great!',
      time: 'Yesterday',
      unread: 0,
      avatar: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=100',
      online: false
    },
    {
      id: '4',
      name: 'Lab Technician - ProDental',
      lastMessage: 'Crown is ready for pickup',
      time: 'Yesterday',
      unread: 1,
      avatar: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=100',
      online: true
    }
  ];

  const messages = [
    {
      id: '1',
      sender: 'Dr. Sarah Johnson',
      content: 'Hi! I wanted to get your opinion on this case.',
      time: '10:15 AM',
      isOwn: false,
      avatar: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: '2',
      sender: 'You',
      content: 'Of course! What are the specifics?',
      time: '10:16 AM',
      isOwn: true
    },
    {
      id: '3',
      sender: 'Dr. Sarah Johnson',
      content: 'Patient has been experiencing sensitivity after the filling. Here are the X-rays.',
      time: '10:18 AM',
      isOwn: false,
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
      time: '10:25 AM',
      isOwn: true
    },
    {
      id: '5',
      sender: 'Dr. Sarah Johnson',
      content: 'Thanks for sharing the X-ray images',
      time: '10:30 AM',
      isOwn: false,
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[800px] flex">
        {/* Conversations List */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedChat(conversation.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedChat === conversation.id ? 'bg-blue-50 border-blue-200' : ''
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
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 border-2 border-white rounded-full"></div>
                    )}
                    {conversation.isGroup && (
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <Users className="h-2 w-2 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">{conversation.name}</p>
                      <p className="text-xs text-gray-500">{conversation.time}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                      {conversation.unread > 0 && (
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={selectedConversation.avatar}
                      alt={selectedConversation.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    {selectedConversation.online && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedConversation.name}</h3>
                    <p className="text-sm text-gray-500">
                      {selectedConversation.online ? 'Online' : 'Last seen yesterday'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <Phone className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <VideoIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex max-w-xs lg:max-w-md ${message.isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                      {!message.isOwn && (
                        <img
                          src={message.avatar}
                          alt={message.sender}
                          className="h-8 w-8 rounded-full object-cover mr-2 mt-1"
                        />
                      )}
                      <div>
                        <div className={`px-4 py-2 rounded-lg ${
                          message.isOwn 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          {message.attachments && (
                            <div className="mt-2 grid grid-cols-2 gap-2">
                              {message.attachments.map((attachment, index) => (
                                <div key={index} className="relative">
                                  {attachment.type === 'image' ? (
                                    <img
                                      src={attachment.url}
                                      alt={attachment.name}
                                      className="rounded-lg max-w-full h-32 object-cover cursor-pointer hover:opacity-90"
                                    />
                                  ) : (
                                    <div className="flex items-center p-2 bg-white bg-opacity-20 rounded-lg">
                                      <FileText className="h-4 w-4 mr-2" />
                                      <span className="text-xs truncate">{attachment.name}</span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <p className={`text-xs text-gray-500 mt-1 ${message.isOwn ? 'text-right' : 'text-left'}`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                  <button
                    type="button"
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <Image className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <Video className="h-5 w-5" />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Select a conversation</h3>
                <p className="text-gray-500">Choose from your existing conversations or start a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;