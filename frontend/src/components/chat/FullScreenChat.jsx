import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Send, User2, Briefcase, Loader2, Check, ChevronLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import FilePreview from './FilePreview';
import { randomGifs } from './randomGifs';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const FullScreenChat = ({
  open,
  onClose,
  candidateId,
  recruiterId,
  userId,
  userRole,
  otherUser,
}) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [file, setFile] = useState(null);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const socketRef = useRef(null);
  const chatEndRef = useRef(null);
  const roomId = [candidateId, recruiterId].sort().join('_');

  useEffect(() => {
    if (!open) return;
    socketRef.current = io(SOCKET_URL, { withCredentials: true });

    socketRef.current.emit('joinRoom', { roomId });

    // Fetch chat history from backend
    fetch(`/api/chat/${roomId}`, {
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch chat history');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data.messages)) {
          setMessages(data.messages.map(msg => ({
            ...msg,
            text: msg.message // unify field for frontend
          })));
        } else {
          setMessages([]);
        }
      })
      .catch((err) => {
        setMessages([]);
        console.error('Chat history fetch error:', err);
      });

    socketRef.current.on('receiveMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketRef.current.on('typing', ({ senderId }) => {
      if (senderId !== userId) setOtherTyping(true);
    });

    socketRef.current.on('stopTyping', ({ senderId }) => {
      if (senderId !== userId) setOtherTyping(false);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId, open, userId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, otherTyping]);

  useEffect(() => {
    const match = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(match.matches);
    const handler = (e) => setIsDark(e.matches);
    match.addEventListener('change', handler);
    return () => match.removeEventListener('change', handler);
  }, []);

  const sendMessage = async () => {
    if ((!input.trim() && !file) || uploading) return;
    setUploading(true);
    setUploadError('');
    // Always use 'candidate' for students to match backend enum
    let normalizedRole = userRole === 'student' ? 'candidate' : userRole;
    let messagePayload = {
      message: input,
      senderId: userId,
      senderRole: normalizedRole,
      fileUrl: file && file.url ? file.url : '',
      fileType: file && file.url ? (file.fileType || file.type) : '',
      fileName: file && file.url ? (file.fileName || file.name) : '',
      gif: ''
    };
    try {
      const res = await fetch(`/api/chat/${roomId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(messagePayload)
      });
      const data = await res.json();
      if (!res.ok || !data.message) throw new Error(data.error || 'Failed to send message');
      // Add the saved message to UI
      setMessages((prev) => [...prev, {
        ...data.message,
        text: data.message.message // unify field for frontend
      }]);
      // Emit via socket for real-time update
      socketRef.current.emit('sendMessage', { roomId, message: {
        ...data.message,
        text: data.message.message
      }});
      setInput('');
      setFile(null);
      setShowEmoji(false);
      socketRef.current.emit('stopTyping', { roomId, senderId: userId });
    } catch (err) {
      setUploadError(err.message || 'Failed to send message');
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setIsTyping(true);
    socketRef.current.emit('typing', { roomId, senderId: userId });
    if (e.target.value === '') {
      setIsTyping(false);
      socketRef.current.emit('stopTyping', { roomId, senderId: userId });
    }
  };

  const handleEmojiSelect = (emoji) => {
    setInput((prev) => prev + emoji.native);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  const handleFileChange = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(null);
    setUploadError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selected);
      const res = await fetch('/api/chat/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setFile({ ...selected, url: data.url, fileType: data.type, fileName: data.name });
    } catch (err) {
      setUploadError(err.message || 'File upload failed');
      setFile(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => setFile(null);

  const handleGifSelect = async (gifUrl) => {
    setUploading(true);
    setUploadError('');
    // Always use 'candidate' for students to match backend enum
    let normalizedRole = userRole === 'student' ? 'candidate' : userRole;
    let messagePayload = {
      message: '',
      senderId: userId,
      senderRole: normalizedRole,
      fileUrl: '',
      fileType: '',
      fileName: '',
      gif: gifUrl
    };
    try {
      const res = await fetch(`/api/chat/${roomId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(messagePayload)
      });
      const data = await res.json();
      if (!res.ok || !data.message) throw new Error(data.error || 'Failed to send GIF');
      setMessages((prev) => [...prev, {
        ...data.message,
        text: data.message.message
      }]);
      socketRef.current.emit('sendMessage', { roomId, message: {
        ...data.message,
        text: data.message.message
      }});
      setShowGifPicker(false);
    } catch (err) {
      setUploadError(err.message || 'Failed to send GIF');
    } finally {
      setUploading(false);
    }
  };

  // Animation variants
  const bubbleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05 }
    }),
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="fixed inset-0 z-50 bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white/80 dark:bg-gray-900/80 shadow-lg">
          <Button variant="ghost" onClick={onClose} className="rounded-full">
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={otherUser?.avatar || '/default-avatar.png'} />
              <AvatarFallback>
                {otherUser?.name?.[0] || <User2 />}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold flex items-center gap-2">
                {otherUser?.name}
                <span className="premium-badge ml-2">Premium</span>
              </div>
              <div className="text-xs text-gray-500">
                {otherUser?.role === 'recruiter' ? <Briefcase className="inline w-4 h-4 mr-1" /> : <User2 className="inline w-4 h-4 mr-1" />}
                {otherUser?.role === 'recruiter' ? 'Recruiter' : 'Candidate'}
              </div>
            </div>
          </div>
          <div />
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2 bg-white dark:bg-gray-900 transition-colors duration-300">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={bubbleVariants}
              className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-md flex items-end gap-2
                ${msg.senderId === userId
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white self-end premium-card'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 self-start premium-card'
                }`}
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={msg.avatar || '/default-avatar.png'} />
                  <AvatarFallback>
                    {msg.name?.[0] || <User2 />}
                  </AvatarFallback>
                </Avatar>
                <div>
                  {msg.gif && <img src={msg.gif} alt="gif" className="w-32 h-32 rounded mb-1" />}
                  {msg.fileUrl && (
                    msg.fileType.startsWith('image/') ? (
                      <img src={msg.fileUrl} alt={msg.fileName} className="w-32 h-32 rounded mb-1" />
                    ) : (
                      <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="block text-blue-500 underline mb-1">{msg.fileName}</a>
                    )
                  )}
                  <div className="text-sm">{msg.text}</div>
                  <div className="text-[10px] opacity-60 text-right">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {msg.senderId === userId && <Check className="inline w-3 h-3 ml-1 text-green-300" />}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {otherTyping && (
            <div className="flex items-center gap-2 text-gray-500 text-xs pl-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Typing...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-white/80 dark:bg-gray-900/80 flex items-center gap-2 border-t border-gray-200 dark:border-gray-700 relative">
          <Button
            variant="ghost"
            className="rounded-full"
            onClick={() => setShowEmoji((v) => !v)}
          >
            <Smile className="w-6 h-6 text-yellow-500" />
          </Button>
          <Button
            variant="ghost"
            className="rounded-full"
            onClick={() => setShowGifPicker((v) => !v)}
            title="Send GIF"
          >
            <img src="https://img.icons8.com/color/48/000000/gif.png" alt="GIF" className="w-6 h-6" />
          </Button>
          <label className="cursor-pointer">
            <input type="file" className="hidden" onChange={handleFileChange} />
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 002.828 2.828L18 9.828M7 7h.01M7 7a4 4 0 015.657 0l6.586 6.586a4 4 0 01-5.657 5.657L7 13.414a4 4 0 010-5.657z" /></svg>
          </label>
          {showEmoji && (
            <div className="absolute bottom-20 left-4 z-50">
              <Picker data={data} onEmojiSelect={handleEmojiSelect} theme={isDark ? 'dark' : 'light'} />
            </div>
          )}
          {showGifPicker && (
            <div className="absolute bottom-20 left-20 z-50 bg-white dark:bg-gray-800 p-2 rounded shadow-lg max-w-xs flex flex-wrap gap-2">
              {randomGifs.map((gif, idx) => (
                <img
                  key={idx}
                  src={gif}
                  alt="gif"
                  className="w-16 h-16 cursor-pointer rounded hover:scale-110 transition"
                  onClick={() => handleGifSelect(gif)}
                />
              ))}
            </div>
          )}
          <input
            className="flex-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-700 transition"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... 😊"
            autoFocus
          />
          {uploadError && <div className="text-xs text-red-500 mb-2">{uploadError}</div>}
          <Button
            onClick={sendMessage}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full px-4 py-2"
            disabled={uploading}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        {file && <FilePreview file={file} onRemove={handleRemoveFile} />}
      </motion.div>
    </AnimatePresence>
  );
};

export default FullScreenChat;