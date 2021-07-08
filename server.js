const express = require("express");
const app = express();
const server = app.listen(3000, function() {
    console.log("Your app is listening on port " + server.address().port);
    //Local Development environment: http://127.0.0.1:3000/
});

app.use(express.static(__dirname + "/website"));
app.use(express.static(__dirname));
app.get("/", function(request, response) {
    response.sendFile(__dirname + "/index.html");
});

const MongoClient = require('mongodb').MongoClient;
const url = process.env.uri
const dbClient = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true, poolSize: 10});
const socket = require('socket.io')(server)

// dbClient.connect(async (err) => {
//     console.log("Connected to database!")
// })

module.exports = {
    dbClient: dbClient,
    socket: socket
}