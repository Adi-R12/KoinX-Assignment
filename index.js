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

  const updateCryptoData = async (data) => {
    latestCryptoData = data;

    const jsonData = JSON.stringify(data);
    memcachedClient.set('latestCryptoData', jsonData, { expires: 7200 }, (err) => {
      if (err) {
        console.error('Error saving data to Memcached:', err);
      } else {
        console.log('data updated in Memcached.');
      }
    });
  };

  fetchCryptoData().then(async (data) => {
    await updateCryptoData(data);
  }).catch((error) => {
    console.error('Error during initial fetch:', error);
  });

  cron.schedule('0 */2 * * *', async () => {
    console.log('Fetching crypto data:');
    const data = await fetchCryptoData();
    await updateCryptoData(data);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
