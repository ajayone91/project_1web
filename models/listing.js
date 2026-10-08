const mongoose = require('mongoose');
const review = require('./review');
const Review = require("./review.js");
const Schema = mongoose.Schema;
const listingCategories = require("../utils/listingCategories.js");


const listingSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    image: {
        url: String,
        filename: String,
    },
    price: { type: Number, required: true },
    category: {
        type: String,
        enum: listingCategories.map(({ name }) => name),
    },
    location : String,
    country: String,
    images: [String],
    reviews: [{
            type:Schema.Types.ObjectId,
            ref:"Review",
    },
  
    ], 
     owner: { type: Schema.Types.ObjectId, 
        ref: "User" ,
    },
    geometry: {
        type: { type: String, default: "Point" },
    coordinates: { type: [Number], default: [0, 0] }
    }
});

listingSchema.post('findOneAndDelete', async function (listing) {
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;