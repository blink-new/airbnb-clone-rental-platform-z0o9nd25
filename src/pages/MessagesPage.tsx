import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send, Search, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { blink } from '@/blink/client'

interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar: string
  content: string
  timestamp: string
  isRead: boolean
}

interface Conversation {
  id: string
  participantId: string
  participantName: string
  participantAvatar: string
  propertyTitle: string
  propertyImage: string
  lastMessage: Message
  unreadCount: number
  messages: Message[]
}

// Mock conversations data
const mockConversations: Conversation[] = [
  {
    id: '1',
    participantId: 'host1',
    participantName: 'Sarah',
    participantAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    propertyTitle: 'Cozy Beachfront Villa',
    propertyImage: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=100&h=100&fit=crop',
    unreadCount: 2,
    lastMessage: {
      id: 'm3',
      senderId: 'host1',
      senderName: 'Sarah',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      content: 'Great! Looking forward to hosting you. The check-in instructions will be sent closer to your arrival date.',
      timestamp: '2024-07-16T14:30:00Z',
      isRead: false
    },
    messages: [
      {
        id: 'm1',
        senderId: 'user1',
        senderName: 'You',
        senderAvatar: '',
        content: 'Hi Sarah! I have a booking for next month and wanted to ask about the parking situation.',
        timestamp: '2024-07-16T10:00:00Z',
        isRead: true
      },
      {
        id: 'm2',
        senderId: 'host1',
        senderName: 'Sarah',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        content: 'Hello! Thanks for reaching out. There\'s free parking available right in front of the villa. No need to worry about finding a spot!',
        timestamp: '2024-07-16T12:15:00Z',
        isRead: true
      },
      {
        id: 'm3',
        senderId: 'host1',
        senderName: 'Sarah',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        content: 'Great! Looking forward to hosting you. The check-in instructions will be sent closer to your arrival date.',
        timestamp: '2024-07-16T14:30:00Z',
        isRead: false
      }
    ]
  },
  {
    id: '2',
    participantId: 'host2',
    participantName: 'Michael',
    participantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    propertyTitle: 'Modern City Apartment',
    propertyImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=100&h=100&fit=crop',
    unreadCount: 0,
    lastMessage: {
      id: 'm5',
      senderId: 'user1',
      senderName: 'You',
      senderAvatar: '',
      content: 'Thank you for the great stay! Everything was perfect.',
      timestamp: '2024-07-10T16:45:00Z',
      isRead: true
    },
    messages: [
      {
        id: 'm4',
        senderId: 'host2',
        senderName: 'Michael',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        content: 'Hope you enjoyed your stay! Please don\'t forget to leave a review.',
        timestamp: '2024-07-10T09:00:00Z',
        isRead: true
      },
      {
        id: 'm5',
        senderId: 'user1',
        senderName: 'You',
        senderAvatar: '',
        content: 'Thank you for the great stay! Everything was perfect.',
        timestamp: '2024-07-10T16:45:00Z',
        isRead: true
      }
    ]
  }
]

export function MessagesPage() {
  const [user, setUser] = useState(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      if (!state.user) {
        navigate('/')
      }
    })
    return unsubscribe
  }, [navigate])

  useEffect(() => {
    const loadConversations = async () => {
      setLoading(true)
      try {
        // In a real app, fetch conversations from database
        await new Promise(resolve => setTimeout(resolve, 500))
        setConversations(mockConversations)
        if (mockConversations.length > 0) {
          setSelectedConversation(mockConversations[0])
        }
      } catch (error) {
        console.error('Error loading conversations:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadConversations()
    }
  }, [user])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message: Message = {
      id: `m${Date.now()}`,
      senderId: 'user1',
      senderName: 'You',
      senderAvatar: '',
      content: newMessage,
      timestamp: new Date().toISOString(),
      isRead: true
    }

    // Update the conversation with the new message
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation.id 
        ? { 
            ...conv, 
            messages: [...conv.messages, message],
            lastMessage: message
          }
        : conv
    ))

    // Update selected conversation
    setSelectedConversation(prev => prev ? {
      ...prev,
      messages: [...prev.messages, message],
      lastMessage: message
    } : null)

    setNewMessage('')
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    }
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border h-[600px] flex">
            <div className="w-1/3 border-r p-4 space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex-1 p-4">
              <div className="h-full bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">Stay in touch with your hosts and guests</p>
        </div>

        {conversations.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border h-[600px] flex">
            {/* Conversations List */}
            <div className="w-1/3 border-r">
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search messages" 
                    className="pl-10"
                  />
                </div>
              </div>
              
              <ScrollArea className="h-[calc(600px-80px)]">
                <div className="p-2">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedConversation?.id === conversation.id ? 'bg-blue-50 border border-blue-200' : ''
                      }`}
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={conversation.participantAvatar} />
                          <AvatarFallback>{conversation.participantName[0]}</AvatarFallback>
                        </Avatar>
                        {conversation.unreadCount > 0 && (
                          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {conversation.unreadCount}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900 truncate">
                            {conversation.participantName}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {formatTime(conversation.lastMessage.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.propertyTitle}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {conversation.lastMessage.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={selectedConversation.participantAvatar} />
                        <AvatarFallback>{selectedConversation.participantName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {selectedConversation.participantName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {selectedConversation.propertyTitle}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {selectedConversation.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.senderId === 'user1' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderId === 'user1'
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.senderId === 'user1' ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="p-4 border-t">
                    <div className="flex space-x-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-gray-500">Select a conversation to start messaging</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                No messages yet
              </h3>
              <p className="text-gray-600 mb-8">
                When you contact a host or send a reservation request, you'll see your messages here.
              </p>
              <Button 
                onClick={() => navigate('/')}
                className="bg-primary hover:bg-primary/90"
              >
                Start exploring
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}