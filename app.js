const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const url = require('url');
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({extended: true});
const rp = require('request-promise');
const port = process.argv[2] || 3002;
const _weatherAPIKey = 'ecf5b4f4bec0ddd540b60cd345d2b50f';

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/weather', (req, res) => {

    console.log(req.query)
    
    let city = req.query.city;
    let countryCode = req.query.country;

    

    rp({
        method: 'GET',
        uri: `http://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&APPID=${_weatherAPIKey}`,
        json: true
    })
        .then((data) => {
            console.log('the data is ready to be sent to the client');
            console.log(data);
            res.json(data);
        })
        .catch(console.error);
})

///////////////////////////


app.post('/api/weather', urlencodedParser, (req, res) => {
    console.log(req.body.places);

    let places = req.body.places;

    let preEntities = places.map((index) => {

        let city = index.city;
        let countryCode = index.country;

        return rp({
            method: 'GET',
            uri : `http://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&APPID=${_weatherAPIKey}`,
            json: true
        })    
    });

    Promise.all(preEntities)
        .then((apiData) => {
            console.log(apiData);
            let data = { weatherAt: apiData };
            res.json(data);
        })
        .catch((e) => {
            console.log(e.message);
            res.send(e);
        });

    // console.log(JSON.parse((Object.keys(req.body))[0]));


    
    // res.end("good request !");

});


app.get('/', (req, res) => {
    res.end();
})

app.listen(port, (err) => {
    if(err) {
        console.error(err);
    }
    console.log(`Listen on port ${port}`);
});