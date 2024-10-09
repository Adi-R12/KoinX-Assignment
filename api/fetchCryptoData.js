import fetch from 'node-fetch';
import Crypto from '../Models/cryptoSchema.js';

const fetchCryptoData = async () => {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,matic-network`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const cryptos = data.map(coin => ({
      name: coin.name,
      symbol: coin.symbol,
      price: coin.current_price,
      market_cap: coin.market_cap,
      change_24h: coin.price_change_percentage_24h
    }));

    console.log("cryptoData", cryptos);

    for (const crypto of cryptos) {
      const newCrypto = new Crypto(crypto);
      await newCrypto.save();
    }

    console.log('data saved successfully!');
    return cryptos;
  } catch (error) {
    console.error('Error:', error);
  }
};

export default fetchCryptoData;
