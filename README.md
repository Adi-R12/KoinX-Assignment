# 🚀 Crypto Price & Standard Deviation API 📊

Welcome to the **Crypto Price & Deviation API** project! This application allows you to retrieve the current prices of various cryptocurrencies and calculate their standard deviation based on historical data. It features two main tasks: fetching real-time crypto data and calculating the price deviation for specific coins.

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/) [![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/) [![MongoDB](https://img.shields.io/badge/MongoDB-4ea94b?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/) [![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)

## Table of Contents

- [Project Overview](#project-overview)
- [Setup Instructions](#setup-instructions)
- [Task 1: Fetch Latest Crypto Prices](#task-1-fetch-latest-crypto-prices)
- [Task 2: Calculate Standard Deviation](#task-2-calculate-standard-deviation)
- [Tech Stack](#tech-stack)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)

## 🌟 Project Overview

This project consists of two main features:
1. **Fetch Real-time Crypto Prices:** Retrieve the latest prices for cryptocurrencies like Bitcoin, Ethereum, and Polygon.
2. **Calculate Standard Deviation:** Calculate the standard deviation of the price of a requested cryptocurrency using the last 100 records stored in the database.

The app uses **Node.js**, **Express**, **MongoDB**, and **Redis** to handle data fetching, caching, and storage.

---

## 🛠️ Setup Instructions

### Prerequisites
Before running the project, make sure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Redis](https://redis.io/)

### Step-by-Step Installation Guide

1. **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/crypto-api.git
    cd crypto-api
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the following environment variables:
   ```bash
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/cryptoDB
   REDIS_HOST=127.0.0.1
   REDIS_PORT=6379
