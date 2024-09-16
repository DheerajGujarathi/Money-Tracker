import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    getTransactions().then(fetchedTransactions => {
      setTransactions(fetchedTransactions);
      calculateBalance(fetchedTransactions);
    });
  }, []);

  async function getTransactions() {
    const url = `${process.env.REACT_APP_API_URL}/transactions`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  function calculateBalance(transactionsList) {
    const total = transactionsList.reduce((acc, transaction) => acc + transaction.price, 0);
    setBalance(total.toFixed(2)); // Set balance to 2 decimal places
  }

  function addNewTransaction(ev) {
    ev.preventDefault();
    const priceAndName = name.match(/^([+-]?[\d]+)\s+(.+)$/);

    if (!priceAndName) {
      alert('Please enter the price and name in the format "+/-price item"');
      return;
    }

    const price = parseFloat(priceAndName[1]); // Use parseFloat to handle decimal values
    const itemName = priceAndName[2].trim(); // Extracted name without the price

    if (isNaN(price) || !itemName) {
      alert('Please enter a valid price and name');
      return;
    }

    const transactionData = {
      price,  // Send the extracted price as a number
      name: itemName,  // Send only the product name (without the price)
      description,
      datetime,
    };

    const url = `${process.env.REACT_APP_API_URL}/transaction`;

    fetch(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(transactionData)
    }).then(response => {
      response.json().then(newTransaction => {
        const updatedTransactions = [...transactions, newTransaction];
        setTransactions(updatedTransactions);
        calculateBalance(updatedTransactions);
        setName('');
        setDatetime('');
        setDescription('');
      });
    });
  }

  // Split balance to get integer and fractional parts
  const balanceInt = Math.floor(balance);
  const balanceFraction = (balance % 1).toFixed(2).split('.')[1] || '00';

  return (
    <main>
      <h1>
        ₹{balanceInt}
        <span>.{balanceFraction}</span>
      </h1>
      <form onSubmit={addNewTransaction}>
        <div className="basic">
          <input
            type="text"
            value={name}
            onChange={ev => setName(ev.target.value)}
            placeholder={'+200 samsung tv'}
          />
          <input
            value={datetime}
            onChange={ev => setDatetime(ev.target.value)}
            type="datetime-local"
          />
        </div>
        <div className="description">
          <input
            type="text"
            value={description}
            onChange={ev => setDescription(ev.target.value)}
            placeholder="description"
          />
        </div>
        <button type="submit">Add new Transaction</button>
      </form>

      <div className="transactions">
        {transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <div key={index} className="transaction">
              <div className="left">
                <div className="name">{transaction.name}</div>
                <div className="description">{transaction.description}</div>
              </div>
              <div className="right">
                <div className={`price ${transaction.price < 0 ? 'red' : 'green'}`}>
                  {transaction.price < 0 ? `-₹${Math.abs(transaction.price)}` : `₹${transaction.price}`}
                </div>
                <div className="datetime">
                  {new Date(transaction.datetime).toLocaleString()}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>No transactions available</div>
        )}
      </div>
    </main>
  );
}

export default App;
