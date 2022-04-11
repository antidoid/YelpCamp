const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const Review = require(`../models/review`);

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database Connected");
});

// A function to pick a random element out of an array
const sample = array => array[Math.floor(Math.random() * array.length)];

//creates 50 random campgrounds
const seedDB = async () => {
    await Promise.all([Campground.deleteMany({}), Review.deleteMany({})]);
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: `60b0b471ca6aa70aa8e44cb1`,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi repellendus facilis consequuntur, asperiores, repudiandae aut amet provident voluptate minima recusandae dolorum error labore culpa libero dolor nostrum? Dicta, porro laboriosam',
            price,
            images: [
                {
                    url: 'https://res.cloudinary.com/divwvlpxx/image/upload/v1622703495/Yelpcamp/fgoe6bgqhx0xbfg7wdod.jpg',
                    filename: 'Yelpcamp/fgoe6bgqhx0xbfg7wdod'
                },
                {
                    url: 'https://res.cloudinary.com/divwvlpxx/image/upload/v1622703498/Yelpcamp/mgnfp7dyor8emht75d5b.jpg',
                    filename: 'Yelpcamp/mgnfp7dyor8emht75d5b'
                },
                {
                    url: 'https://res.cloudinary.com/divwvlpxx/image/upload/v1622703498/Yelpcamp/e2zkoxf7xswj3l3ewybc.jpg',
                    filename: 'Yelpcamp/e2zkoxf7xswj3l3ewybc'
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    db.close();
})