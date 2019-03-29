const express = require('express');
const app = express();
const cors = require('cors')
const port = process.env.PORT || 8081;
const history = require('connect-history-api-fallback');

// 
app.use(cors())
app.use(history())
app.use( express.static( __dirname + '/dist/'));

app.get('/*', (req, res) => {
  // console.log(req)
  res.setHeader("Access-Control-Allow-Origin", "*");
  console.log(__dirname)
  res.sendFile(__dirname, + '/docs/index.html');
});
app.listen(port, () => console.log(`server started`));
