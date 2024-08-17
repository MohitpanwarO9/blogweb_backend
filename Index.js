const express = require("express");
const app = express();
const dotenv = require('dotenv').config();
const cors = require("cors");
const cookiePareser = require('cookie-parser');


const connectDb = require('./config/dbConnection.js');
const { use } = require("./routes/userRoutes");


const port = process.env.PORT || 5000;

const corsOptions = {
    origin:'http://localhost:3000',
    credentials:true,
    optionSuccessStatus:200
}

app.use(cors(corsOptions));
connectDb();
app.use(express.json());
app.use(cookiePareser());


app.use('/user',require("./routes/userRoutes"));


app.listen(port,()=>{
    console.log(`server is running on ${port}`);
})







