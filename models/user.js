const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");//plugin for mongoose 

const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    },
    //automatically creates add salted and hashed username and password
});

//add plugin to mongodb
userSchema.plugin(passportLocalMongoose);


module.exports=mongoose.model("User",userSchema);

