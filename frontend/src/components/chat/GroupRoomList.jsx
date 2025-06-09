import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Users, Video } from 'lucide-react';

const GroupRoomList = ({ userId, onJoinCall }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('/api/groupRoom/list', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setRooms(data.rooms || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load group rooms');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4">Loading group rooms...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!rooms.length) return <div className="p-4">No group rooms found.</div>;

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
        <Users className="w-5 h-5 text-purple-500" /> Your Group Rooms
      </h3>
      {rooms.map(room => (
        <div key={room._id} className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded-lg p-3 shadow">
          <div>
            <div className="font-semibold text-purple-700 dark:text-purple-300">{room.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{room.description}</div>
            <div className="text-xs text-gray-400 mt-1">Participants: {room.participants.length}</div>
          </div>
          <Button
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center gap-1"
            onClick={() => onJoinCall(room)}
          >
            <Video className="w-4 h-4" /> Join Call
          </Button>
        </div>
      ))}
    </div>
  );
};

export default GroupRoomList;
