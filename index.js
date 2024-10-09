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

  const calculateStandardDeviation = (prices) => {
    const n = prices.length;
    if (n === 0) return 0;
    const mean = prices.reduce((acc, price) => acc + price, 0) / n;
    const variance = prices.reduce((acc, price) => acc + Math.pow(price - mean, 2), 0) / n;
    return Math.sqrt(variance);
  };
  
  app.get('/deviation', async (req, res) => {
    const { coin } = req.query;
    if (!coin) {
      return res.status(400).json({ error: 'Enter valid coin name' });
    }
  
    try {
      // const prices=[
      //   { price: 40000 },
      //   { price: 45000 },
      //   { price: 50000 }
      // ]
      const prices = await Price.find({ coin }).sort({ timestamp: -1 }).limit(100).select('price');
      const priceList = prices.map(record => record.price);
      const deviation = calculateStandardDeviation(priceList);

      res.json({ deviation: deviation.toFixed(2) });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/', async (req, res) => {
    try {
      res.status(200).send(`
        <h1>Welcome to the Crypto Price & Deviation API 📊</h1>
        <p>This API allows you to fetch real-time cryptocurrency prices and calculate the standard deviation of prices based on historical data.</p>
        <p>For more details, visit the <a href="https://github.com/Adi-R12/KoinX-Assignment">GitHub repository</a>.</p>
      `);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
