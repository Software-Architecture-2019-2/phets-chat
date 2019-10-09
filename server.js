const express = require('express');

// Routes export
const message = require('./routes/message')

// App
const app = express();

app.get('/', (req, res) => {
  res.send('Hello world\n');
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