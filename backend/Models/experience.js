const mongoose=require("mongoose");

const interviewSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    name:String,
    company:{type:String,required:true},
    role:{type:String,required:true},
    experienceLevel:String,
    rounds:Number,
    experienceText:{type:String,required:true},
    createdAt:{type:Date,default:Date.now}
});

module.exports=mongoose.model("Interview",interviewSchema);
