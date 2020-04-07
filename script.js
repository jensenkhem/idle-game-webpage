window.onload = function() {
    // Main function -> Sets up all variables at the start and begins the game loop!
    game = new Game();
    player = loadGame()
    if(player == null) {
        player = new Player();
    }
    game.copperPic.addEventListener("click", function() {switchOre(player, game, "copper")});
    game.ironPic.addEventListener("click", function() {switchOre(player, game, "iron")});

    //Update screen elements!
    updateDisplay(game, player);

    // Setup the chat box entry key event
    window.addEventListener('keydown', (event) => {
        if(event.keyCode === 13) {
            this.readLine(player, game)
        }
    });
    // Start the game loop!
    this.setInterval(function() {mine(player, game); saveGame(player);}, player.tickRate)
};

class Player {
    // Describes all of the stats of the player!
    constructor() {
        this.tickRate = 3000;
        this.progress = 0;
        this.exp = 0;
        this.expMax = 4;
        this.level = 1;
        // Player items/states
        this.currentOre = null;
        this.pickaxe = new WoodPickaxe();
        this.copper = 0;
        this.iron = 0;
        this.steel = 0;
        // For the lifetime stats page!
        this.creationDate = new Date();
        this.totalCopper = 0;
        this.totalIron = 0;
        this.totalSteel = 0;
    }
}

class Game {
    // Describes all of the game objects such as display etc.
    constructor() {
        this.logRow = 1;
        this.progressBar = document.getElementById("myBar");
        this.progressPercent = document.getElementById("progressText");
        this.levelDisplay = document.getElementById("level");
        this.expDisplay = document.getElementById("exp");
        this.copperPic = document.getElementById("copper");
        this.copperCount = document.getElementById("inv1");
        this.ironPic = document.getElementById("iron");
        this.ironCount = document.getElementById("inv2");
        this.steelCount = document.getElementById("inv3");
        this.pickName = document.getElementById("pickName");
        this.pickPower = document.getElementById("pickPower");
        this.commandLine = document.getElementById("cmdline")

        // Log table data
        this.row1 = document.getElementById("row1");
        this.row2 = document.getElementById("row2");
        this.row3 = document.getElementById("row3");
        this.row4 = document.getElementById("row4");
        this.row5 = document.getElementById("row5");
    }
}

class Copper {
    // Describes the stats for copper ore!
    constructor() {
        this.name = "copper";
        this.power = 50;
        this.exp = 1;
    }

}

class Iron {
    // Describes the stats for iron ore!
    constructor() {
        this.name = "iron";
        this.power = 150;
        this.exp = 4;
    }
}

class Steel {
    constructor() {
        this.name = "steel";
        this.ironComp = 10;
        this.copperComp = 20;
    }
}

class WoodPickaxe {
    // Describes the equippable items!
    constructor() {
        this.name = "Wooden Pickaxe";
        this.minPower = 5;
        this.maxPower = 5; 
        this.power = Math.floor(Math.random() * (this.maxPower - this.minPower + 1)) + this.minPower;
        this.color = "#8B4513";
    }
}
class CopperPickaxe {
    // Describes the equippable items!
    constructor() {
        this.name = "Copper Pickaxe";
        this.minPower = 6;
        this.maxPower = 10; 
        this.power = Math.floor(Math.random() * (this.maxPower - this.minPower + 1)) + this.minPower;
        this.cost = 50;
        this.color = "#e67300";
    }
}

class IronPickaxe {
    // Describes the equippable items!
    constructor() {
        this.name = "Iron Pickaxe";
        this.minPower = 15;
        this.maxPower = 30; 
        this.power = Math.floor(Math.random() * (this.maxPower - this.minPower + 1)) + this.minPower;
        this.cost = 75;
        this.color = "#808080";
    }
}

class SteelPickaxe {
    constructor() {
        this.name = "Steel Pickaxe";
        this.minPower = 50;
        this.maxPower = 100; 
        this.power = Math.floor(Math.random() * (this.maxPower - this.minPower + 1)) + this.minPower;
        this.cost = 50;
        this.color = "#3e3e3e";
    }
}

class Drops {
    // Describes (possibly?) all of the possible drops from ore!
    constructor() {
        console.log("Test");
    }
}


function switchOre(player, game, ore) {
    // When the corresponding picture is clicked, starts to mine that ore! (Only copper so far!)
    if(ore == "copper") {
        updateLog(game, "You are now mining copper!");
        player.currentOre = new Copper();
    }
    if(ore == "iron") {
        if(player.level >= 10) {
            updateLog(game, "You are now mining iron!");
            player.currentOre = new Iron();
        }
        else {
            updateLog(game, "You are not skilled enough to mine this yet!");
        }
    }
}

function incrementItems(player, game) {
    // Add the correct items to the player's inventory after successful mine!
    if(player.currentOre.name == "copper") {
        player.copper++;
        player.totalCopper++;
        console.log("Player copper: " + player.copper);
        //Update the game display!
        game.copperCount.innerHTML = "Copper: " + player.copper;
    }
    if(player.currentOre.name == "iron") {
        player.iron++;
        player.totalIron++;
        console.log("Player iron: " + player.copper);
        //Update the game display!
        game.ironCount.innerHTML = "Iron: " + player.iron;
    }
}


function craftItem(player, game, item) {
    // Allow the user to craft pickaxes!
    console.log(item.name)
    if(item.name == "Copper Pickaxe") {
        if(player.copper >= item.cost && item.maxPower >= player.pickaxe.maxPower) {
            // Do not allow the player to accidentely make a big downgrade!
            chance = Math.random();
            player.copper -= item.cost;
            if(chance >= 0.50) {
                // Successfully crafted!
                swapItem(game, player, item);
            }
            else {
                updateLog(game, "Crafting failed! Maybe next time...");
            }
        }
        else {
            updateLog(game, "Not enough resources!");
        }
    }
    if(item.name == "Iron Pickaxe") {
        if(player.iron >= item.cost && item.maxPower >= player.pickaxe.maxPower) {
            // Do not allow the player to accidentely make a big downgrade!
            chance = Math.random();
            player.iron -= item.cost;
            if(chance >= 0.50) {
                // Successfully crafted!
                swapItem(game, player, item);
            }
            else {
                updateLog(game, "Crafting failed! Maybe next time...");
            }
        }
        else {
            updateLog(game, "Not enough resources!");
        }
    }
    if(item.name == "Steel Pickaxe") {
        if(player.steel >= item.cost && item.maxPower >= player.pickaxe.maxPower) {
            // Do not allow the player to accidentely make a big downgrade!
            chance = Math.random();
            player.steel -= item.cost;
            if(chance >= 0.50) {
                // Successfully crafted!
                swapItem(game, player, item);
            }
            else {
                updateLog(game, "Crafting failed! Maybe next time...");
            }
        }
        else {
            updateLog(game, "Not enough resources!");
        }
    }
    updateDisplay(game, player);
}

function swapItem(game, player, item) {
    // Set the player's current pickaxe to the one they just crafted and updates display accordingly
    updateLog(game, "Successfully crafted: " + item.name + " (+" + (item.power - player.pickaxe.power) + " power!)");
    player.pickaxe = item;
    game.pickName.innerHTML =  item.name + " <span id='pickPower'> " + "- Power: " + item.power;
    game.pickName.style.color = item.color;
}

function mine(player, game) {
    // Give the player the chance every game tick to mine a chosen ore!
    // Chance depends on factors such as ore type, pickaxe, level, etc.
    // On each tick, add to the activity log: 'Mining...' if dice roll fails, or '[Insert item here] obtained!' on success
    // On success, add item(s) gained to user inventory
    // Update skill exp accordingly!
    if(player.currentOre != null) {
        // If player passes the skill check -> They get loot!
        var roll = Math.random();
        var threshold = 1 - ((player.pickaxe.power + (player.level - 1)) / player.currentOre.power);
        var doubleChance = 1 - ((1 - threshold) / 5);
        console.log("Mining threshold: " + threshold);
        console.log("Double threshold: " + doubleChance);
        if(threshold < 0.99) {
            console.log(roll.toFixed(5))
            if(roll >= threshold) {
                // Item gain
                incrementItems(player, game);
                // Level up stuff
                updateLog(game, "You mined " + player.currentOre.name + "! (+" + player.currentOre.exp + " exp)");
                player.exp+=player.currentOre.exp;
                game.expDisplay.innerHTML = "Exp: " + player.exp + "/" + player.expMax;
                move(player, game); 
                checkLevel(player, game);
                if(roll >= doubleChance) {
                    incrementItems(player, game);
                    player.exp+=player.currentOre.exp;
                    game.expDisplay.innerHTML = "Exp: " + player.exp + "/" + player.expMax;
                    move(player, game); 
                    checkLevel(player, game);
                    updateLog(game, "You mined an extra big piece of ore! (+" + player.currentOre.exp + " exp)");
                }
            }
            else {
                updateLog(game, "Mining...");
            }       
        }    
        else {
            updateLog(game, "You are not skillful enough to mine this ore!");
        }
    }     
    else {
        updateLog(game, "Not mining anything currently...")
    }
}

function checkLevel(player, game) {
    // Checks every tick to see if the player has leveled!
    if(player.exp >= player.expMax) {
        nextLevel = player.level + 1;
        updateLog(game, "You have leveled up! (" + player.level + " -> " + nextLevel + ")");
        levelUp(player, game);
        //Update the game display accordingly
        game.expDisplay.innerHTML = "Exp: " + player.exp + "/" + player.expMax; move(player, game);
        game.levelDisplay.innerHTML = "Level: " + player.level; 
        move(player, game);
    }
}

function levelUp(player, game) {
    // Levels up the player, and upgrades/resets any stats!
    player.level += 1;
    player.exp -= player.expMax;
    player.expMax = Math.floor(player.expMax * 1.27);
    if(player.level % 10 == 0) {
        player.tickRate *= 0.9;
        updateLog(game, "You feel quicker than before! Mining speed up!");
        console.log(player.tickRate);
    }
}

function viewStats(player) {
    alert("Player stats:\nDate started: " + player.creationDate + "\nTotal copper mined: " + player.totalCopper + "\ntotal iron mined: " + player.totalIron + "\ntotal steel crafted: " + player.totalSteel);
}

function move(player, game) {
    // Moves the player's exp progress bar!
    player.progress = Math.floor((player.exp / player.expMax) * 100);
    game.progressBar.style.width = player.progress + "%";
    game.progressPercent.innerHTML = player.progress + "%";
}

function updateDisplay(game, player) {
    // Updates the game's display elements to the correct values stored in memory!
    game.expDisplay.innerHTML = "Exp: " + player.exp + "/" + player.expMax; move(player, game);
    game.levelDisplay.innerHTML = "Level: " + player.level; 
    game.pickName.innerHTML = player.pickaxe.name + " <span id='pickPower'> " + "- Power: " + player.pickaxe.power;
    game.pickName.style.color = player.pickaxe.color;
    game.copperCount.innerHTML = "Copper: " + player.copper;
    game.ironCount.innerHTML = "Iron: " + player.iron;
    game.steelCount.innerHTML = "Steel: " + player.steel;
}

function readLine(player, game) {
    // Reads a line from the command line interface and handles it!
    line = game.commandLine.value;
    splitLine = line.split(" ");
    game.commandLine.value = '';
    if(splitLine.length <= 2) {
        if(line == "craft cpick") {
            item = new CopperPickaxe();
            craftItem(player, game, item);
        }
        if(line == "craft ipick") {
            item = new IronPickaxe();
            craftItem(player, game, item);
        }
        if(line == "craft spick"){
            item = new SteelPickaxe();
            craftItem(player, game, item);
        }
        if(line == "reset") {
            reset(player);
        }
        if(line == "stats") {
            viewStats(player);
        }
        if(line == "craft steel"){
            exchange(player, game, new Steel(), 1);
        }
    }
    if(splitLine.length == 3) {
        if(splitLine[0] + " " + splitLine[1] == "craft steel") {
            try {
                num = parseInt(splitLine[2]);
                if(num <= 0) {
                    updateLog(game, "Invalid argument(s) given!");
                }
                else {
                    exchange(player, game, new Steel(), num);
                }
            }
            catch(err) {
                updateLog(game, "Invalid argument(s) given!");
            }
        }
    }

}

function exchange(player, game, target, num) {
    if(player.copper >= target.copperComp * num && player.iron >= target.ironComp * num) { // Add more conditions later for all ores! 
        player.copper -= target.copperComp * num;
        player.iron -= target.ironComp * num;
        switch(true) {
            case target.name == "steel":
                player.steel+=num;
                player.totalSteel+=num;
                break;
            default:
                alert("Shouldnt get here!");
        }
        updateLog(game, "You have crafted " + target.name + "! (" + num + ")");
        updateDisplay(game, player);
    } 
    else {
        updateLog("Not enough resources!")
    }
}

function updateLog(game, message) {
    // Updates the game activity log! -> Keeps track of all player actions
    // Get the current date and format the fields nicely!
    d = new Date()
    h = d.getHours()
    if(h < 10) {
        h = "0" + h;
    }
    m = d.getMinutes()
    if(m < 10) {
        m = "0" + m;
    }
    s = d.getSeconds()
    if(s < 10) {
        s = "0" + s;
    }

    if(document.getElementById("row5").innerHTML == "") {
        current_row = "row" + game.logRow;
        if(game.logRow != 1) {
            prev_row = "row" + (game.logRow - 1);
        }
        else {
            prev_row = "row5"
        }
        game.logRow++;
        // Update the game display elements!
        document.getElementById(current_row).innerHTML = message + " " + h + ":" + m + ":" + s;
        document.getElementById(current_row).style.fontWeight = "bold";
        document.getElementById(prev_row).style.fontWeight = "normal";
    }
    else {
        game.row1.innerHTML = game.row2.innerHTML;
        game.row2.innerHTML = game.row3.innerHTML;
        game.row3.innerHTML = game.row4.innerHTML;
        game.row4.innerHTML = game.row5.innerHTML;
        game.row5.innerHTML = message + " " + h + ":" + m + ":" + s;
        game.row5.style.fontWeight = "bold";
    }
}

function saveGame(player) {
    localStorage.setItem('player', JSON.stringify(player));
}

function loadGame() {
    return JSON.parse(localStorage.getItem('player'));
}

function reset(player) {
    
    player.tickRate = 3000;
    player.progress = 0;
    player.exp = 0;
    player.expMax = 4;
    player.level = 1;
    // Player items/states
    player.currentOre = null;
    player.pickaxe = new WoodPickaxe();
    player.copper = 0;
    player.iron = 0;
    player.steel = 0;
    player.creationDate = new Date();
    this.totalCopper = 0;
    this.totalIron = 0;
    this.totalSteel = 0;
    updateDisplay(game, player);
}