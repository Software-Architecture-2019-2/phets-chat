const express = require('express');

// Routes export
const message = require('./routes/message')

// App
const app = express();

app.get('/', (req, res) => {
  res.send('Hello Phets =)\n');
});
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

//For middlewares
app.use(express.json());

// For routes
app.use('/messages',message)

const PORT = process.env.PORT || 4002;
const server = app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
});

module.exports = {
  server
};