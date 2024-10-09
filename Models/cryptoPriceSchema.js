import mongoose from 'mongoose';

const priceSchema = new mongoose.Schema({
  coin: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

const Price = mongoose.model('Price', priceSchema);
export default Price;
