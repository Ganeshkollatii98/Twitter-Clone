const express=require("express")
const axios=require('axios');
const Twitter=require('./api/helper/twitter')
const twitter=new Twitter();
const app = express();
const port=3000;
// For storeing API_TOKEN we are using .env File
require('dotenv').config();
app.use((req,res, next)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
})
app.get("/tweets",(req,res)=>{
    
    const query=req.query.q;
    const count=req.query.count;
    const maxId=req.query.max_id;
    
    twitter.get(query,count,maxId).then((responce)=>{
            res.status(200).send(responce.data);
        }).catch((error)=>{
            res.status(400).send(error)
        })
        
   })


app.listen(port,()=>console.log(`Twitter API listening on port ${port}`))