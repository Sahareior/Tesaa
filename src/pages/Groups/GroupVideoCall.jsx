import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../../Context/SocketContext';


const GroupVideoCall = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const localVideoRef = useRef(null);
  const {
    socket,
    stream,
    peers,
    isConnected,
    toggleVideo,
    toggleAudio,
    disconnectCall,
    callUser
  } = useSocket();

  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [activeSpeaker, setActiveSpeaker] = useState(null);
  const [layout, setLayout] = useState('grid');
  const [currentUsers, setCurrentUsers] = useState([]);

  // Set up local video stream
  useEffect(() => {
    if (stream && localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Handle user connections
    socket.on('user-connected', (userId) => {
      console.log('👤 User connected:', userId);
      setCurrentUsers(prev => [...prev, userId]);
      
      // Call the new user if we have our stream ready
      if (stream) {
        setTimeout(() => {
          callUser(userId);
        }, 1000);
      }
    });

    // Handle user disconnections
    socket.on('user-disconnected', (userId) => {
      console.log('👤 User disconnected:', userId);
      setCurrentUsers(prev => prev.filter(id => id !== userId));
    });

    // Get current users when joining
    socket.on('current-users', (users) => {
      console.log('👥 Current users:', users);
      setCurrentUsers(users);
      
      // Call all existing users
      users.forEach(userId => {
        if (stream) {
          callUser(userId);
        }
      });
    });

    // Handle chat messages
    socket.on('receive-message', (messageData) => {
      setMessages(prev => [...prev, {
        ...messageData,
        isYou: false
      }]);
    });

    return () => {
      socket.off('user-connected');
      socket.off('user-disconnected');
      socket.off('current-users');
      socket.off('receive-message');
    };
  }, [socket, stream, callUser]);

  // Update participants based on current users and peer connections
  useEffect(() => {
    const newParticipants = [
      {
        id: 'local',
        name: 'You',
        isYou: true,
        video: isVideoOn,
        audio: isAudioOn,
        role: 'Organizer',
        status: 'connected',
        avatarColor: 'bg-gradient-to-br from-blue-500 to-purple-600',
        stream: stream,
        isLocal: true
      },
      ...currentUsers.map((userId, index) => {
        const peer = peers[userId];
        const roles = ['Presenter', 'Co-organizer', 'Attendee'];
        const avatarColors = [
          'bg-gradient-to-br from-green-500 to-teal-600',
          'bg-gradient-to-br from-pink-500 to-rose-600',
          'bg-gradient-to-br from-orange-500 to-red-600',
          'bg-gradient-to-br from-purple-500 to-indigo-600',
          'bg-gradient-to-br from-yellow-500 to-amber-600'
        ];

        return {
          id: userId,
          name: `User ${userId}`,
          isYou: false,
          video: !!peer?.stream,
          audio: true, // You might want to track this separately
          role: roles[index % roles.length],
          status: peer?.stream ? 'connected' : 'connecting',
          avatarColor: avatarColors[index % avatarColors.length],
          stream: peer?.stream,
          isLocal: false
        };
      })
    ];

    setParticipants(newParticipants);
  }, [currentUsers, peers, stream, isVideoOn, isAudioOn]);

  const handleToggleVideo = () => {
    const newState = !isVideoOn;
    setIsVideoOn(newState);
    toggleVideo(newState);
  };

  const handleToggleAudio = () => {
    const newState = !isAudioOn;
    setIsAudioOn(newState);
    toggleAudio(newState);
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        // Here you would replace the video track with screen share
        console.log('Screen sharing started');
      } else {
        // Stop screen sharing and revert to camera
        console.log('Screen sharing stopped');
      }
      setIsScreenSharing(!isScreenSharing);
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };

  const leaveCall = () => {
    disconnectCall();
    navigate('/groups');
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socket) {
      const messageData = {
        id: Date.now().toString(),
        text: message,
        sender: 'You',
        time: new Date().toLocaleTimeString(),
        userId: 'local'
      };

      // Send message via socket
      socket.emit('send-message', messageData);

      // Add to local messages
      setMessages(prev => [...prev, { ...messageData, isYou: true }]);
      setMessage('');
    }
  };

  // Filter participants for different layouts
  const getDisplayParticipants = () => {
    if (layout === 'speaker' && activeSpeaker) {
      const speaker = participants.find(p => p.id === activeSpeaker);
      const others = participants.filter(p => p.id !== activeSpeaker && !p.isYou);
      return [speaker, ...others.slice(0, 3)];
    }
    return participants;
  };

  const ParticipantVideo = ({ participant, isLarge = false }) => {
    const videoRef = useRef(null);

    useEffect(() => {
      if (videoRef.current && participant.stream) {
        videoRef.current.srcObject = participant.stream;
      }
    }, [participant.stream]);

    return (
      <div
        className={`
          relative rounded-2xl overflow-hidden transition-all duration-300
          ${isLarge ? 'col-span-2 row-span-2' : ''}
          ${activeSpeaker === participant.id ? 'ring-4 ring-blue-400 ring-opacity-80' : 'ring-2 ring-gray-600'}
          ${participant.status === 'connecting' ? 'opacity-60' : 'opacity-100'}
          bg-gradient-to-br from-gray-800 to-gray-900
          transform hover:scale-105 hover:shadow-2xl
        `}
      >
        {/* Video/Avatar Container */}
        <div className="w-full h-full flex items-center justify-center">
          {participant.video && participant.stream ? (
            <video
              ref={participant.isLocal ? localVideoRef : videoRef}
              autoPlay
              muted={participant.isLocal}
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-white text-center">
                <div className={`w-20 h-20 ${participant.avatarColor} rounded-full flex items-center justify-center mx-auto mb-3 shadow-2xl`}>
                  <span className="text-2xl font-bold text-white">
                    {participant.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <p className="text-lg font-semibold">{participant.name}</p>
                {participant.role !== 'Attendee' && (
                  <p className="text-sm text-gray-300 mt-1">{participant.role}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Participant Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-white font-medium text-sm">
                {participant.name}
              </span>
              {participant.isYou && (
                <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                  You
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {!participant.audio && (
                <div className="bg-red-500 p-1 rounded-full">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
              )}
              {participant.status === 'connecting' && (
                <div className="bg-yellow-500 p-1 rounded-full animate-pulse">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active Speaker Indicator */}
        {activeSpeaker === participant.id && (
          <div className="absolute top-3 left-3 flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-xs font-medium">Speaking</span>
          </div>
        )}
      </div>
    );
  };

  if (!isConnected) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Connecting to server...</h2>
          <p className="text-gray-400">Please check if the server is running</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-4 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/groups')}
            className="p-2 hover:bg-gray-700 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Team Meeting
            </h1>
            <p className="text-gray-400 text-sm">Room #{groupId} • {participants.length} members</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          {/* Layout Controls */}
          <div className="flex items-center space-x-2 bg-gray-700 rounded-xl p-1">
            <button
              onClick={() => setLayout('grid')}
              className={`p-2 rounded-lg transition-all ${
                layout === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setLayout('speaker')}
              className={`p-2 rounded-lg transition-all ${
                layout === 'speaker' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
          </div>

          <div className="flex items-center space-x-3 text-sm">
            <div className="flex items-center bg-gray-700 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>{participants.length} online</span>
            </div>
            <div className="text-gray-300 bg-gray-700 px-3 py-1 rounded-full">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Grid */}
        <div className={`flex-1 p-6 ${chatOpen ? 'lg:w-3/4' : 'w-full'}`}>
          <div className={`
            grid gap-4 h-full
            ${layout === 'speaker' 
              ? 'grid-cols-3 grid-rows-2' 
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            }
          `}>
            {getDisplayParticipants().map((participant, index) => (
              <ParticipantVideo
                key={participant.id}
                participant={participant}
                isLarge={layout === 'speaker' && index === 0}
              />
            ))}
          </div>
        </div>

        {/* Enhanced Chat Sidebar */}
        {chatOpen && (
          <div className="w-full lg:w-1/4 bg-gray-800 border-l border-gray-700 flex flex-col shadow-2xl">
            <div className="p-4 border-b border-gray-700 bg-gray-900">
              <div className="flex justify-between items-center">
                <h3 className="text-white font-bold text-lg">Team Chat</h3>
                <button
                  onClick={() => setChatOpen(false)}
                  className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p>No messages yet</p>
                  <p className="text-sm">Start a conversation with your team</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-2xl transition-all duration-200 ${
                      msg.isYou
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 ml-8'
                        : 'bg-gray-700 mr-8'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`font-medium text-sm ${msg.isYou ? 'text-white' : 'text-blue-400'}`}>
                        {msg.sender}
                      </span>
                      <span className="text-gray-300 text-xs">{msg.time}</span>
                    </div>
                    <p className="text-white text-sm">{msg.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Enhanced Message Input */}
            <div className="p-4 border-t border-gray-700 bg-gray-900">
              <form onSubmit={sendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message to the team..."
                  className="flex-1 bg-gray-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 transition-all"
                />
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Controls */}
      <div className="bg-gray-800 p-6 flex justify-center items-center space-x-4 border-t border-gray-700">
        <button
          onClick={handleToggleAudio}
          className={`
            p-4 rounded-2xl transition-all duration-200 transform hover:scale-110
            ${isAudioOn 
              ? 'bg-gray-700 hover:bg-gray-600 text-white' 
              : 'bg-red-600 hover:bg-red-500 text-white shadow-lg'
            }
          `}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isAudioOn ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            )}
          </svg>
        </button>

        <button
          onClick={handleToggleVideo}
          className={`
            p-4 rounded-2xl transition-all duration-200 transform hover:scale-110
            ${isVideoOn 
              ? 'bg-gray-700 hover:bg-gray-600 text-white' 
              : 'bg-red-600 hover:bg-red-500 text-white shadow-lg'
            }
          `}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isVideoOn ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            )}
          </svg>
        </button>

        <button
          onClick={toggleScreenShare}
          className={`
            p-4 rounded-2xl transition-all duration-200 transform hover:scale-110
            ${isScreenSharing 
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg' 
              : 'bg-gray-700 hover:bg-gray-600 text-white'
            }
          `}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </button>

        <button
          onClick={() => setChatOpen(!chatOpen)}
          className={`
            p-4 rounded-2xl transition-all duration-200 transform hover:scale-110
            ${chatOpen 
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg' 
              : 'bg-gray-700 hover:bg-gray-600 text-white'
            }
          `}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>

        <div className="w-px h-8 bg-gray-600"></div>

        <button
          onClick={leaveCall}
          className="p-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-2xl transition-all duration-200 transform hover:scale-110 shadow-lg font-semibold flex items-center space-x-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>Leave</span>
        </button>
      </div>
    </div>
  );
};

export default GroupVideoCall;