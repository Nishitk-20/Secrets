  
//jshint esversion : 6
require("dotenv").config();
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const port = 3000;
const app = express();
mongoose.connect("mongodb://localhost:27017/userDB",
{
    useNewUrlParser:true, 
    useUnifiedTopology: true,  
    useFindAndModify: false
});

app.set("view engine",'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

const userSchema = new mongoose.Schema({
    email : String,
    password : String
});

const User = mongoose.model("User",userSchema);


app.get("/",function(req,res){
    res.render("home");
});


app.get("/login",function(req,res){
    res.render("login");
});


app.get("/register",function(req,res){
    res.render("register");
});


app.post("/register",function(req,res){
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newU = new User({
        email:req.body.username,
        password:hash
    })

    newU.save(function(err){
        if(err){
            console.log(err);
        }
        else{
            res.render("secrets");
        }
    });
});

app.get("/logout",function(req,res){
    res.redirect("/");
})

app.post("/login",function(req,res){
    const e = req.body.username;
    const p = (req.body.password);
    // console.log(p);

    User.findOne({email:e},function(err,foundUser){
        if(!err){
            if(foundUser!=null){
                // console.log(foundUser.password);
                if (bcrypt.compareSync(p, foundUser.password)) {
                    res.render("secrets");
                }
                else{
                    res.send("Wrong password!");
                }
            }           
            else{
                console.log("Didn't matched password");
            }
        }
        else{
            console.log(err);
        }
    })
});

app.listen(port,function(){
    console.log("Server started on port "+port);
});