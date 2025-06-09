import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Send, User2, Briefcase, Loader2, Check, ChevronLeft, MoreVertical, Phone, Video, Edit, Pin, Forward, Copy, Trash2, CheckCircle, Search, Users, UserCheck } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { randomGifs } from './randomGifs';
import GroupRoomList from './GroupRoomList';
import PremiumVideoCall from './PremiumVideoCall';

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
  const [messageMenuIdx, setMessageMenuIdx] = useState(null);
  const [editIdx, setEditIdx] = useState(null);
  const [editText, setEditText] = useState('');
  const [pinnedIdx, setPinnedIdx] = useState(null);
  const [forwardModal, setForwardModal] = useState(false);
  const [forwardMsg, setForwardMsg] = useState(null);
  const [showVideoCallModal, setShowVideoCallModal] = useState(false);
  const [showVoiceCallModal, setShowVoiceCallModal] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [search, setSearch] = useState('');
  const [showGroupRoomList, setShowGroupRoomList] = useState(false);
  const [groupCallRoom, setGroupCallRoom] = useState(null);
  const [showGroupCallModal, setShowGroupCallModal] = useState(false);
  const socketRef = useRef(null);
  const chatEndRef = useRef(null);
  const roomId = [candidateId, recruiterId].sort().join('_');

  useEffect(() => {
    if (!open) return;
    socketRef.current = io(SOCKET_URL, { withCredentials: true });

    socketRef.current.emit('joinRoom', { roomId });

    // Fetch chat history from backend
    fetch(`/api/chat/${roomId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
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
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
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

  // --- Message Option Handlers ---
  const handleEdit = (idx, text) => {
    setEditIdx(idx);
    setEditText(text);
    setMessageMenuIdx(null);
  };
  const handleEditSave = (idx) => {
    // TODO: API call to update message on backend
    setMessages(msgs => msgs.map((m, i) => i === idx ? { ...m, text: editText } : m));
    setEditIdx(null);
  };
  const handlePin = (idx) => {
    setPinnedIdx(idx);
    setMessageMenuIdx(null);
  };
  const handleForward = (msg) => {
    setForwardMsg(msg);
    setForwardModal(true);
    setMessageMenuIdx(null);
  };
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setMessageMenuIdx(null);
  };
  const handleDelete = (idx) => {
    // TODO: API call to delete message on backend
    setMessages(msgs => msgs.filter((_, i) => i !== idx));
    setMessageMenuIdx(null);
  };

  // Fetch all applicants for recruiter (show all, not just those with chat)
  useEffect(() => {
    if (!open) return;
    setLoadingConvs(true);
    fetch(`/api/chat/applicants-for-recruiter/${recruiterId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        const applicants = Array.isArray(data.applicants) ? data.applicants : [];
        const convs = applicants.map(app => {
          const candidateId = app._id;
          const roomId = [candidateId, recruiterId].sort().join('_');
          return {
            roomId,
            candidateName: app.fullname || app.name || 'Unknown',
            candidateAvatar: app.profile?.profilePhoto || app.profilePhoto || '',
            lastMessage: '',
            lastTimestamp: '',
            unreadRecruiter: 0
          };
        });
        setConversations(convs);
      })
      .catch(() => setConversations([]))
      .finally(() => setLoadingConvs(false));
  }, [recruiterId, open]);

  const filteredConvs = conversations.filter(conv =>
    conv.candidateName?.toLowerCase().includes(search.toLowerCase())
  );

  // Handler for joining a persistent group call room
  const handleJoinGroupCall = (room) => {
    setGroupCallRoom(room);
    setShowGroupCallModal(true);
    setShowGroupRoomList(false);
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
        className="fixed inset-0 z-50 bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex"
      >
        {/* Left: Applicants List */}
        <div className="w-full md:w-1/3 lg:w-1/4 border-r border-purple-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 flex flex-col">
          <div className="p-4 flex items-center gap-2 border-b border-purple-100 dark:border-gray-800">
            <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">NextChat</span>
          </div>
          <div className="p-2 flex gap-2">
            <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:scale-105" onClick={() => setShowGroupRoomList(true)}>
              <Users className="w-5 h-5 mr-2" /> Group Rooms
            </Button>
          </div>
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
              <input
                type="text"
                placeholder="Search applicants..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-800 focus:ring-2 ring-purple-400"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingConvs ?
              <div className="flex justify-center items-center h-40">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
              </div>
            : filteredConvs.length === 0 ?
              <div className="text-center text-gray-500 p-4">No applicants found.</div>
            : filteredConvs.map(conv => (
              <div
                key={conv.roomId}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/30 transition ${selectedConv?.roomId === conv.roomId ? 'bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900' : ''}`}
                onClick={() => setSelectedConv(conv)}
              >
                <Avatar className="w-10 h-10 ring-2 ring-purple-400">
                  <AvatarImage src={conv.candidateAvatar || '/default-avatar.png'} />
                  <AvatarFallback>{conv.candidateName?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 dark:text-white truncate">{conv.candidateName}</div>
                  <div className="text-xs text-gray-500 truncate">{conv.lastMessage}</div>
                </div>
                {conv.unreadRecruiter > 0 && (
                  <span className="text-xs bg-red-500 text-white rounded-full px-2 py-0.5">{conv.unreadRecruiter} new</span>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Right: Chat Window */}
        <div className="flex-1 flex flex-col h-full">
          {selectedConv ? (
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
                  <div className={`relative max-w-[70%] rounded-2xl px-4 py-2 shadow-md flex items-end gap-2
                    ${msg.senderId === userId
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white self-end premium-card'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 self-start premium-card'
                    } ${pinnedIdx === i ? 'ring-2 ring-yellow-400' : ''}`}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={msg.avatar || '/default-avatar.png'} />
                      <AvatarFallback>
                        {msg.name?.[0] || <User2 />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                      {msg.gif && <img src={msg.gif} alt="gif" className="w-32 h-32 rounded mb-1" />}
                      {msg.fileUrl && (
                        msg.fileType?.startsWith('image/') ? (
                          <img src={msg.fileUrl} alt={msg.fileName} className="w-32 h-32 rounded mb-1" />
                        ) : (
                          <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="block text-blue-500 underline mb-1">{msg.fileName}</a>
                        )
                      )}
                      {/* Edit Mode */}
                      {editIdx === i ? (
                        <div className="flex items-center gap-2">
                          <input
                            className="flex-1 border rounded px-2 py-1 text-black"
                            value={editText}
                            onChange={e => setEditText(e.target.value)}
                            autoFocus
                          />
                          <Button size="icon" className="bg-green-500 text-white" onClick={() => handleEditSave(i)}><CheckCircle className="w-4 h-4" /></Button>
                        </div>
                      ) : (
                        <div className="text-sm flex items-center gap-1">
                          {msg.text}
                          {pinnedIdx === i && <Pin className="w-4 h-4 text-yellow-400" title="Pinned" />}
                        </div>
                      )}
                      <div className="text-[10px] opacity-60 text-right">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {msg.senderId === userId && <Check className="inline w-3 h-3 ml-1 text-green-300" />}
                      </div>
                    </div>
                    {/* Message Options Menu */}
                    <div className="relative ml-2">
                      <Button variant="ghost" size="icon" className="rounded-full hover:bg-purple-100 dark:hover:bg-gray-700" onClick={() => setMessageMenuIdx(messageMenuIdx === i ? null : i)}>
                        <MoreVertical className="w-5 h-5 text-purple-500" />
                      </Button>
                      {messageMenuIdx === i && (
                        <div className="absolute right-0 top-8 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 min-w-[160px] animate-fade-in">
                          <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-purple-50 dark:hover:bg-gray-700" onClick={() => handleEdit(i, msg.text)}><Edit className="w-4 h-4 text-blue-500" />Edit</button>
                          <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-purple-50 dark:hover:bg-gray-700" onClick={() => handlePin(i)}><Pin className="w-4 h-4 text-yellow-500" />Pin</button>
                          <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-purple-50 dark:hover:bg-gray-700" onClick={() => handleForward(msg)}><Forward className="w-4 h-4 text-pink-500" />Forward</button>
                          <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-purple-50 dark:hover:bg-gray-700" onClick={() => handleCopy(msg.text)}><Copy className="w-4 h-4 text-green-500" />Copy</button>
                          <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-purple-50 dark:hover:bg-gray-700" onClick={() => handleDelete(i)}><Trash2 className="w-4 h-4 text-red-500" />Delete</button>
                        </div>
                      )}
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
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <span className="text-2xl font-semibold mb-2">Select an applicant to start chatting</span>
              <span className="text-sm">All your applicant conversations appear here in premium style.</span>
            </div>
          )}
        </div>
        {/* Group Room List Modal */}
        {showGroupRoomList && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 min-w-[340px] max-w-lg w-full relative">
              <Button onClick={() => setShowGroupRoomList(false)} className="absolute top-4 right-4 bg-gray-800 text-white rounded-full" size="icon">✕</Button>
              <GroupRoomList userId={userId} onJoinCall={handleJoinGroupCall} />
            </div>
          </div>
        )}
        {/* Group Call Modal */}
        {showGroupCallModal && groupCallRoom && (
          <PremiumVideoCall
            open={showGroupCallModal}
            onClose={() => setShowGroupCallModal(false)}
            roomId={groupCallRoom._id}
            userId={userId}
            userName={userRole === 'recruiter' ? 'Recruiter' : 'Candidate'}
            isHost={true}
            socketRef={socketRef}
            premiumOptions={['screen', 'conference', 'interview']}
            mode="video"
            groupMode="group"
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default FullScreenChat;