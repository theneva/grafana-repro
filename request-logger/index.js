const express = require('express');
const app = express();

app.use(express.json());

app.all('*', (req, res) => {
  console.log(JSON.stringify({ message: 'received request', data: { method: req.method, originalUrl: req.originalUrl, body: req.body }}, null, 2));
  res.sendStatus(200);
});

app.listen(8080, () => console.log(JSON.stringify({ message: 'listening on http://localhost:8080' }, null, 2)));
