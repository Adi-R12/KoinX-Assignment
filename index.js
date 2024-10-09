import express from 'express';
import mongoose from 'mongoose';
import cron from 'node-cron';
import fetchCryptoData from './api/fetchCryptoData.js';
import { configDotenv } from 'dotenv';
import memjs from 'memjs'; 
import Price from './Models/cryptoPriceSchema.js';
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

  app.get('/stats', async (req, res) => {
    const { coin } = req.query;

    memcachedClient.get('latestCryptoData', (err, val) => {
      if (err || !val) {
        console.log('Fetching crypto data from variable');
        const coinData = latestCryptoData.find(c => c.name.toLowerCase() === coin.toLowerCase());
    
        if (!coinData) {
          return res.status(404).json({ error: 'Data not found' });
        }

        res.json({
          price: coinData.price,
          market_cap: coinData.market_cap,
          "24hChange": coinData.change_24h
        });
      } else {
        const cachedData = JSON.parse(val.toString());
        const coinData = cachedData.find(c => c.name.toLowerCase() === coin.toLowerCase());  
  
        if (!coinData) {
          return res.status(404).json({ error: 'Data not found' });
        }
        res.json({
          price: coinData.price,
          market_cap: coinData.market_cap,
          "24hChange": coinData.change_24h
        });
      }
    });
  });



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
