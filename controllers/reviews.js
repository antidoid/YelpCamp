const Campground = require(`../models/campground`);
const Review = require(`../models/review`);

// Route to add the reviews for an indvidual campground
module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await Promise.all([review.save(), campground.save()]);
    req.flash(`success`, `Created new review`);
    res.redirect(`/campgrounds/${campground._id}`);
}

// DELETE route for reviews
module.exports.deleteReview = async (req, res) => {
    const { reviewId, id } = req.params;
    await Promise.all([
        Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }),
        Review.findByIdAndDelete(reviewId)
    ]);
    req.flash(`success`, `Successfully Deleted review`);
    res.redirect(`/campgrounds/${id}`);
}