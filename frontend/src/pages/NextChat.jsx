import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { motion } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Smile, Send, User2, Briefcase, Loader2, Check, MoreVertical, Phone, Video, Edit, Pin, Forward, Copy, Trash2, CheckCircle, Search, Paperclip, Users, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { randomGifs } from '@/components/chat/randomGifs';
import PremiumVideoCall from '@/components/chat/PremiumVideoCall';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const NextChat = () => {
  const { user } = useSelector(store => store.auth);
  const recruiterId = user?._id;
  const userId = recruiterId;
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [input, setInput] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const chatEndRef = useRef(null);
  const socketRef = useRef(null);
  const [searchParams] = useSearchParams();
  const candidateIdFromQuery = searchParams.get('candidateId');
  const [messageMenuIdx, setMessageMenuIdx] = useState(null);
  const [editIdx, setEditIdx] = useState(null);
  const [editText, setEditText] = useState('');
  const [pinnedIdx, setPinnedIdx] = useState(null);
  const [forwardModal, setForwardModal] = useState(false);
  const [forwardMsg, setForwardMsg] = useState(null);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [showVideoCallModal, setShowVideoCallModal] = useState(false);
  const [showVoiceCallModal, setShowVoiceCallModal] = useState(false);

  // Fetch all applicants for recruiter (show all, not just those with chat)
  useEffect(() => {
    setLoadingConvs(true);
    fetch(`/api/chat/applicants-for-recruiter/${recruiterId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        // Normalize applicants to chat conversation format
        const applicants = Array.isArray(data.applicants) ? data.applicants : [];
        const convs = applicants.map(app => {
          // Generate roomId using candidateId and recruiterId (sorted)
          const candidateId = app._id;
          const roomId = [candidateId, recruiterId].sort().join('_');
          return {
            roomId,
            candidateName: app.fullname || app.name || 'Unknown',
            candidateAvatar: app.profile?.profilePhoto || app.profilePhoto || '',
            lastMessage: '', // Optionally fetch last message if needed
            lastTimestamp: '',
            unreadRecruiter: 0 // Optionally fetch unread count if needed
          };
        });
        setConversations(convs);
      })
      .catch(() => setConversations([]))
      .finally(() => setLoadingConvs(false));
  }, [recruiterId]);

  // Fetch messages for selected conversation
  useEffect(() => {
    if (!selectedConv) return;
    setMessagesLoading(true);
    fetch(`/api/chat/${selectedConv.roomId}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setMessages(Array.isArray(data.messages) ? data.messages.map(msg => ({ ...msg, text: msg.message })) : []);
        setMessagesLoading(false);
      })
      .catch(() => {
        setMessages([]);
        setMessagesLoading(false);
      });
    socketRef.current = io(SOCKET_URL, { withCredentials: true });
    socketRef.current.emit('joinRoom', { roomId: selectedConv.roomId });
    socketRef.current.on('receiveMessage', (msg) => {
      setMessages(prev => [...prev, { ...msg, text: msg.message }]);
    });
    return () => socketRef.current.disconnect();
  }, [selectedConv]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileChange = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setUploadError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', f);
      const res = await fetch('/api/chat/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setFile({ ...f, url: data.url, fileType: data.type, fileName: data.name });
    } catch (err) {
      setUploadError(err.message || 'File upload failed');
      setFile(null);
    } finally {
      setUploading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if ((!input.trim() && !file) || uploading || !selectedConv) return;
    const roomId = selectedConv.roomId;
    const message = {
      senderId: userId,
      senderRole: 'recruiter',
      text: input,
      timestamp: new Date().toISOString(),
      avatar: '',
      name: user?.fullname || 'Recruiter',
      fileUrl: file && file.url ? file.url : '',
      fileType: file && file.url ? (file.fileType || file.type) : '',
      fileName: file && file.url ? (file.fileName || file.name) : '',
    };
    setMessages(prev => [...prev, message]);
    socketRef.current.emit('sendMessage', { roomId, message });
    try {
      await fetch(`/api/chat/${roomId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          message: input,
          senderId: userId,
          senderRole: 'recruiter',
          fileUrl: message.fileUrl,
          fileType: message.fileType,
          fileName: message.fileName,
          gif: ''
        })
      });
    } catch (err) {}
    setInput('');
    setFile(null);
  };

  const handleEmojiSelect = (emoji) => {
    setInput((prev) => prev + emoji.native);
  };

  const filteredConvs = conversations.filter(conv =>
    conv.candidateName?.toLowerCase().includes(search.toLowerCase())
  );

  // Auto-select candidate if candidateId is in query
  useEffect(() => {
    if (candidateIdFromQuery && conversations.length > 0) {
      const found = conversations.find(conv => conv.roomId.includes(candidateIdFromQuery));
      if (found) setSelectedConv(found);
    }
  }, [candidateIdFromQuery, conversations]);

  // --- Message Option Handlers ---
  const handleEdit = (idx, text) => {
    setEditIdx(idx);
    setEditText(text);
    setMessageMenuIdx(null);
  };
  const handleEditSave = (idx) => {
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
    setMessages(msgs => msgs.filter((_, i) => i !== idx));
    setMessageMenuIdx(null);
  };

  return (
    <div className="w-full h-screen flex bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Left: Applicants List */}
      <div className="w-full md:w-1/3 lg:w-1/4 border-r border-purple-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 flex flex-col">
        <div className="p-4 flex items-center gap-2 border-b border-purple-100 dark:border-gray-800">
          <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">NextChat</span>
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
              disabled={uploading}
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
          <div className="flex flex-col h-full">
            {/* Chat Header */}
            {selectedConv && (
              <div className="flex items-center gap-3 p-4 border-b border-purple-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 shadow-md">
                <Avatar className="w-10 h-10 ring-2 ring-purple-400">
                  <AvatarImage src={selectedConv.candidateAvatar || '/default-avatar.png'} />
                  <AvatarFallback>{selectedConv.candidateName?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    {selectedConv.candidateName}
                    <span className="premium-badge ml-2">Premium</span>
                  </div>
                </div>
                <span className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-0.5 rounded-full ml-2">Applicant</span>
                {/* Voice/Video Call Buttons */}
                <div className="flex gap-2 ml-4">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:scale-105" size="icon" title="Voice Call" onClick={() => setShowVoiceCallModal(true)}>
                    <Phone className="w-5 h-5" />
                  </Button>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md hover:scale-105" size="icon" title="Video Call" onClick={() => setShowVideoCallModal(true)}>
                    <Video className="w-5 h-5" />
                  </Button>
                  <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-md hover:scale-105" size="icon" title="Group Call (Coming soon)" disabled>
                    <Users className="w-5 h-5" />
                  </Button>
                  <Button className="bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-md hover:scale-105" size="icon" title="Conference/Interview (Coming soon)" disabled>
                    <UserCheck className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}
            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2 bg-gradient-to-br from-white via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
              {messagesLoading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-500">No messages yet.</div>
              ) : (
                messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.05 } } }}
                    className={`flex ${msg.senderRole === 'recruiter' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`relative max-w-[70%] rounded-2xl px-4 py-2 shadow-md flex items-end gap-2
                      ${msg.senderRole === 'recruiter'
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white self-end premium-card'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 self-start premium-card'
                      } ${pinnedIdx === i ? 'ring-2 ring-yellow-400' : ''}`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={msg.avatar || '/default-avatar.png'} />
                        <AvatarFallback>
                          {msg.name?.[0] || 'A'}
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
                          {msg.senderRole === 'recruiter' && <Check className="inline w-3 h-3 ml-1 text-green-300" />}
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
                  </motion.div>                ))
              )}
              <div ref={chatEndRef} />
              {/* Chat Input */}
              <form
                className="flex items-center gap-2 p-4 border-t border-purple-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 relative"
                onSubmit={sendMessage}
              >
                <button type="button" onClick={() => setShowEmoji(!showEmoji)} className="p-2 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900 transition">
                  <Smile className="w-5 h-5 text-purple-500" />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 rounded-full border border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-800 focus:ring-2 ring-purple-400"
                  disabled={uploading}
                />
                <label className="p-2 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900 transition cursor-pointer">
                  <Paperclip className="w-5 h-5 text-purple-500" />
                  <input type="file" className="hidden" onChange={handleFileChange} disabled={uploading} />
                </label>
                <Button type="submit" className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 transition-all flex items-center gap-1" disabled={uploading || (file && !file.url)}>
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Send
                </Button>
                {uploadError && <div className="text-xs text-red-500 px-4">{uploadError}</div>}
                {file && <div className="flex items-center gap-2 p-2 border rounded bg-gray-50 dark:bg-gray-800 mt-2">
                  {file.type && file.type.startsWith('image/') && (
                    <img src={file.url ? file.url : URL.createObjectURL(file)} alt={file.name} className="w-16 h-16 object-cover rounded" />
                  )}
                  {file.type === 'application/pdf' && (
                    <span className="text-red-600 font-bold">PDF: {file.name}</span>
                  )}
                  {(file.type && (file.type.includes('word') || file.type.includes('officedocument'))) && (
                    <span className="text-blue-600 font-bold">DOC: {file.name}</span>
                  )}
                  {!file.type && (
                    <span className="text-gray-700 dark:text-gray-200">{file.name}</span>
                  )}
                  <button onClick={() => setFile(null)} className="ml-auto text-xs text-red-500 hover:underline">Remove</button>
                </div>}
                {showEmoji && (
                  <div className="absolute bottom-20 left-4 z-50">
                    <Picker data={data} onEmojiSelect={handleEmojiSelect} theme={window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'} />
                  </div>
                )}
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <span className="text-2xl font-semibold mb-2">Select an applicant to start chatting</span>
            <span className="text-sm">All your applicant conversations appear here in premium style.</span>
          </div>
        )}
      </div>
      {/* Forward Modal Stub */}
      {forwardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 min-w-[320px]">
            <h3 className="font-bold text-lg mb-4">Forward Message</h3>
            <div className="mb-4 text-gray-700 dark:text-gray-200">(Feature coming soon)</div>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white w-full" onClick={() => setForwardModal(false)}>Close</Button>
          </div>
        </div>
      )}
      {showVoiceCallModal && selectedConv && (
        <PremiumVideoCall
          open={showVoiceCallModal}
          onClose={() => setShowVoiceCallModal(false)}
          roomId={selectedConv.roomId}
          userId={userId}
          userName={user?.fullname || 'Recruiter'}
          isHost={true}
          socketRef={socketRef}
          premiumOptions={['conference', 'interview']}
          mode="voice"
        />
      )}
      {showVideoCallModal && selectedConv && (
        <PremiumVideoCall
          open={showVideoCallModal}
          onClose={() => setShowVideoCallModal(false)}
          roomId={selectedConv.roomId}
          userId={userId}
          userName={user?.fullname || 'Recruiter'}
          isHost={true}
          socketRef={socketRef}
          premiumOptions={['screen', 'conference', 'interview']}
          mode="video"
        />
      )}
    </div>
  );
};

export default NextChat;
