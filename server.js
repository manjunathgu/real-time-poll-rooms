
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

// In-memory "DB" for now - keeps it simple for the first pass
let polls = [];

// API Routes
app.post('/api/polls', (req, res) => {
  const newPoll = {
    ...req.body,
    id: Math.random().toString(36).substring(2, 9),
    createdAt: Date.now()
  };
  polls.push(newPoll);
  res.status(201).json(newPoll);
});

app.get('/api/polls/:id', (req, res) => {
  const poll = polls.find(p => p.id === req.params.id);
  if (!poll) return res.status(404).json({ message: 'Poll not found' });
  res.json(poll);
});

app.post('/api/polls/:id/vote', (req, res) => {
  const { id } = req.params;
  const { optionId, voterToken } = req.body;
  
  const poll = polls.find(p => p.id === id);
  if (!poll) return res.status(404).json({ message: 'Poll not found' });

  // Fairness Check 1: Expiration
  if (poll.expiresAt && Date.now() > poll.expiresAt) {
    return res.status(400).json({ message: 'This poll has expired' });
  }

  // Vote update logic
  const option = poll.options.find(o => o.id === optionId);
  if (option) {
    option.votes += 1;
    // Broadcast to everyone in this poll room
    io.to(id).emit('poll-updated', poll);
    return res.json(poll);
  }
  
  res.status(400).json({ message: 'Invalid option' });
});

io.on('connection', (socket) => {
  socket.on('join-room', (pollId) => {
    socket.join(pollId);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
