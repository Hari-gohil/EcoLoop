const WasteItem = require('../models/WasteItem');

// @desc    Navo kachro add karva mate (Create new waste item)
// @route   POST /api/waste
// @access  Private (Login karelo hovo joiye)
const createWaste = async (req, res) => {
  try {
    const { title, description, category, item_condition, condition_status, price } = req.body;
    let image_url = null;

    if (req.file) {
      image_url = `/uploads/waste/${req.file.filename}`;
    }

    if (!title || !category) {
      return res.status(400).json({ message: 'Title and category are required' });
    }

    const newItem = await WasteItem.create({
      user_id: req.user.id,
      title,
      description,
      category,
      item_condition: item_condition || condition_status,
      image_url,
      price: price ? Number(price) : 0
    });

    res.status(201).json({ message: 'Waste item created successfully', item: newItem });
  } catch (error) {
    console.error('Create waste error:', error);
    res.status(500).json({ message: 'Server error while creating waste item' });
  }
};

// @desc    Badha available kachra ne jova mate (Get all waste)
// @route   GET /api/waste
// @access  Public (Koi pan joi shake)
const getAllWaste = async (req, res) => {
  try {
    const statusFilter = req.query.status || 'available';
    const items = await WasteItem.find({ status: statusFilter })
      .populate('user_id', 'name profile_image')
      .sort({ created_at: -1 });
      
    // Transform to match old SQL flat structure if frontend expects it
    const formattedItems = items.map(item => {
      const obj = item.toJSON();
      if (obj.user_id && typeof obj.user_id === 'object' && !obj.user_id.toHexString) {
        obj.user_name = obj.user_id.name;
        obj.user_image = obj.user_id.profile_image;
        obj.user_id = obj.user_id.id || obj.user_id._id?.toString();
      } else if (obj.user_id && obj.user_id.toHexString) {
        obj.user_id = obj.user_id.toString();
      }
      return obj;
    });

    res.json(formattedItems);
  } catch (error) {
    console.error('Get all waste error:', error);
    res.status(500).json({ message: 'Server error while fetching waste items' });
  }
};

// @desc    Koi ek specific kachra ni puri detail jova mate (Single waste detail)
// @route   GET /api/waste/:id
// @access  Public
const getSingleWaste = async (req, res) => {
  try {
    const item = await WasteItem.findById(req.params.id)
      .populate('user_id', 'name profile_image phone email address upi_id');
    
    if (!item) {
      return res.status(404).json({ message: 'Waste item not found' });
    }
    
    const obj = item.toJSON();
    if (obj.user_id && typeof obj.user_id === 'object' && !obj.user_id.toHexString) {
      obj.user_name = obj.user_id.name;
      obj.user_image = obj.user_id.profile_image;
      
      obj.owner_name = obj.user_id.name;
      obj.owner_email = obj.user_id.email;
      obj.owner_phone = obj.user_id.phone;
      obj.owner_address = obj.user_id.address;
      obj.owner_upi_id = obj.user_id.upi_id;

      obj.user_id = obj.user_id.id || obj.user_id._id?.toString();
    } else if (obj.user_id && obj.user_id.toHexString) {
      obj.user_id = obj.user_id.toString();
    }
    
    res.json(obj);
  } catch (error) {
    console.error('Get single waste error:', error);
    res.status(500).json({ message: 'Server error while fetching waste item' });
  }
};

// @desc    Add karelo kachro update karva mate (Update waste item)
// @route   PUT /api/waste/:id
// @access  Private
const updateWaste = async (req, res) => {
  try {
    const { title, description, category, item_condition, condition_status, price, status } = req.body;
    
    const updatedItem = await WasteItem.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user.id },
      { title, description, category, item_condition: item_condition || condition_status, price: price ? Number(price) : 0, status },
      { new: true }
    );

    if (updatedItem) {
      res.json({ message: 'Waste item updated successfully', item: updatedItem });
    } else {
      res.status(403).json({ message: 'Not authorized or item not found' });
    }
  } catch (error) {
    console.error('Update waste error:', error);
    res.status(500).json({ message: 'Server error while updating waste item' });
  }
};

// @desc    Kachra ne delete/remove karva mate
// @route   DELETE /api/waste/:id
// @access  Private
const deleteWaste = async (req, res) => {
  try {
    const deletedItem = await WasteItem.findOneAndDelete({ 
      _id: req.params.id, 
      user_id: req.user.id 
    });
    
    if (deletedItem) {
      res.json({ message: 'Waste item removed successfully' });
    } else {
      res.status(403).json({ message: 'Not authorized or item not found' });
    }
  } catch (error) {
    console.error('Delete waste error:', error);
    res.status(500).json({ message: 'Server error while deleting waste item' });
  }
};

module.exports = {
  createWaste,
  getAllWaste,
  getSingleWaste,
  updateWaste,
  deleteWaste
};
