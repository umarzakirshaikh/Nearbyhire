const express = require('express');
const router = express.Router();
const {
  getNearbyJobs,
  getUrgentJobs,
  getJobById,
  createJob,
  getMyBusinessJobs,
  updateJob,
  deleteJob
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/nearby', getNearbyJobs);
router.get('/urgent', getUrgentJobs);
router.get('/my/listings', protect, authorize('BUSINESS'), getMyBusinessJobs);
router.get('/:id', getJobById);
router.post('/', protect, authorize('BUSINESS'), createJob);
router.put('/:id', protect, authorize('BUSINESS'), updateJob);
router.delete('/:id', protect, authorize('BUSINESS'), deleteJob);

module.exports = router;
