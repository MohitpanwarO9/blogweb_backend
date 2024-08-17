const asyncHandler = require("express-async-handler");
const User = require("../models/userModels");
const dotenv = require('dotenv').config();
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRETKEY;
const salt = bcrypt.genSaltSync(10);

const userRegister = asyncHandler(async (req , res) =>{
    const {username, email, password} = req.body;

    if(!username || !email || !password){
        res.status(400);
        throw new Error("All field are mandatory");
    }

    const userPresent = await User.findOne({email});
    if(userPresent){
        res.status(400);
        throw new Error("User already register");
    }
    try {
            const user = await User.create({
                username,
                email,
                password:bcrypt.hashSync(password,salt)
            });

            res.status(201).json({_id: user.id, email: user.email, username: user.username});
            return; 
    } catch (error) {
        res.status(400).json({message : "user not created"});
    }
    
})

const userLogin = asyncHandler(async (req , res)=>{
    
    const {email , password} = req.body;
    if(!email && !password){
        res.status(400);
        throw new Error("All field are mandatory");
    }

    const user = await User.findOne({email});
    if(!user){
        res.status(404).json('userNot found');
        return;
    }
    const passOk = bcrypt.compareSync(password,user.password);
    if(passOk){
        jwt.sign({username:user.username, id:user._id}, secretKey, {},(err,token)=>{
            if(err) throw err;
            res.status(200).cookie('token',token).json({
                id: user._id,
                username : user.username
            });
        });
    }else{
        res.status(400).json('wrong credentials');
        return;
    }
         
})

const checkUser = asyncHandler(async (req , res)=>{
    const {token} = req.cookies;
    if(!token){
        res.status(400).json("user Not login ");
        return;
    }
    jwt.verify(token,secretKey,{},(err , userInfo)=>{
        if(err){
            res.json(400).json("user Not login")
            throw err
        }
        res.status(200).json(userInfo);
    });
})

const userLogout = asyncHandler(async (req,res)=>{
    res.status(200).cookie('token' , '').json('ok');
})

module.exports = {userRegister,userLogin,checkUser,userLogout};