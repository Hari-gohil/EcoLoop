const mongoose = require('mongoose');

const wasteItemSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  item_condition: { // Renamed from condition_status to match previous SQL name
    type: String,
    enum: ['good', 'fair', 'poor'],
    required: true
  },
  price: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['available', 'pending', 'exchanged'],
    default: 'available'
  },
  image_url: {
    type: String,
    default: null
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false }
});

// Configure JSON serialization to rename _id to id
wasteItemSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    
    // Map populated user object _id to id safely
    if (returnedObject.user_id && typeof returnedObject.user_id === 'object' && !returnedObject.user_id.toHexString) {
      if (returnedObject.user_id._id) {
        returnedObject.user_id.id = returnedObject.user_id._id.toString();
        delete returnedObject.user_id._id;
      }
    }
  }
});

const WasteItem = mongoose.model('WasteItem', wasteItemSchema);
module.exports = WasteItem;
