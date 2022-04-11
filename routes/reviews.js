const express = require(`express`);
const router = express.Router({ mergeParams: true });
const reviews = require(`../controllers/reviews`);
const catchAsync = require('../utils/catchAsync');
const { validateReview, isLoggedIn, isReviewAuthor } = require(`../middleware`);

const Campground = require('../models/campground');
const Review = require('../models/review');

// Route to create a new review for an indvidual campground
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

// DELETE route for reviews
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;