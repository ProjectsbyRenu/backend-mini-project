const cookieParser = require("cookie-parser")
const express=require("express")
const app=express()
const bcrypt=require("bcrypt")
const userModel=require("./models/user")
const jwt= require("jsonwebtoken")

app.set("view engine","ejs")

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.get("/",(req,res)=>{
   res.render("index")
})

app.post("/create",async(req,res)=>{
  let {username,email,age,password}=req.body;

  let user= await userModel.findOne({email})
  if(user){ return res.status(500).send("user already exist")
    }
   
  bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(password,salt,async (err,hash)=>{
    let user = await userModel.create({
    username,
    email,
    age,
    password:hash
  })

  let token= jwt.sign({email:email, userid: user._id}, "shhhh")
  res.cookie("token",token)
  res.send("user registered")
 
    })
  })
  
})

app.get("/login",(req,res)=>{
  res.render("login")
})
app.post("/login",async(req,res)=>{
  let {email,password}=req.body;
  let user= await userModel.findOne({email})
  if (!user) res.send( "something went wrong ")
  else 
    bcrypt.compare(password,user.password,(err,result)=>{
  if(result) res.status(200).send("logged in")
    else  res.send( "something went wrong ")
  })
  let token= jwt.sign({email:email, userid: user._id}, "shhhh")
  res.cookie("token",token)
  res.send("user registered")
})

app.get("/profile",isLoggedIn,(req,res)=>{
  console.log(req.user)
  res.send("welcome to profile page")

})

async function isLoggedIn (req,res,next){
  if(req.cookies.token === "") res.send("you must be logged in")
    else{
  let data=await jwt.verify(req.cookies.token, "shhhh")
  req.user = data;
  }
  next();
}
app.get("/logout",(req,res)=>{
 res.cookie("token", "")
  res.redirect("/login")
})
app.listen(3001,()=>{
    console.log("server start")
})