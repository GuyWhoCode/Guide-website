const express = require("express");
const app = express();
const server = app.listen(3000, function() {
    console.log("Your app is listening on port " + server.address().port);
    //Local Development environment: http://127.0.0.1:3000/
});
const socket = require('socket.io')(server)

app.use(express.static(__dirname + "/website"));
app.use(express.static(__dirname));
app.get("/", function(request, response) {
    response.sendFile(__dirname + "/index.html");
});

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://" + process.env.dbUSER + ":" + process.env.password + "@guide-info.e5dr4.mongodb.net/skyblockGuide?retryWrites=true&w=majority"
const dbClient = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true, poolSize: 10});
dbClient.connect((err) => {
    console.log("Connected to database!")
})

const search = require("./search.js")
socket.on('connection', io => {
    console.log("I have a socket connection!")
    io.on('search', async (query) => {
            let guidesDB = dbClient.db("skyblockGuide").collection("Guides")
            let guide = await guidesDB.find({}).toArray()
            let searchQuery = query.trim()
            let guideMessage = search.parseQuery(searchQuery, guide)
            guideMessage.timestamp = new Date()
            io.emit("searchResult", guideMessage)
      
    })
})