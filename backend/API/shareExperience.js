const express=require("express")
const router=express.Router()
const Experience=require("../Models/experience");
const mongoose = require("mongoose");
const Interview=require("../Models/session")

router.post("/shareExperience",async(req,res)=>{
    try{
        const interview=new Experience(req.body);
        await interview.save();
        res.status(201).json({message:"submitted for review!"});

    }catch(err){
        res.status(500).json({error:err.message});
    }
})


router.get("/interviews",async(req,res)=>{
    try{
        const allExperience=await Experience.find().sort({created:-1});
        res.json(allExperience);
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
})


const jwt = require("jsonwebtoken");

router.get("/myCount", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ message: "Unauthorized" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const rawId = decoded._id || decoded.id || decoded.userId;

    if (!rawId) return res.status(401).json({ message: "Invalid token" });

    const userId = new mongoose.Types.ObjectId(rawId);
    const count = await Interview.countDocuments({ userId });

    res.json({ count });
  } catch (err) {
    console.error("myCount error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;

