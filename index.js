require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

let shortUrl = 0
const getId = () => (shortUrl=shortUrl+1)
const urlDatabase = {}; 
// Basic Configuration
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(cors({ optionsSuccessStatus: 200 }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
app.get('/api/shorturl/:short_url', (req, res) => {
  const { short_url } = req.params;
  const original_url = urlDatabase[short_url];
  // console.log(original_url)
  if (original_url) {
    res.redirect(original_url);
  } else {
    res.json({ error: 'Short URL not found' });
  }
});

app.post('/api/shorturl', (req, res) => {
  const { url } = req.body;

  if (isValidURL(url)) {
    const short_url = getId();
    const original_url = url.startsWith('http://') || url.startsWith('https://') ? url : `http://${url}`;
    urlDatabase[short_url] =  original_url
    res.json({ original_url, short_url });
  } else {
    res.json({ error: 'Invalid URL' });
  }
});

function isValidURL(str) {
  const pattern = /^(https?:\/\/)?([a-zA-Z0-9_-]+\.)+[a-zA-Z]{2,6}([/a-zA-Z0-9_-]*)*\/?$/;
  return pattern.test(str);
}

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
