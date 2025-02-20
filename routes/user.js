const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");
const {saveRedirectUrl} = require("../middleware.js");
//controller
const userController=require("../controllers/user.js");


//using router.route compact route 

router.
   route("/signup")
   .get(wrapAsync
    (userController.renderSignup))
   .post
   (wrapAsync(userController.createUser));

 
//router for login 
router. 
     route("/login")
      .get(wrapAsync
        (userController.renderLogin)
      )
      .post(
        saveRedirectUrl,
        passport.authenticate("local",
        {failureRedirect:'/login',failureFlash:true}),
        userController.validateUser
    );



//render signup form
// router.get("/signup",userController.renderSignup);

//post new user
// router.post("/signup",
//     wrapAsync(userController.createUser));

//login form 
// router.get("/login",
//     wrapAsync(userController.renderLogin));

// //validate login 
// router.post(
//     "/login",
//     saveRedirectUrl,
//     passport.authenticate("local",
//     {failureRedirect:'/login',failureFlash:true}),
//     userController.validateUser);


//logout route 
router.get("/logout",userController.logoutUser);

module.exports=router;