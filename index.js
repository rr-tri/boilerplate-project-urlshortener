require('dotenv').config();
const express = require('express');
const dns = require('dns')
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
  try{const { url } = req.body;
  // console.log('url =', url)
 
  isValidURL(url, (isValid) => {
    if (isValid) {
      // console.log(`${url} is a valid URL.`);
      const short_url = getId();
      const original_url = url
      urlDatabase[short_url] =  original_url
      return res.json({ original_url, short_url });
    } else {
      // console.log(`${url} is not a valid URL.`);
      return res.json({ error: 'Invalid URL' });
    }
  });
}catch(err){
    res.json({ error: 'Invalid URL' });
  }
  
  
});


function isValidURL(url, callback) {
  // Extract the host (domain) from the URL
  const host = new URL(url).hostname;
  // console.log('host',host)
  // Perform a DNS lookup for the host
  dns.lookup(host, (err, address, family) => {
    if (err) {
      // If an error occurs, it means the host could not be resolved
      callback(false);
    } else {
      // The host was successfully resolved to an IP address
      callback(true);
    }
  });
}

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
