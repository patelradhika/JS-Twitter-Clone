const port = 3000;
const express = require('express');
const app = express();
const Twitter = require('./api/services/tweet');
const twitter = new Twitter();
require('dotenv').config();


app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});
app.use(express.json());


app.get('/tweets', (req, res) => {
    const query = req.query.q;
    const count = req.query.count;

    twitter.get(query, count)
    .then((response) => {
        return res.send(response.data);
    })
    .catch((error) => {
        return res.send(error);
    })
})

app.get('/tweets/next', (req, res) => {
    const query = req.query.q;
    const count = req.query.count;
    const max_id = req.query.max_id;

    twitter.getNext(query, count, max_id)
    .then((response) => {
        return res.send(response.data);
    })
    .catch((error) => {
        return res.send(error);
    })
})


app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
})