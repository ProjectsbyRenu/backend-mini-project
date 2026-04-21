const cookieParser = require("cookie-parser")
const express=require("express")
const app=express()

const multer=require("multer")
const crypt=require("crypto")
const path=require("path")

app.set("view engine","ejs")

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

const storage= multer.diskStorage({
  destination: function(req,file,cb){
    cb(null,"./public/images")
  },
  filename: function(req,file,cb){
    crypt.randomBytes(12,(err,bytes)=>{
      const fn = bytes.toString("hex") + path.extname(file.originalname)
      cb(null,fn)
    })
  }
})

const upload =multer({storage:storage})

module.exports=upload;

