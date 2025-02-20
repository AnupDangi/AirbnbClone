if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const ejs=require("ejs");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const flash=require("connect-flash");

//for cloud mongodb storage
const MongoStore = require('connect-mongo');  

//require passport package for  user authentication 
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");

//set up ejs
app.set("view engine","ejs");//to start view engine
app.set("views",path.join(__dirname,"views"));//join the path of to start server outside the main project
app.use(express.urlencoded({extended:true}));   //for parsing post body

app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);//it used as 

//static files 
app.use(express.static(path.join(__dirname, "public"))); 


//create mongodb connection
const dbUrl=process.env.ATLASDB_URL;

// console.log(dbUrl);

main().then(()=>{
    console.log("connected to db");
}) 
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(dbUrl);
};



//router path
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const { copyFileSync } = require('fs');


const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
       secret:process.env.SECRET,
    },
    touchAfter: 24*3600,//in secs
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION ERROR",err);
});

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookies:{//ie 7 days
        expires:Date.now()+7*24*60*60*1000, //stores in milliseconds 
        maxAge:7*24*60*60*1000,
        htppOnly:true,
    },
};



app.use(session(sessionOptions));
app.use(flash());//use flash before routes code

//use passport as middleware for intialize when request comes
app.use(passport.initialize());
//we start session for passport
app.use(passport.session());//maintain session for a session while browsing through out the webpage

// use static authenticate method of model in LocalStrategy
passport.use(new localStrategy(User.authenticate()));//authenticate using localStartegy

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//middleware for session cookies using flash and locals
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

//demo user
// app.get("/demouser",async(req,res)=>{
//     let fakeuser=new User({
//         email:"student@gmail.com",
//         username:"delta-student", //passport local cretes this field automatically even if not defined in schema
//     });

//      let registeredUser=await User.register(fakeuser,"helloworld");  //format usermodel ,password
//      res.send(registeredUser);
// });  

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


app.get("/",async (req,res)=>{
    res.redirect("/listings");
});

//random route page not found 
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
});


//Using custom Error handling
app.use((err,req,res,next)=>{
    let{status=500,message="something went wrong"}=err;
    // res.status(status).send(message);
    // res.render("error.ejs",{err});
    res.status(status).render("error.ejs",{message});
});


//Middleware Error  handler 
// app.use((err,req,res,next)=>{
//     res.send("Something went wrong");
// });

app.listen(8080,()=>{
    console.log("server is listening to 8080");
});