const express = require('express');
const router = express.Router();
const User = require('./../Models/user');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

require('dotenv').config();


// SIGN UP
router.post('/signup', async (req, res) => {
    console.log('hi');
    try {
        let {name,email, password } = req.body;

        name=name.trim();
        email=email.trim();
        password=password.trim();
        if (!name || !email || !password) {
            return res.status(401).json({
                status: "Failed",
                message: "Empty input fields"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                status: "Failed",
                message: "User already exists"
            });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();
        res.status(200).json({
            status: "Success",
            message: "Signup successful",
            data: savedUser
        });

    } catch (error) {
        console.error(" Error in signup:", error);
        res.status(500).json({
            status: "Failed",
            message: "An internal error occurred"
        });
    }
});

// SIGN IN (You can implement this here)
router.post('/signin', async (req, res) => {
    console.log("hii");
    try{
        let {email,password}=req.body;
        email = email?.trim();
        password = password?.trim();

        if (!email || !password) {
            return res.status(400).json({
                status: "Failed",
                message: "Empty input fields"
            });
        }
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(401).json({
                status: "Failed",
                message: "User not exists"
            });
        }
        const hashPass=existingUser.password;
        const isMatch = await bcrypt.compare(password, hashPass);
        if (!isMatch) {
            return res.status(400).json({
                status: "Failed",
                message: "Invalid password entered"
            });
        }
        const token = jwt.sign(
            { 
                userId: existingUser._id,
                email: existingUser.email,
                name:existingUser.name
            },
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }  
        );

        res.status(201).json({
            status: "Success",
            message: "Signin successful",
            token: token
        })
    }catch (error) {
        console.error(" Error in signin:", error);
        res.status(500).json({
            status: "Failed",
            message: "An internal error occurred"
        });
    }
});

module.exports = router;
