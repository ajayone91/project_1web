const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapasync = require("../../utils/wrapasync.js");
const { reviewSchema } = require("../../schema.js");
const ExpressError = require("../../utils/ExpressError.js");

const Review = require("../../models/review.js");
const Listing = require("../../models/listing.js");
const { isLoggedIn ,  isReviewAuthor} = require("../../middleware.js");

const reviewController = require("../../controllers/reviews.js");


// Validate Review Middleware
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);

    if (error) {
        let errMsg = error.details
            .map((el) => el.message)
            .join(",");

        throw new ExpressError(400, errMsg);
    }

    next();
};


// CREATE REVIEW
router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapasync(reviewController.createReview)
);


// DELETE REVIEW
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapasync(reviewController.deleteReview)
);


module.exports = router;