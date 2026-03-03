const express=require("express")
const router=express.Router()
const Experience=require("../Models/experience");


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

module.exports = router;

