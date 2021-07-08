// ORIGINAl CODE IMPORTED FROM BOT CODE (https://github.com/GuyWhoCode/sb-guide/blob/main/Commands/search.js)
// Modified to fit in a website format, not Discord
const {dbClient, socket} = require("./server.js")
const distance = require('jaro-winkler')
const Fuse = require('fuse.js')
const options = {
    includeScore: true,
    shouldSort: true,
    keys: ["categoryTitle", "embedMessage.fields.name"]
}
const threshold = 0.60
socket.on('connection', io => {
    io.on('search', async (query) => {
        let searchQuery = query.trim()
        let guidesDB = dbClient.db("skyblockGuide").collection("Guides")
        let guide = await guidesDB.find({}).toArray()
        let fuseSearch = new Fuse(guide, options)
    
        const parseQuery = query => {
            possibleQueries = {}
            guide.map(val => {
                if (distance(query, val.categoryTitle, {caseSensitive: false}) > 0.70 || val.categoryTitle == query) {
                    possibleQueries[val.categoryTitle] = distance(query, val.categoryTitle, {caseSensitive: false})
                    possibleQueries[val.categoryTitle + " embed"] = val.embedMessage
                }
                //Exact case matching: If the entire query closely matches the category title, prioritize it first.
    
                else if (query.includes(" ") && val.categoryTitle.toLowerCase().split(" ").map(titleWord => titleWord = query.split(" ").map(queryWord => queryWord = titleWord.includes(queryWord.toLowerCase())).filter(word => word == true).flat()).flat().filter(word => word == true).length >= 1 && distance(query, val.categoryTitle, {caseSensitive: false}) > 0.50) {
                    possibleQueries[val.categoryTitle] = distance(query, val.categoryTitle, {caseSensitive: false})
                    possibleQueries[val.categoryTitle + " embed"] = val.embedMessage
                //Exact word matching: If the query has a word that matches a category title, add it to the possible queries.
                //If a query has multiple words, check to see if any of the words are in the category title
                
                } else if (val.categoryTitle.toLowerCase().includes(query.toLowerCase()) && distance(query, val.categoryTitle, {caseSensitive: false}) > 0.50) {
                    possibleQueries[val.categoryTitle] = distance(query, val.categoryTitle, {caseSensitive: false})
                    possibleQueries[val.categoryTitle + " embed"] = val.embedMessage
                //Exact word matching: If the query has a word that matches a category title, add it to the possible queries.
                //If a query just has a single word, do this
                
                } else {
                    let closeness = val.categoryTitle
                        .split(" ")
                        .map(word => distance(query, word, {caseSensitive: false}))
                        .reduce((prev, current) => prev + current)/(val.categoryTitle.split(" ").length)
    
                    if (closeness > threshold) {
                        possibleQueries[val.categoryTitle + " embed"] = val.embedMessage
                    }
                    //Queries with the search algorithm by matching each Category Title word with query and taking average.
                }
            })
            //Implements the Jaro-winkler search algorithm by comparing the search query string to the guide's title
            if (Object.keys(possibleQueries).length != 0) {
                var bestResult = ""
                Object.keys(possibleQueries)
                    .filter(val => !val.includes("embed"))
                    .map(val => {
                        if (bestResult == "" || possibleQueries[bestResult] < possibleQueries[val]) {
                            bestResult = val 
                        } 
                    })
                return possibleQueries[bestResult + " embed"]
    
            }
            //Sorts out the results by picking the highest rated one and returns the corresponding guide embed message
    
            let results = fuseSearch.search(query)
            return results[0].item.embedMessage
            //Implements fuzzy searching as a backup search algorithm when the Jaro-winkler algorithm doesn't give a result
            //NICE TO HAVE --- need to have an default case. Rather than returning the least best result, return a embed that suggests user to clarify/narrow down search
        }
        

        let guideMessage = parseQuery(searchQuery)
        guideMessage.timestamp = new Date()
        io.emit("searchResult", guideMessage)
    })
})