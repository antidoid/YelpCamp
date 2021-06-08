const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;
const passportLocalMongoose = require(`passport-local-mongoose`); // Tool to help us to implement authentication easily in our app

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// This will add a feild for username and password(hash & salt) to our schema
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model(`User`, userSchema);