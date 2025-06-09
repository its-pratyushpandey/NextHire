import React, { useRef, useEffect, useState } from 'react';
import { X, Mic, MicOff, Video, VideoOff, Monitor, Users, UserCheck, Share2, PhoneOff, Crown, BarChart2 } from 'lucide-react';
import { Button } from '../ui/button';

// Simple WebRTC peer-to-peer for demo (no TURN/STUN config for prod)
const ICE_SERVERS = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

const PremiumVideoCall = ({
  open,
  onClose,
  roomId,
  userId,
  userName,
  isHost,
  socketRef,
  premiumOptions = ['screen', 'conference', 'interview'],
  mode = 'video', // new prop: 'video' or 'voice'
}) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [callActive, setCallActive] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [participants, setParticipants] = useState([userName]);
  const [groupMode, setGroupMode] = useState(null); // 'group' | 'conference' | 'interview' | null
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [callStartTime, setCallStartTime] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [networkQuality, setNetworkQuality] = useState('Good'); // Placeholder
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);

  // Timer for call duration
  useEffect(() => {
    let timer;
    if (callActive && callStartTime) {
      timer = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - callStartTime) / 1000));
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [callActive, callStartTime]);

  useEffect(() => {
    if (!open) return;
    // Get user media
    navigator.mediaDevices.getUserMedia({ video: mode === 'video', audio: true }).then(stream => {
      localStreamRef.current = stream;
      if (mode === 'video' && localVideoRef.current) localVideoRef.current.srcObject = stream;
      // Signal join
      if (groupMode === 'group') {
        socketRef.current.emit('join-group-call', { groupRoomId: roomId, userId, userName });
      } else if (groupMode === 'conference') {
        socketRef.current.emit('conference-join', { conferenceId: roomId, userId, userName });
      } else if (groupMode === 'interview') {
        socketRef.current.emit('interview-join', { interviewId: roomId, userId, userName });
      } else {
        socketRef.current.emit('join-video-room', { roomId, userId, userName });
      }
    });
    // Listen for signaling
    if (groupMode === 'group') {
      socketRef.current.on('group-video-offer', handleOffer);
      socketRef.current.on('group-video-answer', handleAnswer);
      socketRef.current.on('group-ice-candidate', handleCandidate);
      socketRef.current.on('group-participant-joined', ({ name }) => setParticipants(p => [...p, name]));
    } else if (groupMode === 'conference') {
      socketRef.current.on('conference-offer', handleOffer);
      socketRef.current.on('conference-answer', handleAnswer);
      socketRef.current.on('conference-ice-candidate', handleCandidate);
      socketRef.current.on('conference-participant-joined', ({ name }) => setParticipants(p => [...p, name]));
    } else if (groupMode === 'interview') {
      socketRef.current.on('interview-offer', handleOffer);
      socketRef.current.on('interview-answer', handleAnswer);
      socketRef.current.on('interview-ice-candidate', handleCandidate);
      socketRef.current.on('interview-participant-joined', ({ name }) => setParticipants(p => [...p, name]));
    } else {
      socketRef.current.on('video-offer', handleOffer);
      socketRef.current.on('video-answer', handleAnswer);
      socketRef.current.on('ice-candidate', handleCandidate);
      socketRef.current.on('participant-joined', ({ name }) => setParticipants(p => [...p, name]));
    }
    return () => {
      socketRef.current.off('video-offer', handleOffer);
      socketRef.current.off('video-answer', handleAnswer);
      socketRef.current.off('ice-candidate', handleCandidate);
      socketRef.current.off('participant-joined');
      socketRef.current.off('group-video-offer', handleOffer);
      socketRef.current.off('group-video-answer', handleAnswer);
      socketRef.current.off('group-ice-candidate', handleCandidate);
      socketRef.current.off('group-participant-joined');
      socketRef.current.off('conference-offer', handleOffer);
      socketRef.current.off('conference-answer', handleAnswer);
      socketRef.current.off('conference-ice-candidate', handleCandidate);
      socketRef.current.off('conference-participant-joined');
      socketRef.current.off('interview-offer', handleOffer);
      socketRef.current.off('interview-answer', handleAnswer);
      socketRef.current.off('interview-ice-candidate', handleCandidate);
      socketRef.current.off('interview-participant-joined');
      stopStreams();
    };
    // eslint-disable-next-line
  }, [open, mode, groupMode]);

  const stopStreams = () => {
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    if (peerRef.current) peerRef.current.close();
    setCallActive(false);
  };

  // WebRTC handlers
  const startCall = async () => {
    peerRef.current = new RTCPeerConnection(ICE_SERVERS);
    localStreamRef.current.getTracks().forEach(track => peerRef.current.addTrack(track, localStreamRef.current));
    peerRef.current.ontrack = e => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = e.streams[0];
    };
    peerRef.current.onicecandidate = e => {
      if (e.candidate) {
        if (groupMode === 'group') {
          socketRef.current.emit('group-ice-candidate', { groupRoomId: roomId, candidate: e.candidate });
        } else if (groupMode === 'conference') {
          socketRef.current.emit('conference-ice-candidate', { conferenceId: roomId, candidate: e.candidate });
        } else if (groupMode === 'interview') {
          socketRef.current.emit('interview-ice-candidate', { interviewId: roomId, candidate: e.candidate });
        } else {
          socketRef.current.emit('ice-candidate', { roomId, candidate: e.candidate });
        }
      }
    };
    const offer = await peerRef.current.createOffer();
    await peerRef.current.setLocalDescription(offer);
    if (groupMode === 'group') {
      socketRef.current.emit('group-video-offer', { groupRoomId: roomId, offer });
    } else if (groupMode === 'conference') {
      socketRef.current.emit('conference-offer', { conferenceId: roomId, offer });
    } else if (groupMode === 'interview') {
      socketRef.current.emit('interview-offer', { interviewId: roomId, offer });
    } else {
      socketRef.current.emit('video-offer', { roomId, offer });
    }
    setCallActive(true);
    setCallStartTime(Date.now());
  };
  const handleOffer = async ({ offer }) => {
    peerRef.current = new RTCPeerConnection(ICE_SERVERS);
    localStreamRef.current.getTracks().forEach(track => peerRef.current.addTrack(track, localStreamRef.current));
    peerRef.current.ontrack = e => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = e.streams[0];
    };
    peerRef.current.onicecandidate = e => {
      if (e.candidate) {
        if (groupMode === 'group') {
          socketRef.current.emit('group-ice-candidate', { groupRoomId: roomId, candidate: e.candidate });
        } else if (groupMode === 'conference') {
          socketRef.current.emit('conference-ice-candidate', { conferenceId: roomId, candidate: e.candidate });
        } else if (groupMode === 'interview') {
          socketRef.current.emit('interview-ice-candidate', { interviewId: roomId, candidate: e.candidate });
        } else {
          socketRef.current.emit('ice-candidate', { roomId, candidate: e.candidate });
        }
      }
    };
    await peerRef.current.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerRef.current.createAnswer();
    await peerRef.current.setLocalDescription(answer);
    if (groupMode === 'group') {
      socketRef.current.emit('group-video-answer', { groupRoomId: roomId, answer });
    } else if (groupMode === 'conference') {
      socketRef.current.emit('conference-answer', { conferenceId: roomId, answer });
    } else if (groupMode === 'interview') {
      socketRef.current.emit('interview-answer', { interviewId: roomId, answer });
    } else {
      socketRef.current.emit('video-answer', { roomId, answer });
    }
    setCallActive(true);
    setCallStartTime(Date.now());
  };
  const handleAnswer = async ({ answer }) => {
    await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
  };
  const handleCandidate = async ({ candidate }) => {
    try {
      await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    } catch {}
  };

  // Premium features
  const toggleScreenShare = async () => {
    if (!screenSharing) {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const screenTrack = screenStream.getVideoTracks()[0];
      const sender = peerRef.current.getSenders().find(s => s.track.kind === 'video');
      sender.replaceTrack(screenTrack);
      setScreenSharing(true);
      screenTrack.onended = () => {
        sender.replaceTrack(localStreamRef.current.getVideoTracks()[0]);
        setScreenSharing(false);
      };
    } else {
      const sender = peerRef.current.getSenders().find(s => s.track.kind === 'video');
      sender.replaceTrack(localStreamRef.current.getVideoTracks()[0]);
      setScreenSharing(false);
    }
  };

  const toggleMic = () => {
    localStreamRef.current.getAudioTracks().forEach(track => (track.enabled = !micOn));
    setMicOn(m => !m);
  };
  const toggleCam = () => {
    localStreamRef.current.getVideoTracks().forEach(track => (track.enabled = !camOn));
    setCamOn(c => !c);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80">
      <div className="relative bg-gradient-to-br from-purple-900 via-pink-900 to-blue-900 rounded-2xl shadow-2xl p-6 w-full max-w-3xl flex flex-col items-center">
        <div className="flex items-center gap-3 mb-4">
          <Crown className="w-6 h-6 text-yellow-400 animate-pulse" />
          <span className="text-xl font-bold text-white">
            {groupMode === 'group' ? 'Premium Group Call' : groupMode === 'conference' ? 'Conference Call' : groupMode === 'interview' ? 'Interview Session' : (mode === 'voice' ? 'Premium Voice Call' : 'Premium Video Call')}
          </span>
        </div>
        <div className="flex gap-4 w-full mb-4">
          <div className="flex-1 flex flex-col items-center">
            {mode === 'video' ? (
              <video ref={localVideoRef} autoPlay muted playsInline className="rounded-xl border-4 border-purple-500 w-64 h-40 bg-black" />
            ) : (
              <div className="rounded-full bg-purple-700 w-24 h-24 flex items-center justify-center text-4xl text-white shadow-lg border-4 border-purple-500">
                <Mic />
              </div>
            )}
            <div className="text-purple-200 mt-2 text-xs">You ({userName})</div>
          </div>
          <div className="flex-1 flex flex-col items-center">
            {mode === 'video' ? (
              <video ref={remoteVideoRef} autoPlay playsInline className="rounded-xl border-4 border-pink-500 w-64 h-40 bg-black" />
            ) : (
              <div className="rounded-full bg-pink-700 w-24 h-24 flex items-center justify-center text-4xl text-white shadow-lg border-4 border-pink-500">
                <Mic />
              </div>
            )}
            <div className="text-pink-200 mt-2 text-xs">Remote</div>
          </div>
        </div>
        <div className="flex gap-3 mb-4">
          <Button onClick={toggleMic} className={micOn ? 'bg-green-500' : 'bg-gray-700'} size="icon" title={micOn ? 'Mute Mic' : 'Unmute Mic'}>
            {micOn ? <Mic /> : <MicOff />}
          </Button>
          {mode === 'video' && (
            <Button onClick={toggleCam} className={camOn ? 'bg-blue-500' : 'bg-gray-700'} size="icon" title={camOn ? 'Turn Off Camera' : 'Turn On Camera'}>
              {camOn ? <Video /> : <VideoOff />}
            </Button>
          )}
          {mode === 'video' && premiumOptions.includes('screen') && (
            <Button onClick={toggleScreenShare} className={screenSharing ? 'bg-yellow-500' : 'bg-gray-700'} size="icon" title="Screen Share">
              <Monitor />
            </Button>
          )}
          <Button onClick={onClose} className="bg-red-600" size="icon" title="End Call">
            <PhoneOff />
          </Button>
          <Button onClick={() => setAnalyticsOpen(true)} className="bg-gradient-to-r from-purple-400 to-pink-400 text-white" size="icon" title="View Analytics">
            <BarChart2 />
          </Button>
        </div>
        <div className="flex gap-4 mb-2">
          <Button onClick={() => setGroupMode('group')} className={`bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs ${groupMode === 'group' ? 'ring-2 ring-yellow-300' : ''}`}>Group Call</Button>
          <Button onClick={() => setGroupMode('conference')} className={`bg-gradient-to-r from-green-400 to-blue-500 text-white px-3 py-1 rounded-full text-xs ${groupMode === 'conference' ? 'ring-2 ring-green-300' : ''}`}>Conference</Button>
          <Button onClick={() => setGroupMode('interview')} className={`bg-gradient-to-r from-purple-400 to-pink-500 text-white px-3 py-1 rounded-full text-xs ${groupMode === 'interview' ? 'ring-2 ring-purple-300' : ''}`}>Interview</Button>
          <Button onClick={() => setGroupMode(null)} className={`bg-gray-700 text-white px-3 py-1 rounded-full text-xs ${!groupMode ? 'ring-2 ring-gray-400' : ''}`}>1:1</Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2 justify-center">
          {participants.map((p, i) => (
            <span key={i} className="bg-purple-700 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <Users className="w-3 h-3" /> {p}
            </span>
          ))}
        </div>
        <Button onClick={startCall} className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:scale-105" disabled={callActive}>
          {groupMode === 'group' ? 'Start Group Call' : groupMode === 'conference' ? 'Start Conference' : groupMode === 'interview' ? 'Start Interview' : 'Start Call'}
        </Button>
        <Button onClick={onClose} className="absolute top-4 right-4 bg-gray-800 text-white rounded-full" size="icon">
          <X />
        </Button>
        {analyticsOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 min-w-[320px] max-w-lg w-full flex flex-col items-center">
              <h3 className="font-bold text-lg mb-4 text-gradient bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Call Analytics (Premium)</h3>
              <div className="w-full text-sm text-gray-700 dark:text-gray-200 mb-4">
                <ul className="list-disc pl-5">
                  <li>Participants: {participants.length}</li>
                  <li>Call Mode: {groupMode ? groupMode : (mode === 'voice' ? 'Voice' : 'Video')}</li>
                  <li>Duration: {callDuration} seconds</li>
                  <li>Screen Sharing: {screenSharing ? 'Active' : 'Inactive'}</li>
                  <li>Network Quality: {networkQuality}</li>
                </ul>
              </div>
              <Button onClick={() => setAnalyticsOpen(false)} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white w-full">Close Analytics</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PremiumVideoCall;
