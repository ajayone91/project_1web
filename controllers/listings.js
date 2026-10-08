const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const listingCategories = require("../utils/listingCategories.js");
const mapToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });




module.exports.index = async (req, res) => {
    const search = typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";
    const category = typeof req.query.category === "string"
        ? req.query.category
        : "";
    if (category && !listingCategories.some(({ name }) => name === category)) {
        throw new ExpressError(400, "Invalid listing category");
    }

    const filter = {};
    if (category) {
        filter.category = category;
    }
    if (search) {
        filter.$or = ["title", "location", "country"].map((field) => ({
            [field]: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" },
        }));
    }
    const allListing = await Listing.find(filter);
    res.render("listings/index", {
        allListing,
        search,
        selectedCategory: category,
        listingCategories,
    });
};


module.exports.renderNewForm = async (req, res) =>{
    res.render("listings/new.ejs", { listingCategories });
}; 




module.exports.showListing = async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path:"reviews", populate: {path: "author"}})
    .populate("owner");
    if(!listing){
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");

    }
    res.render("listings/show", { listing });
};


module.exports.createNewListing = async (req, res) => {
    const listingData = req.body.listing;
    if (!listingData) {
        throw new ExpressError(400, "Please provide valid listing details");
    }
    if (!req.file) {
        throw new ExpressError(400, "Please upload a listing image");
    }

    const response = await geocodingClient.forwardGeocode({
        query: listingData.location,
        limit: 1
    }).send();
    const geometry = response.body?.features?.[0]?.geometry;
    if (!geometry) {
        throw new ExpressError(400, "Location not found. Please enter a valid location.");
    }

    const listing = new Listing(listingData);
    listing.owner = req.user._id;
    listing.image = { url: req.file.path, filename: req.file.filename };
    listing.geometry = geometry;
    await listing.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async ( req, res )=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
   
    req.flash("success", "Successfully updated listing!");
    if(!listing){
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    let orginalImageurl = listing.image.url;
    originalImageurl = orginalImageurl.replace("/uploade", "uploade/W_250");
    res.render("listings/edit.ejs", { listing, originalImageurl, listingCategories });
   

};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    Object.assign(listing, req.body.listing);

   if(typeof req.file !== "undefined"){
   let url = req.file.path;
   let filename = req.file.filename;
   listing.image = { url, filename };
   await listing.save();
}
    req.flash("success", "Successfully updated listing!");
    res.redirect(`/listings`);
    
};


module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndDelete(id);
    console.log(listing);
    req.flash("success", "Successfully deleted the listing!");
    res.redirect(`/listings`);
};
