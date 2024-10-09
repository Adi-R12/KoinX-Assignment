import mongoose from 'mongoose';

const cryptoSchema = new mongoose.Schema({
  name: String,
  symbol: String,
  price: Number,
  market_cap: Number,
  change_24h: Number,
  timestamp: { type: Date, default: Date.now }
});

const Crypto = mongoose.model('Crypto', cryptoSchema);
export default Crypto;
