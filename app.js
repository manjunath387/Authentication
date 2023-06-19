//jshint esversion:6
const dotenv = require("dotenv");
const express = require('express');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const async = require('hbs/lib/async');
const bcrypt = require('bcrypt');
const saltRounds = 10;
app.set("view engine", 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();
// database setup
if (mongoose.connect('mongodb://127.0.0.1:27017/userDB')) {
    console.log("database connected");
}else{console.log("database connection error")}
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});



// create model User
const User = new mongoose.model("User", userSchema);



app.post("/register", (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
        email: req.body.username,
        password: hash
    })
    if (newUser.save()) {
        res.render("secrets");
   }
});
    
})

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        User.findOne({ email: username }).then((user) => {
           bcrypt.compare(password, user.password, function(err, result) {
               if (result === true) {
                   res.render("secrets");
    }
});
        })
    } catch (error) {
        console.log(error);
    }
})

app.get("/", (req, res) => {
    res.render('home');
})

app.get("/register", (req, res) => {
     res.render('register');
})

app.get("/login", (req, res) => {
     res.render('login');
})

app.listen(3000, () => {
    console.log("server is running on port 3000")
})