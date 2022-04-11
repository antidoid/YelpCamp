const Campground = require(`./models/campground`);
const Review = require(`./models/review`);
const { campgroundSchema, reviewSchema } = require(`./schemas`);
const ExpressError = require(`./utils/ExpressError`);

module.exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        // Storing the path that user wanted to visit in a session
        req.session.returnTo = req.originalUrl;
        req.flash(`error`, `You must be signed in`);
        res.redirect(`/login`);
    }
}

// Validating(server side validation) the data coming from
// new Campground form using an external library called "Joi"
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

// Authorizing(server side) to check if the  current user is the author
// of the campground
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (campground.author.equals(req.user._id)) {
        next();
    } else {
        req.flash(`error`, `You are not the Owner`);
        res.redirect(`/campgrounds/${id}`);
    }
}

// Validating the data coming from review form
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

// Checking if the current user is the author of the review
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (review.author.equals(req.user._id)) {
        next();
    } else {
        req.flash(`error`, `You are not the Owner`);
        res.redirect(`/campgrounds/${id}`);
    }
}
