const express=require("express");
const router=express.Router({mergeParams:true});
const ExpressError=require("../utils/ExpressError.js");
const {reviewsSchema}=require("../Schema.js");
const Review=require("../models/review.js");
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const mongoose=require("mongoose");
const {validateReview,isLoggedIn, isReviewAuthor}=require("../middleware.js");
const ReviewController = require("../controllers/review.js");


//review route to store in backend 
router.post("/",isLoggedIn,
    validateReview
    ,wrapAsync(ReviewController.createReview));

//delete review route
router.delete("/:reviewId", 
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(ReviewController.destroyReview));

module.exports=router;