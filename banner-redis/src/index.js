import express from "express";
import Redis from "ioredis";



const app = express()
app.use(express.json())


export const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379")

const bannerKey = "banner:app"

app.get("/redis",async(req,res)=>{
    const reply = await redis.ping();
    res.json({redis:reply})
})


app.post("/banner",async(req,res)=>{
    await redis.set(bannerKey,req?.body?.message ?? "Hi User welcome")
    res.json({result:"body message set successfully"})
})

app.get("/banner",async(req,res)=>{
  const response =  await redis.get(bannerKey)
  res.json({result:response})
})


app.get("/banner/exists",async(req,res)=>{
  const response =  await redis.exists(bannerKey)
  res.json({result:!!response})
})


app.delete("/banner",async(req,res)=>{
  const response =  await redis.del(bannerKey)
  res.json({result:"Banner Key deleted successfully"})
})


app.listen(3000,()=>{
    console.log("Application runing at port:3000")
})