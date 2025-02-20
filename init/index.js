const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../models/listing.js");


// const MONGO_URL="mongodb://127.0.0.1:27017/db_name";

main().then(()=>{
    console.log("connected to db");
})
.catch((err)=>{s
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}


const initDB=async()=>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>( //remember this is very useful method to reinitalize database with new data property
        {...obj,owner:"67b228f9331d84b94b2b26c8"})
    );
    await Listing.insertMany(initdata.data);
    console.log("data was initialized");
};

initDB();