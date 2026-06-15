const express = require('express');
const router = express.Router();
const {
  sendRequest,
  acceptRequest,
  rejectRequest,
  completeRequest,
  getIncomingRequests,
  getOutgoingRequests
} = require('../controllers/requestController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// All request routes are protected
router.use(protect);

// Route: /api/requests
router.post('/', sendRequest);

// Incoming/Outgoing
router.get('/incoming', getIncomingRequests);
router.get('/outgoing', getOutgoingRequests);

// Status updates
router.put('/:id/accept', acceptRequest);
router.put('/:id/reject', rejectRequest);
router.put('/:id/complete', upload.single('paymentScreenshot'), completeRequest);

module.exports = router;
