const express = require(`express`);
const router = express.Router();
const campgrounds = require(`../controllers/campgrounds`);
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require(`../middleware`);

const multer = require('multer');
const { storage } = require(`../cloudinary`); // We don't specify index because node automatically looks for index.js in a folder
const upload = multer({ storage });

const Campground = require('../models/campground');

router.route(`/`)
    .get(catchAsync(campgrounds.index)) //index route for all campgrounds
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground)); //Route to make a new campground -- POST

//Route to display new campground form
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route(`/:id`)
    .get(catchAsync(campgrounds.showCampground)) //show route for individual campgrounds
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground)) // Editing an individual campground using PUT route
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground)); // Deleting an individual campground using DELETE route

//Route tha serves the form for editing an campground
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;