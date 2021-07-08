let messageArea = document.getElementById('messageArea')
let sampleGuide = {"_id":{"$oid":"5fde248f8cedc30004ac9600"},"embedMessage":{"color":{"$numberInt":"8902906"},"title":"In-depth Enchanting","fields":[{"name":"_ _","value":"_ _"},{"name":"Introduction","value":"Enchanting is the most simple skill to grind that there is currently (other than Taming). To start the grind, you first have to get Enchanting 10. You will most likely just get it automatically by enchanting stuff early on with the enchantment table. Once you reach Enchanting 10, you can create the Experimentation Table. It is crafted with 8 Oak Logs and 1 Experience Bottle (you can buy it from the Librarian in the Hub).\n​\n​To get Enchanting XP, you need to do Experimentations. Every day, you can do 1 experiment, however you can reset the countdown up to 3 times per day at the cost of Minecraft LVLs and Bits. To do the Main Experiment, you need Minecraft Levels as well as completing all the unlocked Add-Ons first. These Add-Ons will give you additional clicks in the Main Experiment.\n​"},{"name":"Experiments","value":"**Chronomatron** (Simon Says) - unlocks at Enchanting 20. \n**Maximum Amount of Clicks Needed:** Series of 12. \n**Maximum Amount of Enchanting XP: ** Series of 15.  \n\n**Ultrasequencer** - unlocks at Enchanting 25. It’s a visual memory game in which the player must memorize numeric sequences which appear for a brief amount of time and then recite the sequences by clicking on the squares where they were. \n**Maximum Amount of Clicks Needed:** Series of 9. \n**Maximum Amount of Enchanting XP: ** Series of 20.  ​\n\nSuperpairs is the Main Experiment. It’s a memory matching game, where the player reveals two pieces of the board at a time and the goal is to match a pair. For the maximum amount of XP, it is recommended to only go for the XP pairs and ignore the enchantments pairs (you can get Lvl 6 and 7 enchantments if you want). If you plan on doing the resets, it is recommended to get the Titanic Exp Bottles as it will save you a lot of money.\n​"},{"name":"Notes","value":"-Always do the highest tier Add-Ons/Experiment you can with your Enchanting LVL.\n-It is **HIGHLY** recommended to use a mod that highlights the notes/squares to pick in the Add-Ons games to make your life much easier (SBE, Danker’s Mod and Dungeon utils).\n**THESE MODS ARE CONFIRMED TO BE ALLOWED BY HYPIXEL STAFF, AS LONG AS IT DOESN’T DO THE CLICKS FOR YOU!!**\n-You can also get up to 500k Enchanting XP per day with the Enchantment Table and the Anvil!\n​"}],"footer":{"text":"SkyBlock Guides","icon_url":"https://i.imgur.com/184jyne.png"},"timestamp":{"$date":{"$numberLong":"1609046547654"}}},"categoryTitle":"In-depth Enchanting","messageID":{"587765474297905158":"844769945158287361","807319824752443472":"848316837406179339"},"category":"Skyblock"}
// let socket = io("/");
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
        // socket.emit("search", arguments.slice(1, arguments.length).join(" "))
        console.log("I am searching for: " +  arguments.slice(1, arguments.length).join(" "))
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
    let msg;
    let messageDiv = document.createElement("div")
    messageDiv.className = 'message'
    
    let getTime = new Date()
    let time = document.createElement("p")
    time.className = 'date'
    time.innerHTML = "Today at " + getTime.toLocaleTimeString().slice(0,4) + " " + getTime.toLocaleTimeString().slice(8)

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

    messageDiv.appendChild(iconPic)
    messageDiv.appendChild(nameTime)
    messageArea.appendChild(messageDiv)

    if (type === "Command" && ((Date.now() - timer)/1000) >= 10) {
        msg = document.createElement("p")
        msg.className = 'messageBody'
        msg.innerHTML = message
        messageDiv.appendChild(msg)
        msg.scrollIntoView()
        parseCommand(message)
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
// socket.on("searchResult", result => {
//     console.log(result)
// })
