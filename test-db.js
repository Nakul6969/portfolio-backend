// test-db.js
require('dotenv').config();
const mongoose = require('mongoose');

console.log('Checking MONGODB_URI:', process.env.MONGODB_URI ? '✅ Found' : '❌ Not found');

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env file');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });