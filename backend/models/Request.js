const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  requester_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  waste_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WasteItem',
    required: true
  },
  message: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false }
});

// Configure JSON serialization to rename _id to id
requestSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const RequestModel = mongoose.model('Request', requestSchema);
module.exports = RequestModel;
