import express from "express";
import Redis from "ioredis";

const app = express()
app.use(express.json())

const publisher = new Redis(process.env.REDIS_URL || "redis://localhost:6379")


app.post("notifications",async(req,res)=>{
    const {title="Default Title",createdAt=new Date().toISOString()} = req.body;
    const receivers = await publisher.publish(
        "notifications",
        JSON.stringify({title,createdAt})
    )

    res.json({success:true,message:`Notification sent to ${receivers} subscribe`})
})


app.listen(3000,()=>{
    console.log(`Server runing successfully at http://localhost:3000`)
})
