const path = require('path');
const express = require('express');
const app = express();

app.get('/render', (req, res) => {
  console.log(JSON.stringify({
    message: '"rendering" doge for url',
    data: {
      originalUrl: req.originalUrl,
      query: req.query,
    },
  }, null, 2 ));
  res.sendFile(path.resolve(__dirname, './doge.png'));
});

app.listen(8081, () => console.log(JSON.stringify({ message: 'Listening on http://localhost:8081' }, null, 2)));
