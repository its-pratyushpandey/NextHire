import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { User2, Users, Plus, Loader2 } from 'lucide-react';

const GroupChatCreate = ({ onGroupCreated }) => {
  const [groupName, setGroupName] = useState('');
  const [memberIds, setMemberIds] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddMember = () => setMemberIds([...memberIds, '']);
  const handleMemberChange = (idx, val) => {
    const arr = [...memberIds];
    arr[idx] = val;
    setMemberIds(arr);
  };

  const handleCreate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/chat/group/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ groupName, memberIds }),
      });
      const data = await res.json();
      if (res.ok) {
        onGroupCreated && onGroupCreated(data);
      } else {
        setError(data.error || 'Failed to create group');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md mx-auto mt-10 border border-purple-200 dark:border-purple-700">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        <Users className="w-6 h-6" /> Create Group Chat
      </h2>
      <Input
        placeholder="Group Name"
        value={groupName}
        onChange={e => setGroupName(e.target.value)}
        className="mb-4"
      />
      <div className="space-y-2 mb-4">
        {memberIds.map((id, idx) => (
          <Input
            key={idx}
            placeholder={`Member User ID #${idx + 1}`}
            value={id}
            onChange={e => handleMemberChange(idx, e.target.value)}
            className=""
          />
        ))}
        <Button variant="outline" onClick={handleAddMember} className="w-full mt-2 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Member
        </Button>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <Button onClick={handleCreate} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:scale-105 transition-all flex items-center gap-2" disabled={loading}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <User2 className="w-4 h-4" />} Create Group
      </Button>
    </div>
  );
};

export default GroupChatCreate;
