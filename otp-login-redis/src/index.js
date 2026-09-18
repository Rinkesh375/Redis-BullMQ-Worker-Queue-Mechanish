import express from "express";
import Redis from "ioredis";



const app = express()
app.use(express.json())


export const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379")

const otpKey = (phone)=>{
    return `OTP:${phone}`
}

app.post("/otp/verify",async(req,res)=>{
    const {otp,phone} = req.body;
    const savedOtp = await redis.get(otpKey(phone))
    console.log(typeof(savedOtp),savedOtp)
    if(!savedOtp){
        res.json({success:false,message:"Otp expired or not found"})
    }
    else if(savedOtp != otp){
        res.json({success:false,message:"Otp did not match"})
    }
    else {
        await redis.del(otpKey(phone))
        res.json({success:true,message:"Otp Verified"})
    }


})


app.post("/otp",async(req,res)=>{
    const phone = req?.body?.phone
    const generateOTP = Math.floor(100000 + Math.random() * 900000)
    await redis.set(otpKey(phone),generateOTP,"EX",300)
    res.json({success:true,phone, otp:generateOTP})
})

app.get("/otp/ttl/:phone",async(req,res)=>{
  const phone = req?.params?.phone
  const ttl = await redis.ttl(otpKey(phone))
  res.json({phone,ttl})
})





app.listen(3000,()=>{
    console.log("Application runing at port:3000")
})