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

// Request na badha routes protected che (Login farjiyat che)
router.use(protect);

// Route: /api/requests (Navi request moklava mate)
router.post('/', sendRequest);

// Incoming/Outgoing (Aaveli ane mokleli requests jova)
router.get('/incoming', getIncomingRequests);
router.get('/outgoing', getOutgoingRequests);

// Status updates (Request ne accept, reject ke complete karva)
router.put('/:id/accept', acceptRequest);
router.put('/:id/reject', rejectRequest);
router.put('/:id/complete', upload.single('paymentScreenshot'), completeRequest); // complete vakhte payment no screenshot pan upload thai shake

module.exports = router;
