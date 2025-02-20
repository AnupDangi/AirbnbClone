const User=require("../models/user.js");

module.exports.renderSignup=async(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.createUser=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
                req.flash("success","Welcome to waderlust!");
                res.redirect("/listings");
        });
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
};


module.exports.renderLogin=async(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.validateUser= async(req,res)=>{
    req.flash("success","Welcome back to WanderLust!");
    let redirectUrl=res.locals.redirectUrl || "/listings"; //default
    res.redirect(redirectUrl); 
};

module.exports.logoutUser=(req,res)=>{
    req.logout((err)=>{
    if(err){
        return next(err);
    }
    req.flash("success","You are logged out now!");
    res.redirect("/listings");
  });
};
