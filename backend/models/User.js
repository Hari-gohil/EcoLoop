const mongoose = require('mongoose'); // Database schema banavva mate
const bcrypt = require('bcryptjs'); // Password ne encrypt karva mate (Hashing)

// User no schema (Database ma user kevo dekhase enu structure)
const userSchema = new mongoose.Schema({
  name: {
    type: String, // Naam string hase
    required: true // Naam aavashyak che (jaruri che)
  },
  email: {
    type: String,
    required: true,
    unique: true // Ek email thi ek j user banse (duplicate allow nathi)
  },
  password: {
    type: String,
    required: true // Password aapvo farjiyat che
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Role khali 'user' ke 'admin' j hoi shake
    default: 'user' // Default badha navi ID ma 'user' role aavse
  },
  phone: {
    type: String,
    default: null // Phone number optional che
  },
  address: {
    type: String,
    default: null // Address pan optional che
  },
  profile_image: {
    type: String,
    default: null // Profile photo ni link
  },
  upi_id: {
    type: String,
    default: null // Payment aeva/leva mate UPI ID
  },
  points: {
    type: Number,
    default: 0 // Reward points, navo account banave etle 0 hase
  },
  is_blocked: {
    type: Boolean,
    default: false // Admin user ne block kari shake, default false hase
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false } // Kyam account banayu eni date automatically save thase
});

// JSON data front-end ma moklati vakhte '_id' ne 'id' ma badalva (Change _id to id)
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString(); // _id ne string ma convert kari ne id ma save kariyu
    delete returnedObject._id; // _id ne remove kariyo
    delete returnedObject.__v; // __v (version) ne pan remove kariyo
  }
});

// Schema mathi User model banavyo
const User = mongoose.model('User', userSchema);
module.exports = User; // Aane bija files ma use karva mate export kari didhu
