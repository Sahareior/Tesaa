import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';
import Peer from 'peerjs';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children, userId }) => {
  const [socket, setSocket] = useState(null);
  const [peer, setPeer] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [stream, setStream] = useState(null);
  const [peers, setPeers] = useState({});
  const [mediaError, setMediaError] = useState(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    const newSocket = io('http://localhost:3001', {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('✅ Connected to Socket.IO server');
      setIsConnected(true);
      setMediaError(null);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from Socket.IO server');
      setIsConnected(false);
    });

    newSocket.on('error', (error) => {
      console.error('❌ Socket error:', error);
      setMediaError('Connection error: ' + error.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Call a user - using useCallback to prevent infinite re-renders
  const callUser = useCallback((userId) => {
    if (!peer || !stream) return;

    console.log('📞 Calling user:', userId);
    const call = peer.call(userId, stream);
    
    call.on('stream', (remoteStream) => {
      setPeers(prev => ({
        ...prev,
        [userId]: { stream: remoteStream, call }
      }));
    });

    call.on('close', () => {
      setPeers(prev => {
        const newPeers = { ...prev };
        delete newPeers[userId];
        return newPeers;
      });
    });

    call.on('error', (error) => {
      console.error('❌ Call error:', error);
    });
  }, [peer, stream]);

  // Initialize user media with better error handling
  const initializeMedia = async (options = { video: true, audio: true }) => {
    try {
      setMediaError(null);
      
      // Check if browser supports media devices
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support camera/microphone access');
      }

      // Request permissions with specific constraints
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: options.video ? {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        } : false,
        audio: options.audio ? {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } : false
      });

      setStream(userStream);
      return userStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      
      let errorMessage = 'Failed to access camera/microphone. ';
      
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Please allow camera and microphone permissions in your browser.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No camera or microphone found. Please check your devices.';
      } else if (error.name === 'NotSupportedError') {
        errorMessage += 'Your browser does not support video calling.';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage += 'Cannot find camera with the required specifications.';
      } else {
        errorMessage += error.message;
      }
      
      setMediaError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Toggle video
  const toggleVideo = (enabled) => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = enabled;
        return true;
      }
    }
    return false;
  };

  // Toggle audio
  const toggleAudio = (enabled) => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = enabled;
        return true;
      }
    }
    return false;
  };

  // Disconnect from call
  const disconnectCall = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    Object.values(peers).forEach(({ call }) => {
      call?.close();
    });
    setPeers({});
  };

  // Initialize PeerJS and handle room events
  useEffect(() => {
    if (!socket || !userId) return;

    // Initialize PeerJS with better error handling
    const newPeer = new Peer(userId, {
      host: 'localhost',
      port: 3002,
      path: '/peerjs',
      debug: 3,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      }
    });

    newPeer.on('open', (id) => {
      console.log('✅ PeerJS connected with ID:', id);
    });

    newPeer.on('error', (error) => {
      console.error('❌ PeerJS error:', error);
      setMediaError('Peer connection error: ' + error.message);
    });

    // Handle incoming calls
    newPeer.on('call', (call) => {
      if (stream) {
        call.answer(stream);
        console.log('📞 Answering incoming call from:', call.peer);
        
        call.on('stream', (remoteStream) => {
          setPeers(prev => ({
            ...prev,
            [call.peer]: { stream: remoteStream, call }
          }));
        });

        call.on('error', (error) => {
          console.error('❌ Call error:', error);
        });
      }
    });

    setPeer(newPeer);

    return () => {
      if (newPeer && !newPeer.destroyed) {
        newPeer.destroy();
      }
    };
  }, [socket, userId, stream]);

  // Listen for room events
  useEffect(() => {
    if (!socket) return;

    const handleRoomJoined = (data) => {
      console.log('✅ Joined room:', data.roomId);
      // You can store current room info in state if needed
    };

    const handleUserJoined = (data) => {
      console.log('👤 User joined:', data.userId);
      // Call the new user if we have stream
      if (stream) {
        callUser(data.userId);
      }
    };

    const handleUserLeft = (data) => {
      console.log('👤 User left:', data.userId);
      // Remove peer connection
      if (peers[data.userId]) {
        peers[data.userId].call.close();
        setPeers(prev => {
          const newPeers = { ...prev };
          delete newPeers[data.userId];
          return newPeers;
        });
      }
    };

    const handleJoinError = (error) => {
      console.error('❌ Join error:', error);
      setMediaError(error.message);
    };

    // Register event listeners
    socket.on('room-joined', handleRoomJoined);
    socket.on('user-joined', handleUserJoined);
    socket.on('user-left', handleUserLeft);
    socket.on('join-error', handleJoinError);

    // Cleanup
    return () => {
      socket.off('room-joined', handleRoomJoined);
      socket.off('user-joined', handleUserJoined);
      socket.off('user-left', handleUserLeft);
      socket.off('join-error', handleJoinError);
    };
  }, [socket, stream, peers, callUser]);

  const value = {
    socket,
    peer,
    isConnected,
    stream,
    peers,
    mediaError,
    initializeMedia,
    callUser,
    toggleVideo,
    
    toggleAudio,
    disconnectCall
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};