const express = require("express");
const app = express();

// const MongoClient = require('mongodb').MongoClient;
// const url = uri;
// const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

app.get("/", function(request, response) {
    response.sendFile(__dirname + "index.html");
});
