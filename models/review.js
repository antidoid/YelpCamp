const mongoose = require('mongoose');
//creating a schortcut for mongoose.Schema because we will refer to it a lot
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: `User`
    }
})

module.exports = mongoose.model('Review', reviewSchema);