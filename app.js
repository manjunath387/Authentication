//jshint esversion:6
const dotenv = require("dotenv");
const express = require('express');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const encrypt=require("mongoose-encryption")
const async = require('hbs/lib/async');

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

//using the mongoose encryption plugin to encrypt data
userSchema.plugin(encrypt, { secret: process.env.SECRET,encryptedFields:["password"]});


// create model User
const User = new mongoose.model("User", userSchema);



app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password:req.body.password
    })
    if (newUser.save()) {
        res.render("secrets");
   }
})

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        User.findOne({ email: username }).then((user) => {
           if (user.password === password) {
                    res.render("secrets");
                }
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