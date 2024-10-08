const express = require('express');
require('dotenv').config()

const app = express();

LIMIT = process.env.LIMIT || 30;
DELAY = process.env.DELAY || 2000;
PORT = process.env.PORT || 3000;

let connections = [];

app.get('/date', (req, res, next) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');
  connections.push(res);
})

let tick = 0;
setTimeout(function run() {
  console.log(tick);
  if (++tick > LIMIT) {
    connections.map(res => {
      res.write("END\n");
      res.end();
    });
    connections = [];
    tick = 0;
  }
  connections.map((res, i) => {
    res.write(`Hello ${i}! Tick: ${tick}.\n`);
  })
  setTimeout(run, DELAY)
}, DELAY)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});