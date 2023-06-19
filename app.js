//jshint esversion:6
const dotenv = require("dotenv");
const express = require('express');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const async = require('hbs/lib/async');
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

app.set("view engine", 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();

app.use(session({
    secret: " This is my Long String.",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize()); //to initialize passport to app
app.use(passport.session());//to use session


// database setup
if (mongoose.connect('mongodb://127.0.0.1:27017/userDB')) {
    console.log("database connected");
} else { console.log("database connection error") }

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});



userSchema.plugin(passportLocalMongoose);
// create model User
const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.post("/register", (req, res) => {
    User.register({ username: req.body.username }, req.body.password, (err, user) => {
        if (err) {
            console.log(err)
            res.redirect("/register")
        } else {
            passport.authenticate("local")(req, res, () => {
                res.redirect("/secrets");
            })
       }
   })
})

app.post("/login", (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password,
    });
    
    req.login(user, (err) => {
        if (err) {
                console.log(err)
        } else {
            passport.authenticate("local")(req, res, () => {
                res.redirect("/secrets");
            });
            }
        })
})

app.get("/logout", (req, res) => {
    req.logout((err) => {
        console.log(err);
    });
    res.redirect("/");
})

app.get("/", (req, res) => {
    res.render('home');
})

app.get("/register", (req, res) => {
     res.render('register');
})

app.get("/secrets", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("secrets");

    } else {
        res.redirect("/login");
    }
})
app.get("/login", (req, res) => {
     res.render('login');
})

app.listen(3000, () => {
    console.log("server is running on port 3000")
})