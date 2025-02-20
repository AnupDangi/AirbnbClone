const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../models/listing.js");
require("dotenv").config({ path: "../.env" }); 

// const MONGO_URL="mongodb://127.0.0.1:27017/db_name";
const dbUrl=process.env.ATLASDB_URL;

async function main() {
    await mongoose.connect(dbUrl);
    console.log("Connected to DB");
}

main().catch((err) => console.log(err));
console.log("Database URL:", dbUrl);

const initDB=async()=>{
    // await Listing.deleteMany({});
    //console.log("deleted successfully");
    initdata.data=initdata.data.map((obj)=>( //remember this is very useful method to reinitalize database with new data property
        {...obj,owner:"67b78322d6d94da9024eab23"})
    );
    await Listing.insertMany(initdata.data);
    console.log("data was initialized");
};

initDB();