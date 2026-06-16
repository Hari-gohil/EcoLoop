const Request = require('../models/Request');
const WasteItem = require('../models/WasteItem');
const User = require('../models/User');
const Chat = require('../models/Chat');
const { sendNotification } = require('../services/notificationService');
const GreenPointService = require('../services/greenPointService');

// @desc    Kachra mate request mokalva (Send request for waste)
// @route   POST /api/requests
// @access  Private
const sendRequest = async (req, res) => {
  try {
    const { waste_id, message } = req.body;
    const requester_id = req.user.id;

    const waste = await WasteItem.findById(waste_id);
    if (!waste) {
      return res.status(404).json({ message: 'Waste item not found' });
    }

    if (waste.status !== 'available') {
      return res.status(400).json({ message: 'This item is no longer available' });
    }

    if (waste.user_id.toString() === requester_id) {
      return res.status(400).json({ message: 'You cannot request your own item' });
    }

    const newRequest = await Request.create({
      waste_id,
      requester_id,
      owner_id: waste.user_id,
      message
    });

    await sendNotification(
      waste.user_id, 
      'Request Sent', 
      `${req.user.name || 'Someone'} has requested your item: ${waste.title}`
    );

    res.status(201).json({ message: 'Request sent successfully', requestId: newRequest._id });
  } catch (error) {
    console.error('Send request error:', error);
    res.status(500).json({ message: 'Server error while sending request' });
  }
};

// @desc    Aaveli request accept karva mate
// @route   PUT /api/requests/:id/accept
// @access  Private
const acceptRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.owner_id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to accept this request' });
    }

    request.status = 'accepted';
    await request.save();
    
    await WasteItem.findByIdAndUpdate(request.waste_id, { status: 'pending' });
    
    await sendNotification(
      request.requester_id,
      'Request Accepted',
      `Your request for an item has been accepted by the owner!`
    );
    
    res.json({ message: 'Request accepted successfully' });
  } catch (error) {
    console.error('Accept request error:', error);
    res.status(500).json({ message: 'Server error while accepting request' });
  }
};

// @desc    Aaveli request reject (cancel) karva mate
// @route   PUT /api/requests/:id/reject
// @access  Private
const rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.owner_id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to reject this request' });
    }

    request.status = 'rejected';
    await request.save();
    
    res.json({ message: 'Request rejected' });
  } catch (error) {
    console.error('Reject request error:', error);
    res.status(500).json({ message: 'Server error while rejecting request' });
  }
};

// @desc    Request complete karva (exchanged) ane points aapva mate
// @route   PUT /api/requests/:id/complete
// @access  Private
const completeRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.owner_id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to complete this request' });
    }

    let paymentScreenshot = null;
    if (req.file) {
      paymentScreenshot = `/uploads/payments/${req.file.filename}`;
    }

    request.status = 'completed';
    await request.save();
    
    await WasteItem.findByIdAndUpdate(request.waste_id, { status: 'exchanged' });
    
    const waste = await WasteItem.findById(request.waste_id);

    // CIRCULAR ECONOMY: Award points via GreenPointService
    await GreenPointService.awardForExchange(request.owner_id, request.requester_id, waste.price);
    
    // Delete chat history
    await Chat.deleteMany({
      $or: [
        { sender_id: request.owner_id, receiver_id: request.requester_id },
        { sender_id: request.requester_id, receiver_id: request.owner_id }
      ]
    });
    
    res.json({ 
      message: 'Transaction completed! Points have been awarded to both users.',
      paymentScreenshot 
    });
  } catch (error) {
    console.error('Complete request error:', error);
    res.status(500).json({ message: 'Server error while completing request' });
  }
};

// Helper for formatting requests to match previous SQL structure (Purana structure sathe match karva)
const formatRequests = (requests) => {
  return requests.map(req => {
    const obj = req.toJSON();
    if (obj.requester_id) {
      obj.requester_name = obj.requester_id.name;
      obj.requester_id = obj.requester_id.id;
    }
    if (obj.waste_id) {
      obj.waste_title = obj.waste_id.title;
      obj.waste_image = obj.waste_id.image_url;
      obj.waste_id = obj.waste_id.id;
    }
    return obj;
  });
};

// @desc    Potana kachra par aaveli request jova mate (Incoming requests)
// @route   GET /api/requests/incoming
// @access  Private
const getIncomingRequests = async (req, res) => {
  try {
    const requests = await Request.find({ owner_id: req.user.id })
      .populate('requester_id', 'name')
      .populate('waste_id', 'title image_url')
      .sort({ created_at: -1 });
      
    res.json(formatRequests(requests));
  } catch (error) {
    console.error('Incoming requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Pote kareli requests jova mate (Outgoing requests)
// @route   GET /api/requests/outgoing
// @access  Private
const getOutgoingRequests = async (req, res) => {
  try {
    const requests = await Request.find({ requester_id: req.user.id })
      .populate('requester_id', 'name')
      .populate('waste_id', 'title image_url')
      .sort({ created_at: -1 });
      
    res.json(formatRequests(requests));
  } catch (error) {
    console.error('Outgoing requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  sendRequest,
  acceptRequest,
  rejectRequest,
  completeRequest,
  getIncomingRequests,
  getOutgoingRequests
};
