const User = require("../models/user");




module.exports.renderSignupForm =  (req, res) => {

    res.render("users/signup");
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs")

};

module.exports.signup = async (req,res)=>{

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
};


module.exports.login = async(req,res)=>{
        req.flash("success", "Welcome back to wonderlust you are logged in");
        res.redirect(res.locals.redirectUrl||'/listings');
      
          
};

module.exports.logout =(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "You are logged out");
        res.redirect("/listings");

    } );
};