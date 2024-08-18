const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title : {
        type : String,
        required : [true, "Please add title"]
    },
    summary : {
        type : String,
        required : [true, "Please add Summary"]
    },
    content : {
        type : String,
        required : [true ,"Please add content"]
    },
    coverphoto : {
        type : String,
        required : [true ,"Please add content"]
    }
},{
    timestamp : true
})

module.exports = mongoose.model("Post" , postSchema);