const Campground = require(`../models/campground`);
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require(`../cloudinary`);

//index route for all campgrounds
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

//Route to display new campground form
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

//Route to make a new campground -- POST
module.exports.createCampground = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    req.flash(`success`, `Successfully made a new campground`);
    res.redirect(`/campgrounds/${campground._id}`);
}

//show route for individual campgrounds
module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: `reviews`,
        populate: {
            path: `author`
        }
    }).populate(`author`);
    if (campground) {
        res.render('campgrounds/show', { campground });
    } else {
        req.flash(`error`, `Cannot find that campground`);
        res.redirect(`/campgrounds`);
    }
}

//Route tha serves the form for editing an campground
module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash(`error`, `Cannot find that campground`);
        return res.redirect(`/campgrounds`);
    }
    res.render('campgrounds/edit', { campground });
}

//Editing an individual campground using PUT route
module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash(`success`, `Successfully updated Campground`);
    res.redirect(`/campgrounds/${campground._id}`);
}

//Deleting an individual campground using DELETE route
module.exports.deleteCampground = async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash(`success`, `Successfully Deleted Campground`);
    res.redirect('/campgrounds');
}