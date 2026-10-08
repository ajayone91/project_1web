
require("dotenv").config();

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const ExpressError = require("./utils/ExpressError.js");

const listingsRouter = require("./views/routes/listing.js");
const reviewsRouter = require("./views/routes/review.js");
const userRouter = require("./views/routes/user.js");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");





async function main() {
    const mongoUri = process.env.ALTASDB;
    if (!mongoUri) {
        throw new Error("ALTASDB is not set in the environment");
    }

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
}


// EJS Setup
app.set("view engine", "ejs");

app.set(
    "views",
    path.join(__dirname, "views")
);

app.engine("ejs", ejsMate);


// Middlewares
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(methodOverride("_method"));

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);


const store = MongoStore.create({
    mongoUrl: process.env.ALTASDB,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600, // time period in seconds
});

store.on("error", function (e) {
    console.log("Session store error", e);
}); 





// Session and Flash Configuration
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
};
app.use(session(sessionOptions));
app.use(flash());

// Passport Configuration 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




// Flash Messages Middleware
app.use((req,res,next)=>{
    res.locals.massage = req.flash("success");      
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    res.locals.currUser = req.user;
    next();
});



// Home Route
app.get("/", (req, res) => {
    res.redirect("/listings");
});

// Listing Routes
app.use(
    "/listings",
    listingsRouter
);


// Review Routes
app.use(
    "/listings/:id/reviews",
    reviewsRouter
);

// User Routes
app.use(
    "/",
    userRouter
);
// 404 Route
app.all("/*splat", (req, res, next) => {

    next(
        new ExpressError(
            404,
            "Page Not Found"
        )
    );

});


// Error Handler
app.use((err, req, res, next) => {

    let {
        statusCode = 500,
        message = "Something went wrong"
    } = err;

    console.log(err);

    res
        .status(statusCode)
        .render(
            "error.ejs",
            {
                message
            }
        );

});


main().catch((err) => {
    console.error("Error connecting to MongoDB", err);
    process.exitCode = 1;
});










