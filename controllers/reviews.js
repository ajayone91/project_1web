const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


module.exports.createReview =async (req, res) => {

        const { id } = req.params;

        const listing = await Listing.findById(id);

        if (!listing) {
            throw new ExpressError(404, "Listing not found");
        }

        const newReview = new Review(req.body.review);
        newReview.author = req.user._id;
        console.log("New Review:", newReview);

        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();

        console.log("Review:", req.body.review);
     req.flash("success", "Successfully created a new review!");


        res.redirect(`/listings/${id}`);
    };




 module.exports.deleteReview = async (req, res) => {
    
            const { id, reviewId } = req.params;
    
            await Listing.findByIdAndUpdate(
                id,
                {
                    $pull: {
                        reviews: reviewId
                    }
                }
            );
    
            await Review.findByIdAndDelete(reviewId);
         req.flash("success", "Successfully deleted the review!");
    
    
            res.redirect(`/listings/${id}`);
        };