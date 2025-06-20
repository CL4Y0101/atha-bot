const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const chatSchema = new mongoose.Schema({
  from: String,
  message: String,
  timestamp: Date,
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
