const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false }
});

// Configure JSON serialization to rename _id to id
categorySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
