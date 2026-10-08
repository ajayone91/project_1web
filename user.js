const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const mongoose = require("mongoose");
const passport = require("passport");
const {saveRedirectUrl} = require("../../middleware");


router.get("/signup", (req, res) => {

    res.render("users/signup");
});

// for signup and fetch data
        
router.post("/signup",async (req,res)=>{

    try{
    let {username,email,password} = req.body;
    const newUser = new User({email,username});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.flash("success", "Signed Up");
    res.redirect("/listings");
} catch(err){
    req.flash("error", err.message);
    res.redirect("/signup");
}
});

router.get("/login",(req,res)=>{
    res.render("users/login.ejs")

});

router.post("/login",saveRedirectUrl,passport.authenticate("local",{
    failureRedirect:`/login`,
    failureFlash:true}),
    async(req,res)=>{
        req.flash("success", "Welcome back to wonderlust you are logged in");
    
        
})

router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "You are logged out");
        res.redirect("/listings");

    });
});

module.exports = router;