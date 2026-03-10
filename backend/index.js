// server.js / index.js
const express = require('express');
require('./Config/db');
const cors    = require('cors');
const dotenv  = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 5000;   // note: PORT not port (env vars are uppercase by convention)

const UserRouter    = require('./API/user');
const ChatRouter    = require('./API/chatbot');
const ShareRouter   = require('./API/shareExperience');
const SessionRouter = require('./API/history');

const app = express();
app.use(express.json());

// FIX 3: added PATCH to allowed methods
app.use(cors({
  origin:      'http://localhost:5173',
  methods:     ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],   // ← PATCH was missing
  credentials: true,
}));

app.use('/user',     UserRouter);
app.use('/interview', ChatRouter);
app.use('/shareEx',  ShareRouter);
app.use('/history',  SessionRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});