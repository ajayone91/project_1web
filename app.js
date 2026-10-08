
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


// demo user registeration route (commented out)


// app.get("/demoUser", async (req, res) => {
//     let fakeuser = new User({
//         email: `fake@${Date.now()}123ß.com`,
//         username: `fakeUser${Date.now()}123`,
//     });

//     let registeredUser = await User.register(fakeuser, "fakepassword");
//     res.send(registeredUser);
// });


// Home Route
// app.get("/", (req, res) => {
//     res.send("Hello World");
// });


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






// const express = require('express');
// const app = express();
// const mongoose = require("mongoose");
// const Listing = require("./models/listing");
// const path = require("path");
// const methodOverride = require("method-override");
// const ejsMate = require('ejs-mate');
// const wrapasync = require("./utils/wrapasync.js");
// const ExpressError = require("./utils/ExpressError.js");
// const {listingSchema, reviewSchema} = require("./schema.js");
// const { error } = require('console');
// const Review = require("./models/review.js");
// const listings = require("./views/routes/listing.js");
// const reviews =   require("./views/routes/review.js");


// //mongooge connect

// main().then(() => {
//     console.log("Connected to MongoDB");
// }).catch((err) => {
//     console.error("Error connecting to MongoDB", err);
// });


// async function main(){
//     await mongoose.connect("mongodb://localhost:27017/mydatabase");
// }

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.use(express.static(path.join(__dirname, "public")));
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(methodOverride("_method"));
// app.engine("ejs",ejsMate);
// app.use(express.static(path.join(__dirname ,"/public")));
// app.use(express.static(path.join(__dirname, "/public")))
// //index rought 

// app.get("/",(req ,res)=> {
//     res.send("Hello World");
// });

// app.use("/listings",listings);
// app.use("/listings/:id/reviews",reviews);

 

// app.all("/*splat", (req,res,next)=>{
//     next(new ExpressError(404,"Page Not Found"));
// });

// // error handler
// app.use((err, req,res,next)=>{
//     let {statusCode = 500,message = "Something went wrong" } = err;
//     res.render("error.ejs");
//     // res.status(statusCode).send(message);

// });


// app.listen(3000, () => {
//     console.log("Server is running on port 3000");
// });





