const express = require("express");  
const cors = require("cors");  
require('dotenv').config();
const Transaction = require('./models/Transaction');
const app = express();  
const mongoose = require('mongoose');
const port = 4040;  

// Middleware to enable CORS  
app.use(cors());  
// Middleware to parse JSON bodies  
app.use(express.json());  

// Test GET endpoint  
app.get('/api/test', (req, res) => {  
    res.json('test ok');  
});  

// POST endpoint for transactions  
app.post('/api/transaction', async (req, res) => {
   await mongoose.connect(process.env.MONGO_URL);
   //console.log(process.env.MONGO_URL);
    const{name,description,datetime,price} = req.body;
    const transaction = await Transaction.create({name,description,datetime,price})
    console.log('Received transaction:', req.body); // Log the incoming transaction to the console  
    res.json(transaction); // Send the received data back in the response  
});  

app.get('/api/transactions',async(req,res)=>{
    await mongoose.connect(process.env.MONGO_URL);
    const transactions = await Transaction.find();
    res.json(transactions);
})


// Start the server  
app.listen(port, () => {  
    console.log(`Successfully running on port ${port}`);  
});

//Dheeraj1133