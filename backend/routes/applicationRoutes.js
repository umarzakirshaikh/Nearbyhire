const express = require('express');
const router = express.Router();
const {
  applyJob,
  getMyApplications,
  getJobApplicants,
  getBusinessApplicantsAll,
  updateApplicationStatus,
  completeAndReview
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/:jobId/apply', protect, authorize('STUDENT'), applyJob);
router.get('/my', protect, authorize('STUDENT'), getMyApplications);
router.get('/job/:jobId', protect, authorize('BUSINESS'), getJobApplicants);
router.get('/business/all', protect, authorize('BUSINESS'), getBusinessApplicantsAll);
router.patch('/:id/status', protect, authorize('BUSINESS'), updateApplicationStatus);
router.post('/:id/complete-and-review', protect, authorize('BUSINESS'), completeAndReview);

module.exports = router;
