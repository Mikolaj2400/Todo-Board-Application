const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const dotenv = require("dotenv").config()


const registerUser = asyncHandler(async (req,res) => {

    const {email, password} = req.body
    if(!email || !password) {
        res.status(400)
        throw new Error("All fields are mandatory")
    }

    const userAvailable = await User.findOne({email})
    if(userAvailable) {
        res.status(400)
        throw new Error("Email already used")
    }

    //hashing password
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
        email,
        password: hashedPassword
    })
    console.log(`user created ${user}`)
    if(user) {
        res.status(200),
        res.json({_id: user.id, email: user.email})
    }else {
        res.status(400)
        throw new Error("User data is not valid")
    }
})

const loginUser = asyncHandler(async (req,res) => {

    const {email, password} = req.body
    if(!email || !password) {
        res.status(400)
        throw new Error("All fields are mandatory")
    }

    const user = await User.findOne({email})
    //compare password
    if(user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign(
            {
            user: {
                email: user.email,
                id: user.id,
            },
            }, process.env.ACCESS_TOKEN_SECRET, 
            {expiresIn: '1h'}
        )
        res.status(200)
        res.json({accessToken})
    }else {
        res.status(401)
        throw new Error("Email or password is not correct")
    }
})


const currentUser = asyncHandler(async (req,res) => {

    res.json(req.user)
 
})

module.exports = {registerUser, loginUser, currentUser}