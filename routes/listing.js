const express=require("express");
const router=express.Router();
const {listingSchema, reviewsSchema}=require("../Schema.js");
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const ExpressError=require("../utils/ExpressError.js");
//require middlewares
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listing.js");

//multer to parse multipart data
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});//cloud storage
const opencage=require("opencage-api-client");

//compact form using route for index get and post  
router.
    route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        // validateListing, 
        upload.single('listing[image]'),
        wrapAsync(listingController.createListing));


//3. Create new route and update 
//get to new form and add picture and all 
router.get("/new",isLoggedIn,wrapAsync(listingController.newListing));

        
//update and delete route
router.
    route("/:id/")
    .get(wrapAsync(listingController.renderEditform))
    .put(
        isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
       validateListing, 
       wrapAsync(listingController.updateListing))

    .delete(isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
        wrapAsync(listingController.destroyListing));


//1.index Route  get /listings ->all listing is the index route
// router.get("/",wrapAsync(listingController.index)); 


// router.post("/", validateListing, wrapAsync(listingController.createListing));

//show route
// router.get("/:id",wrapAsync(listingController.renderEditform));


//create a edit button for each id edit route 
router.get("/:id/edit",isLoggedIn,wrapAsync(listingController.Editform));


//route to display listing based on the destination city or country
// router.post("/listingsearch",wrapAsync(listingController.SearchListing));

router.post("/search",listingController.SearchListing);

//update route
// router.put("/:id", isLoggedIn,
//      isOwner,
//     validateListing, 
//     wrapAsync(listingController.updateListing));

 
//router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

module.exports=router;