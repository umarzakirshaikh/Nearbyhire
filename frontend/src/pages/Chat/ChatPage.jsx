import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, Loader2, MessageSquare } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function ChatPage({ activeApplication, onBack }) {
  const { socket, joinRoom, leaveRoom, emitMessage } = useSocket();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const applicationId = activeApplication?._id;

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!applicationId) return;

    // 1. Fetch initial message history
    const fetchChatHistory = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/chat/${applicationId}`);
        if (res.data.success) {
          setMessages(res.data.data.messages || []);
        }
      } catch (err) {
        console.error('Error fetching chat history:', err);
      } finally {
        setLoading(false);
        scrollToBottom();
      }
    };

    fetchChatHistory();

    // 2. Join Socket.IO room
    joinRoom(applicationId);

    // 3. Listen for incoming real-time messages
    if (socket) {
      const handleReceive = (newMsg) => {
        if (newMsg.application === applicationId || newMsg.application?._id === applicationId) {
          setMessages((prev) => [...prev, newMsg]);
          scrollToBottom();
        }
      };

      socket.on('receive_message', handleReceive);

      return () => {
        socket.off('receive_message', handleReceive);
        leaveRoom(applicationId);
      };
    }
  }, [applicationId, socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const textToSend = inputText.trim();
    setInputText('');

    const recipientId =
      activeApplication.student?._id === user?.id
        ? activeApplication.employer?._id || activeApplication.employer
        : activeApplication.student?._id || activeApplication.student;

    const messageData = {
      roomId: applicationId,
      applicationId,
      senderId: user?.id,
      recipientId,
      text: textToSend
    };

    // Emit via WebSocket
    emitMessage(messageData);

    // Fallback HTTP post in case socket hasn't caught it
    try {
      await api.post(`/chat/${applicationId}`, { text: textToSend });
    } catch (err) {
      console.warn('HTTP fallback send warning:', err.message);
    }
  };

  const isStudent = user?.role === 'STUDENT';
  const counterpartName = isStudent
    ? activeApplication?.employer?.name || 'Hiring Manager'
    : activeApplication?.student?.name || 'Applicant';

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-md mx-auto bg-slate-100 rounded-3xl overflow-hidden shadow-sm border border-slate-200">
      {/* Chat Header */}
      <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <button
            onClick={onBack}
            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h3 className="font-bold text-sm text-slate-900 leading-tight">
              {counterpartName}
            </h3>
            <p className="text-[11px] text-slate-500 truncate max-w-[200px]">
              Regarding: {activeApplication?.job?.title || 'Employment Gig'}
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center space-x-1">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span>LIVE CHAT</span>
        </span>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="py-12 text-center">
            <Loader2 className="w-6 h-6 text-emerald-600 animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-400">Loading conversation...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">No messages yet. Send a greeting to start coordinating the shift!</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMine =
              msg.sender?._id === user?.id ||
              msg.sender === user?.id ||
              msg.sender?.name === user?.name;

            return (
              <div
                key={msg._id || idx}
                className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-xs shadow-sm leading-relaxed ${
                    isMine
                      ? 'bg-emerald-600 text-white rounded-br-xs'
                      : 'bg-white text-slate-900 border border-slate-200/80 rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">
                  {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Box */}
      <form
        onSubmit={handleSendMessage}
        className="bg-white p-3 border-t border-slate-200 flex items-center space-x-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-slate-100 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-sm transition disabled:opacity-40 active:scale-95 shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
