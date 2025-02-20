const Listing=require("../models/listing");
const Map=require("maplibre-gl");//use map
const opencage=require("opencage-api-client");

module.exports.index=async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{ allListings });
}

module.exports.newListing=async(req,res)=>{
    
    res.render("listings/new.ejs");
};

//get cordinates
const getGeolocation = async (location, country) => {
    try {
        const query = `${location}, ${country}`;
        const apiKey = process.env.Geocoding_API; // Ensure this is set in your environment

        const data = await opencage.geocode({ q: query, key: apiKey });

        if (data.status.code === 200 && data.results.length > 0) {
            const place = data.results[0];
            // console.log("Formatted Address:", place.formatted);
            // console.log("Coordinates:", place.geometry);
            // console.log("Timezone:", place.annotations.timezone.name);
            return place.geometry; // Returning latitude & longitude
        } else {
            console.log("Geocoding failed:", data.status.message);
        }
    } catch (error) {
        console.log("Error:", error.message);
        if (error.status && error.status.code === 402) {
            console.log("Hit free trial daily limit.");
        }
    }
};


module.exports.createListing=async (req, res, next) => {
    const { listing } = req.body;
    let url= req.file.path;
    let filename=req.file.filename;

    // Create a new listing
    let newListing = new Listing({
        title: listing.title,
        description: listing.description,
        price: listing.price,
        country: listing.country,
        location: listing.location,
        image: {url,filename},
    });
    let coordinates=await getGeolocation(newListing.location,newListing.country);
    console.log(coordinates);
    newListing.geometry={
        type:"Point",
        coordinates:[coordinates.lng,coordinates.lat],
    },
    console.log(newListing);
    console.log(req.user);
    newListing.owner=req.user._id;
    // Save the new listing to the database
    await newListing.save();

    // Flash a success message
    req.flash("success", "New Listing Created!");

    // Log and redirect
    console.log("Saved listing to DB");
    res.redirect("/listings");
};

module.exports.renderEditform=async (req, res) => {
    let { id } = req.params;
    console.log("Received ID:", id);
    const listing = await Listing.findById(id)
    .populate({path:"reviews",
        populate:{
            path:"author",
        }
    })
    .populate("owner");

    if (!listing) {
        req.flash("error","Listing you requested for does not exists");
        res.redirect("/listings");
    }

    let coordinates=await getGeolocation(listing.location,listing.country);
    console.log(coordinates);
    listing.geometry={
        type:"Point",
        coordinates:[coordinates.lng,coordinates.lat],
    },

    console.log(listing);
    res.render("listings/show.ejs", { listing });
};

module.exports.Editform=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    console.log(listing);
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_200/w_300");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};

module.exports.updateListing=async (req, res) => {
    if(!req.body.listing){
        throw new ExpressError(404,"Send valid data for listing");
    }
   
    let { id } = req.params;
     // Check if image is provided and not empty
     if (req.body.listing.image && req.body.listing.image.trim() !== "") {
        updateData["image.url"] = req.body.listing.image; // Correct way to update image.url
    }

    let { title, description, price, location, country} = req.body.listing; // Extract listing data properly

    let updateData = { title, description, price, location, country };

    let listing = await Listing.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if(typeof req.file!=="undefined"){
        let url= req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }

    console.log("Updated listing:", listing);
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findByIdAndDelete(id);
    console.log(listing);
    req.flash("success","Listing Deleted");
    res.redirect(`/listings`); 
};
//serach listings based on query
module.exports.SearchListing = async (req, res) => {
    console.log("🔥 Full Request Body:", req.body);
    console.log("🔥 Full Request Files:", req.files || "No files uploaded");

    let { destination } = req.body;

    if (!destination) {
        req.flash("error", " Destination is required!");
        return res.redirect("/listings");
    }

    console.log("✅ Destination:", destination);

    let query = { 
        $or: [
            { country: destination },  
            { location: destination }
        ]
    };

    try {
        
        let searchedListings = await Listing.find(query);
        
        if (searchedListings.length === 0) {
            req.flash("error", " No listings found for the searched destination.");
            return res.redirect("/listings");
        }

        console.log("🔍 Found Listings:", searchedListings);

        
        res.render("listings/index.ejs", { allListings: searchedListings });
    } catch (err) {
        console.error(" Error fetching Listings:", err);
        req.flash("error", "Sorry, could not get the destination based on search.");
        res.redirect("/listings");
    }
};
