import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { useSelector } from 'react-redux';

// Fetch all applicant conversations for recruiter
const fetchAllApplicantConversations = async () => {
  const res = await fetch('/api/chat/all-applicants', { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch conversations');
  return res.json();
};

const NextChat = () => {
  const { user } = useSelector(store => store.auth);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllApplicantConversations()
      .then(data => setConversations(data.conversations || []))
      .catch(() => setConversations([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-0 m-0">
      <div className="max-w-3xl mx-auto py-10">
        <div className="flex items-center gap-3 mb-8">
          <Crown className="h-8 w-8 text-purple-500" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">NextChat <span className="ml-2 text-xs px-2 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white align-middle">Premium</span></h2>
        </div>
        {loading ? (
          <div className="text-center text-lg text-gray-500">Loading messages...</div>
        ) : conversations.length === 0 ? (
          <div className="text-center text-lg text-gray-400">No messages from applicants yet.</div>
        ) : (
          <div className="space-y-4">
            {conversations.map(conv => (
              <motion.div
                key={conv.roomId}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-4 bg-white dark:bg-gray-900 rounded-xl shadow p-4 cursor-pointer border border-purple-100 dark:border-gray-800 hover:shadow-lg transition"
                onClick={() => navigate(`/admin/chat/${conv.roomId}`)}
              >
                <Avatar className="h-12 w-12 ring-2 ring-purple-400">
                  <AvatarImage src={conv.candidateAvatar || '/default-avatar.png'} />
                  <AvatarFallback>{conv.candidateName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg text-gray-900 dark:text-white">{conv.candidateName}</span>
                    <span className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-0.5 rounded-full ml-2">Applicant</span>
                  </div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">{conv.lastMessage}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-gray-400">{conv.lastTimestamp && new Date(conv.lastTimestamp).toLocaleString()}</span>
                  {conv.unreadRecruiter > 0 && (
                    <span className="text-xs bg-red-500 text-white rounded-full px-2 py-0.5">{conv.unreadRecruiter} new</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NextChat;
