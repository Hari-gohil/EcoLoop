const mongoose = require('mongoose');

// Request no schema (Kachro leva mate je request mokle eni database detail)
const requestSchema = new mongoose.Schema({
  requester_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Jene request mokli che eni ID
    required: true
  },
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Kachra na malik (owner) ni ID
    required: true
  },
  waste_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WasteItem', // Je kachra mate request aavi che eni ID
    required: true
  },
  message: {
    type: String, // Request sathe koi message moklyo hoy to
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'], // Request nu status
    default: 'pending' // Default pending hase
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false } // Kyare request aavi eni date
});

// JSON data ma id formatting karva mate ( _id ne id karva)
requestSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const RequestModel = mongoose.model('Request', requestSchema);
module.exports = RequestModel;
