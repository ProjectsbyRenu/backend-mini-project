const mongoose=require("mongoose")

mongoose.connect("mongodb://127.0.0.1.27017/miniproject")

const userSchema=mongoose.Schema({
    username:String,
    email:String,
    age:NUmber,
    password:String
})

module.exports=mongoose.model("mini","userSchema")