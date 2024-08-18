const asyncHandler = require("express-async-handler");
const Post = require('../models/postModels');
const dotenv = require('dotenv').config;
const fs = require('fs');


const postCreate = asyncHandler(async (req, res) =>{
    const {originalname, path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length-1];
    const newPath = path +'.'+ext;

    fs.renameSync(path, newPath);

    const {title,summary,content} = req.body;
    try{
        const post = await Post.create({
            title,
            summary,
            content,
            coverphoto : newPath
        });
        res.status(200).json({_id:post._id,title:post.title,coverImg :post.coverphoto});
    }catch(err){
        console.log(err);
        res.status(400).json({message : "User not created"});
    }
        
})

module.exports = {postCreate};