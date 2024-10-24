const connectToMongo = require('./db.js');
connectToMongo();

const express = require('express');
const app = express();
const port = 5000;

// Middleware to parse JSON
app.use(express.json());

// Available Routes
app.use('/api/auth', require('./auth'));
app.use('/api/note', require('./note'));

app.listen(port, () => {
  console.log(`iNotebook backend listening on http://localhost:${port}`);
});
