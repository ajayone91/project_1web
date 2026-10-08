const Listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");



    module.exports.isLoggedIn = (req, res, next) => {
        if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be signed in first!");
        return res.redirect("/login");
    }
    next();
}    

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isowner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    if (!res.locals.currentUser || !listing.owner || !listing.owner.equals(res.locals.currentUser._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};


module.exports.validateListing = (req,res,next)=>{
    if (req.file) {
        req.body.listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    const schema = req.method === "PUT"
        ? listingSchema.fork(["listing.image"], (field) => field.optional())
        : listingSchema;
    let{error}=schema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg) ;
    }else{
        next();
    }

};


module.exports.validateReview = (req,res,next)=>{
 
    let{error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg) ;
    }else{
        next();
    }

};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { reviewId, id } = req.params;
    const review = await Review.findById(reviewId);

    if (!review) {
        req.flash("error", "Review not found!");
        return res.redirect(`/listings/${id}`);
    }

    if (!res.locals.currentUser || !review.author.equals(res.locals.currentUser._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};
         