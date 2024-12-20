require('dotenv').config();
const express = require('express');
const cors = require('cors');
const {URL}=require('url');
const dns=require('dns');
const app = express();

let id=1;
let urlLists={};



// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());



app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl',(req,res)=>{
  const {url}=req.body
  try {
    const parsedUrl=new URL(url);
    const hostname=parsedUrl.hostname
    dns.lookup(hostname, (err, address, family) => {
      if (err) {
          return res.status(500).json({error: 'invalid url'});
      }
      urlLists[id]=url;

      res.json({
        original_url:url,
        short_url: id
      });
      console.log(urlLists);
      id++;
  });

  } catch (error) {
    res.status(500).json({error: 'invalid url'});
  }
})

app.get('/api/shorturl/:id',(req,res)=>{
  const sId=req.params.id;
  
  res.redirect(urlLists[sId])
})

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
