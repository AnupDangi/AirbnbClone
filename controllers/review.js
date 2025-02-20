const Listing=require("../models/listing");
const Review=require("../models/review");


module.exports.createReview=async(req,res)=>{ 
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);

    //authorization
    newReview.author=req.user._id;
    console.log(newReview);
    //add reviews into review array save both update listing and review
     listing.reviews.push(newReview);

     await newReview.save();
     await listing.save();
     
     console.log("new review saved");
     req.flash("success","New Review Created");
     res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview=async (req, res) => {
    let { id, reviewId } = req.params;  // Use reviewId instead of reviewID
    console.log("Listing ID:", id);
    console.log("Review ID:", reviewId);
   
    // Check if IDs are valid
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(reviewId)) {
        return res.status(400).send("Invalid Listing or Review ID");
    }
   
    // Perform the deletion
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // Pull review from reviews array
    await Review.findByIdAndDelete(reviewId);  // Delete the review itself
   
    req.flash("success","Review Deleted");
    console.log("Review Deleted Successfully");
   
    // Redirect after successful deletion
    res.redirect(`/listings/${id}`);
};