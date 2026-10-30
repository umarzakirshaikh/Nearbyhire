/**
 * Calculates dynamic student reliability score (0 - 100%)
 * based on completed gigs count, ratings, and feedback.
 */
const calculateReliabilityScore = (completedGigs, averageRating, totalApplications = 1) => {
  if (!completedGigs || completedGigs === 0) {
    return 95; // Default welcoming score for new verified students
  }

  const completionRatio = Math.min(completedGigs / Math.max(totalApplications, 1), 1);
  const ratingRatio = (averageRating || 5.0) / 5.0;

  // 60% weight on rating quality, 40% on completion consistency
  const score = Math.round((ratingRatio * 60) + (completionRatio * 40));
  return Math.min(Math.max(score, 50), 100);
};

module.exports = { calculateReliabilityScore };
