const mongoose = require('mongoose'); // Database schema banavva mate

// Waste Item no schema (Kachra ni detail database ma kevi rite save thase)
const wasteItemSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // User table sathe link karva mate (Jene waste add karyu che eni ID)
    required: true
  },
  title: {
    type: String, // Kachra nu naam (e.g. "Puna na rasta par kachro")
    required: true
  },
  description: {
    type: String, // Kachra ni detail
    required: true
  },
  category: {
    type: String, // Category (Plastic, Paper, etc.)
    required: true
  },
  item_condition: { // Kachra ni condition kevi che
    type: String,
    enum: ['good', 'fair', 'poor'], // Aa 3 mathi j koi ek aavshe
    required: true
  },
  price: {
    type: Number, // Jo koi kachro vechva mangtu hoy to eni price
    default: 0
  },
  status: {
    type: String,
    enum: ['available', 'pending', 'exchanged'], // Status (available che ke exchange thai gayo)
    default: 'available'
  },
  image_url: {
    type: String, // Kachra no photo
    default: null
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false } // Kyare add kariyu eni date save thase
});

// JSON mathi '_id' ne kadhi ne 'id' karva mate
wasteItemSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    
    // User object sathe populate thayelu hoy to eni id pan fix karva mate
    if (returnedObject.user_id && typeof returnedObject.user_id === 'object' && !returnedObject.user_id.toHexString) {
      if (returnedObject.user_id._id) {
        returnedObject.user_id.id = returnedObject.user_id._id.toString();
        delete returnedObject.user_id._id;
      }
    }
  }
});

// WasteItem model banavi ne export kariyu
const WasteItem = mongoose.model('WasteItem', wasteItemSchema);
module.exports = WasteItem;
