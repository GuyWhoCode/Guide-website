let messageArea = document.getElementById('messageArea')
let socket = io("/");
let timer = 0;
let helpGuide = {
    "title": "Bot Commands",
    "fields": [
        {
            "name": "Help:",
            "value": "<code>g!help</code>\n--- Brings up this help menu"
        },
        {
            "name": "Search:",
            "value": "<code>g!search [Query] </code>\n--- Searches the Guide database.\nExample: <code>g!search combat</code>"
        },
        {
            "name": "Disclaimer:",
            "value": "This was styled to mirror the UI (User Interface) of Discord and is not a malicious attempt to profit/claim this as my own. Additionally, this app is only meant to stimulate how the bot works and does not include every feature. Invite the bot to your Discord server by clicking on the Discord image to the left to see more."
        },
    ]
}

const preventStupidInputs = inputElm => {
    let input = inputElm.value
    if (input.length == 0 || input.includes(".") || input.includes("-") || input.length == 1) {
      inputElm.value = ""
      return false
    } 
    return true
  }
  
const parseTextFormatting = text => {
    if (text.includes("**") === false) return text
    let boldedCounter = -1
    let boldedList = text
        .split("**")
        .map(val => {
            boldedCounter += 1
            if (val != "" && val[0] != " " && boldedCounter != 0) return val = `<br><b> ${val.trim()} </b>`
            else if (boldedCounter == 0 && val.trim() != "") return val = `<b> ${val.trim()} </b>`
            else return val = val.trim()
            
        })
        .join("")
    return boldedList
    // Replaces the ** used in Discord formatting (and stored as such in database) into HTML bold element
    // Additionally makes a new line after every bolded element except the first by using a counter
}

const parseCommand = text => {
    if (text.toLowerCase().trim().includes("g!search") === false && text.toLowerCase().trim().includes("g!help") === false) return undefined
    let arguments = text.toLowerCase().trim().split(" ")
    let commandWord = arguments[0].split("g!")[1]

    if (commandWord === "help") return createMessage(helpGuide, "Bot", "Bot Response")
    else if (commandWord === "search") {
        socket.emit("search", arguments.slice(1, arguments.length).join(" "))
    }
}

const createEmbedMessage = (info, messageDiv) => {
    // Info must be the embed message property from the db
    let embedDiv = document.createElement("div")
    embedDiv.className = 'messageBody embedMessage'

    let embedTitle = document.createElement("p")
    embedTitle.className = "embedTitle"
    embedTitle.innerHTML = info.title

    info.fields.map(val => {
        if (val.name == "_ _") return;
        let embedSubtitle = document.createElement("p")
        embedSubtitle.className = 'embedSubtitle'
        embedSubtitle.innerHTML = val.name
        
        let fieldInfo = document.createElement("p")
        fieldInfo.className = "embedInfo"
        fieldInfo.innerHTML = parseTextFormatting(val.value)
        embedDiv.appendChild(embedSubtitle)
        embedDiv.appendChild(fieldInfo)
    })
    messageDiv.appendChild(embedDiv)
    messageArea.appendChild(messageDiv)
    messageDiv.scrollIntoView()
}

const createMessage = (message, user, type) => {
    let messageDiv = document.createElement("div")
    messageDiv.className = 'message'
    
    let getTime = new Date()
    let time = document.createElement("p")
    time.className = 'date'
    time.innerHTML = "Today at " + getTime.toLocaleTimeString().slice(0,5) + " " + getTime.toLocaleTimeString().slice(8)

    let iconPic = document.createElement("img")
    iconPic.className = 'icon'
    
    let author = document.createElement("p")
    author.className = 'author'

    if (user === "Person") {
        iconPic.src = "pictures/user.png"
        author.innerHTML = "Person"

    } else {
        iconPic.src = "pictures/bot.png"
        author.innerHTML = "SkyBlock Guides"
    }
 
    let nameTime = document.createElement('div')
    nameTime.className = 'nameTime'
    nameTime.appendChild(author)
    nameTime.appendChild(time)


    let msg = document.createElement("p")
    msg.className = 'messageBody'
    
    messageDiv.appendChild(msg)
    messageDiv.appendChild(iconPic)
    messageDiv.appendChild(nameTime)
    messageArea.appendChild(messageDiv)

    if (type === "Command" && ((Date.now() - timer)/1000) >= 10) {
        timer = Date.now()
        msg.innerHTML = message
        msg.scrollIntoView()
        parseCommand(message)
    } else if (((Date.now() - timer)/1000) < 10 && type === "Command") {
        msg.innerHTML = message + "<br>You are on cooldown for " + (10-((Date.now()-timer)/1000)).toFixed(1) + " seconds."
        msg.scrollIntoView()
    } else {
        createEmbedMessage(message, messageDiv)
    }
}

document.getElementById("githubIcon").addEventListener("click", () => {
    window.open("https://github.com/GuyWhoCode/sb-guide", "_blank")
})

document.getElementById("discordIcon").addEventListener("click", () => {
    window.open("https://discord.com/oauth2/authorize?client_id=775597115560165396&scope=bot&permissions=2147839040", "_blank")
})

document.getElementById('userInput').addEventListener('submit', function(event) {
    event.preventDefault()
    if (preventStupidInputs(document.getElementById('userInputBox'))) {
        createMessage(document.getElementById('userInputBox').value, "Person", "Command")
        document.getElementById('userInputBox').value = ""
    }
}, false)


createMessage(helpGuide, "Bot", "Bot Response")
socket.on("searchResult", result => {
    createMessage(result, "Bot", "Bot Response")
})
