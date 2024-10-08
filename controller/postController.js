const asyncHandler = require("express-async-handler");
const Post = require('../models/postModels');
const dotenv = require('dotenv').config;
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { userInfo } = require("os");
const secretKey = process.env.SECRETKEY;

const postCreate = asyncHandler(async (req, res) =>{
    const {token} = req.cookies;
    const {originalname, path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length-1];
    const newPath = path +'.'+ext;

    fs.renameSync(path, newPath);
    
    let checkToken =null;
    jwt.verify(token,secretKey,{},(err , userInfo)=>{
        if(err){
            res.json(400).json("user Not login")
            throw err
        }
        checkToken = userInfo;
    });

    if(checkToken)
    {
        const {title,summary,content} = req.body;
        try{
            const post = await Post.create({
                title,
                summary,
                content,
                coverphoto : newPath,
                author:checkToken.id,
            });
            res.status(200).json({_id:post._id,title:post.title,coverImg :post.coverphoto});
        }catch(err){
            console.log(err);
            res.status(400).json({message : "User not created"});
        }
    }else{
        res.json(400).json("user Not login")
    }
        
})

const getPost = asyncHandler(async (req,res) =>{

    try{
        const posts = await Post.find().populate('author',['username']);
        res.status(200).json(posts);
    }catch(error){
        console.log(error);
        res.status(400).json({message :"fail to get posts"});
    }
})

const getSpecificPost = asyncHandler(async (req,res)=>{
    
    const id = req.params.id;
    try{
        const post = await Post.findById(id).populate('author' , ['username']);
        res.status(200).json(post);
    }
    catch(error){
        console.lof(error);
        res.status(200).json({message:"can't find the Post"});
    }
})

const editPost = asyncHandler(async (req,res)=>{
    const {token} = req.cookies;
    let checkToken = null;
    jwt.verify(token,secretKey,{},(err, userInfo)=>{
        if(err){
            res.json(400).json("User Not Login");
        }
        checkToken = userInfo;
    })
    
    let newPath = null;
    const postId = req.params.id;

    if(req.file){
        const {originalname, path} = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length-1];
        newPath = path +'.'+ext;

        fs.renameSync(path, newPath);
    }

    if(checkToken){
        const {title,summary,content} = req.body;
        try{
            if(newPath){
                const updPost = await Post.findByIdAndUpdate(postId,{
                    title,
                    summary,
                    content,
                    coverphoto:newPath
                });
    
                res.status(200).json({message:"Updated SuccessFully"});
            }else{
                const updPost = await Post.findByIdAndUpdate(postId,{
                    title,
                    summary,
                    content
                });

                res.status(200).json(updPost);
            }

        }
        catch(error){
            console.log(error);
            res.status(400).json({message:"diden't get Updated"});
        }
    }
    
})

module.exports = {postCreate, getPost, getSpecificPost, editPost};