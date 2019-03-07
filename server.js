const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json({limit: '10mb'}));

// TODO: handle requests


let latestPhoto = null;

// upload the latest photo for this session
app.post('/', (req, res)=>{
    // very light error handling
    if(!req.body) return res.sendStatus(400);

    console.log('got photo');

    // update the image and respond happily
    latestPhoto = req.body.image;
    res.sendStatus(200);
});

// view latest image
app.get('/', (req, res)=>{

});


const port = process.env.PORT || 5005;
app.listen(port);

console.log('Server listening on '+port);
