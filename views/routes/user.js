const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const mongoose = require("mongoose");
const passport = require("passport");
const {saveRedirectUrl} = require("../../middleware");
const userController = require("../../controllers/users.js");




router
.route("/signup")
.get((userController.renderSignupForm))
.post((userController.signup));


router
.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate("local",{
    failureRedirect:`/login`,
    failureFlash:true}),
    userController.login
    );





// for signup and fetch data
        
// router.post("/signup",(userController.signup));

// router.get("/login",userController.renderLoginForm);

// router.post("/login",saveRedirectUrl,passport.authenticate("local",{
//     failureRedirect:`/login`,
//     failureFlash:true}),
//     userController.login
//     )

router.get("/logout",userController.logout);

module.exports = router;