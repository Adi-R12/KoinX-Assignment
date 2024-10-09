import express from 'express';
import mongoose from 'mongoose';
import cron from 'node-cron';
import fetchCryptoData from './api/fetchCryptoData.js';
import { configDotenv } from 'dotenv';
import memjs from 'memjs'; 
configDotenv();

const app = express();
const PORT = process.env.PORT;
const MEMCACHE_SERVER = process.env.MEMCACHE_SERVER || '127.0.0.1:11211';
const memcachedClient = memjs.Client.create(MEMCACHE_SERVER);
let latestCryptoData = {};

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));


  fetchCryptoData().then(async (data) => {
    
  }).catch((error) => {
    console.error('Error during initial fetch:', error);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
