import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, MessageSquare, Phone, Video, MoreVertical, Edit, Pin, Forward, Copy, Trash2, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { useSelector } from 'react-redux';
import PremiumVideoCall from '../chat/PremiumVideoCall';

// Fetch all applicant conversations for recruiter
const fetchAllApplicantConversations = async () => {
  const res = await fetch('/api/chat/all-applicants', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) throw new Error('Failed to fetch conversations');
  return res.json();
};

const NextChat = () => {
  const { user } = useSelector(store => store.auth);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageMenuIdx, setMessageMenuIdx] = useState(null);
  const [editIdx, setEditIdx] = useState(null);
  const [editText, setEditText] = useState('');
  const [pinnedIdx, setPinnedIdx] = useState(null);
  const [forwardModal, setForwardModal] = useState(false);
  const [forwardMsg, setForwardMsg] = useState(null);
  const [showVoiceCallModal, setShowVoiceCallModal] = useState(false);
  const [showVideoCallModal, setShowVideoCallModal] = useState(false);
  const socketRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllApplicantConversations()
      .then(data => setConversations(data.conversations || []))
      .catch(() => setConversations([]))
      .finally(() => setLoading(false));
  }, []);

  // --- Message Option Handlers ---
  const handleEdit = (idx, text) => {
    setEditIdx(idx);
    setEditText(text);
    setMessageMenuIdx(null);
  };
  const handleEditSave = (idx) => {
    setConversations(msgs => msgs.map((m, i) => i === idx ? { ...m, candidateName: editText } : m));
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
    setConversations(msgs => msgs.filter((_, i) => i !== idx));
    setMessageMenuIdx(null);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-0 m-0">
      <div className="max-w-3xl mx-auto py-10">
        <div className="flex items-center gap-3 mb-8">
          <Crown className="h-8 w-8 text-purple-500" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">NextChat <span className="ml-2 text-xs px-2 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white align-middle">Premium</span></h2>
          {/* Voice/Video Call Buttons */}
          <div className="flex gap-2 ml-auto">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:scale-105" size="icon" title="Voice Call" onClick={() => setShowVoiceCallModal(true)}>
              <Phone className="w-5 h-5" />
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md hover:scale-105" size="icon" title="Video Call" onClick={() => setShowVideoCallModal(true)}>
              <Video className="w-5 h-5" />
            </Button>
          </div>
        </div>
        {loading ? (
          <div className="text-center text-lg text-gray-500">Loading messages...</div>
        ) : conversations.length === 0 ? (
          <div className="text-center text-lg text-gray-400">No messages from applicants yet.</div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conv, i) => (
              <motion.div
                key={conv.roomId}
                whileHover={{ scale: 1.02 }}
                className={`flex items-center gap-4 bg-white dark:bg-gray-900 rounded-xl shadow p-4 cursor-pointer border border-purple-100 dark:border-gray-800 hover:shadow-lg transition ${pinnedIdx === i ? 'ring-2 ring-yellow-400' : ''}`}
                onClick={() => navigate(`/admin/chat/${conv.roomId}`)}
              >
                <Avatar className="h-12 w-12 ring-2 ring-purple-400">
                  <AvatarImage src={conv.candidateAvatar || '/default-avatar.png'} />
                  <AvatarFallback>{conv.candidateName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {editIdx === i ? (
                      <div className="flex items-center gap-2">
                        <input
                          className="flex-1 border rounded px-2 py-1 text-black"
                          value={editText}
                          onChange={e => setEditText(e.target.value)}
                          autoFocus
                        />
                        <Button size="icon" className="bg-green-500 text-white" onClick={e => { e.stopPropagation(); handleEditSave(i); }}><CheckCircle className="w-4 h-4" /></Button>
                      </div>
                    ) : (
                      <span className="font-semibold text-lg text-gray-900 dark:text-white flex items-center gap-1">
                        {conv.candidateName}
                        {pinnedIdx === i && <Pin className="w-4 h-4 text-yellow-400" title="Pinned" />}
                      </span>
                    )}
                    <span className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-0.5 rounded-full ml-2">Applicant</span>
                  </div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">{conv.lastMessage}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-gray-400">{conv.lastTimestamp && new Date(conv.lastTimestamp).toLocaleString()}</span>
                  {conv.unreadRecruiter > 0 && (
                    <span className="text-xs bg-red-500 text-white rounded-full px-2 py-0.5">{conv.unreadRecruiter} new</span>
                  )}
                  {/* Message Options Menu */}
                  <div className="relative ml-2">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-purple-100 dark:hover:bg-gray-700" onClick={e => { e.stopPropagation(); setMessageMenuIdx(messageMenuIdx === i ? null : i); }}>
                      <MoreVertical className="w-5 h-5 text-purple-500" />
                    </Button>
                    {messageMenuIdx === i && (
                      <div className="absolute right-0 top-8 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 min-w-[160px] animate-fade-in">
                        <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-purple-50 dark:hover:bg-gray-700" onClick={e => { e.stopPropagation(); handleEdit(i, conv.candidateName); }}><Edit className="w-4 h-4 text-blue-500" />Edit</button>
                        <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-purple-50 dark:hover:bg-gray-700" onClick={e => { e.stopPropagation(); handlePin(i); }}><Pin className="w-4 h-4 text-yellow-500" />Pin</button>
                        <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-purple-50 dark:hover:bg-gray-700" onClick={e => { e.stopPropagation(); handleForward(conv); }}><Forward className="w-4 h-4 text-pink-500" />Forward</button>
                        <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-purple-50 dark:hover:bg-gray-700" onClick={e => { e.stopPropagation(); handleCopy(conv.candidateName); }}><Copy className="w-4 h-4 text-green-500" />Copy</button>
                        <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-purple-50 dark:hover:bg-gray-700" onClick={e => { e.stopPropagation(); handleDelete(i); }}><Trash2 className="w-4 h-4 text-red-500" />Delete</button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
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
      {showVoiceCallModal && (
        <PremiumVideoCall
          open={showVoiceCallModal}
          onClose={() => setShowVoiceCallModal(false)}
          roomId={conversations[0]?.roomId || 'default_room'}
          userId={user?.id || user?._id || 'recruiter'}
          userName={user?.fullname || user?.name || 'Recruiter'}
          isHost={true}
          socketRef={socketRef}
          premiumOptions={['conference', 'interview']}
          mode="voice"
        />
      )}
      {showVideoCallModal && (
        <PremiumVideoCall
          open={showVideoCallModal}
          onClose={() => setShowVideoCallModal(false)}
          roomId={conversations[0]?.roomId || 'default_room'}
          userId={user?.id || user?._id || 'recruiter'}
          userName={user?.fullname || user?.name || 'Recruiter'}
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
