const Listing = require("./models/listing.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewsSchema}=require("./Schema.js");
const Review=require("./models/review.js");

const isLoggedIn=(req,res,next)=>{  
    if(!req.isAuthenticated()){
        // console.log(req.path,"..",req.originalUrl);
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to create listing");
        return res.redirect("/login");//sent to login
    }
    next();
}


const saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

// const isOwner=async(req,res,next)=>{
//     let {id}=req.params;
//     let listing=await Listing.findById(id);
//     if(!listing.owner.equals(res.locals.currUser._id)){
//         req.flash("error","You don't have permission to edit");
//         return res.redirect(`/listings/${id}`);
//      }    
//      next();
// }

const isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    console.log("Listing Owner:", listing.owner);
    console.log("Current User:", res.locals.currUser._id);

    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission to edit");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);

    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404,errMsg);
    }
    else{
        next();
    }
}
//Validate Review Middleware
const validateReview=(req,res,next)=>{
    let {error}=reviewsSchema.validate(req.body);

    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404,errMsg);
    }
    else{
        next();
    }
}

const isReviewAuthor = async (req, res, next) => {
    let { id,reviewId } = req.params;
    let review = await Review.findById(reviewId);

    console.log("Listing Owner:", review.owner);
    console.log("Current User:", res.locals.currUser._id);

    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }

    next();
};


module.exports={isLoggedIn,saveRedirectUrl,isOwner,validateListing,validateReview,isReviewAuthor}; 