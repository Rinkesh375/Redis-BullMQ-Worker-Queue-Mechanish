import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";


const app = express()


export const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379")