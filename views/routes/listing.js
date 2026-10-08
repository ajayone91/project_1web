const express = require("express");
const router = express.Router();
const wrapasync = require("../../utils/wrapasync.js");

const Listing = require("../../models/listing.js");
const Review = require("../../models/review.js");
const { isLoggedIn ,validateListing,isowner } = require("../../middleware.js");
const{validateReview} = require("../../middleware.js");
const listingController = require("../../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../../cloudeConfig.js");

const upload = multer({ storage });






router.route("/")
.get(wrapasync(listingController.index))
.post(isLoggedIn,
upload.single("listing[image]"),
validateListing,
wrapasync(listingController.createNewListing))

// .post(upload.single("listing[imageUrl]"),(req,res) =>{
//     res.send("file uploaded successfully" ,req.file);
// });
// index rought
//  router.get("/", wrapasync(listingController.index));
// new rought 

router.get("/new", isLoggedIn, wrapasync(listingController.renderNewForm));

// edit route
router.get(
    "/:id/edit",
    isLoggedIn,
    isowner,
    wrapasync(listingController.renderEditForm)
); 
router.route("/:id")
.get( wrapasync(listingController.showListing))
.put(isLoggedIn,isowner, 
  upload.single("listing[image]"),
  validateListing,
wrapasync(listingController.updateListing))
.delete(
     isLoggedIn,
     isowner,
     wrapasync(listingController.deleteListing)
);




// create  new listing rought

// router.post("/", isLoggedIn, wrapasync(listingController.createNewListing));


  //    show rought in detaild

//   router.get("/:id", wrapasync(listingController.showListing));

// edit rought 
// router.get("/:id/edit", isLoggedIn,isowner, wrapasync(listingController.renderEditForm));
 

// update rought 
// router.put("/:id", isLoggedIn,isowner, wrapasync(listingController.updateListing));

// delete rought 
// router.delete("/:id",
//      isLoggedIn,
//      isowner,
//      wrapasync(listingController.deleteListing)
// );

module.exports = router;