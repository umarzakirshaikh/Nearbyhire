const { Server } = require('socket.io');
const Message = require('../models/Message');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log(`⚡ Socket client connected: ${socket.id}`);

    // Join application conversation room
    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    // Leave room
    socket.on('leave_room', (roomId) => {
      socket.leave(roomId);
      console.log(`User ${socket.id} left room ${roomId}`);
    });

    // Handle sending message in real-time
    socket.on('send_message', async (data) => {
      try {
        const { roomId, applicationId, senderId, recipientId, text } = data;
        
        // Save to DB
        const newMsg = await Message.create({
          application: applicationId,
          sender: senderId,
          recipient: recipientId,
          text
        });

        const populatedMsg = await Message.findById(newMsg._id)
          .populate('sender', 'name role avatar')
          .populate('recipient', 'name role avatar');

        // Broadcast to everyone in the room (including sender)
        io.to(roomId).emit('receive_message', populatedMsg);
      } catch (err) {
        console.error('Socket send_message error:', err.message);
        socket.emit('error_message', { message: 'Failed to send message' });
      }
    });

    // Typing indicators
    socket.on('typing', ({ roomId, user }) => {
      socket.to(roomId).emit('user_typing', { user });
    });

    socket.on('stop_typing', ({ roomId }) => {
      socket.to(roomId).emit('user_stop_typing');
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};

module.exports = { initSocket, getIO };
