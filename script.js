myInterval = null;
window.onload = function() {
    // Main function -> Sets up all variables at the start and begins the game loop!
    game = new Game();
    player = loadGame()
    if(player == null) {
        player = new Player();
    }
    game.copperPic.addEventListener("click", function() {switchOre(player, game, "copper")});
    game.ironPic.addEventListener("click", function() {switchOre(player, game, "iron")});
    game.mithrilPic.addEventListener("click", function() {switchOre(player, game, "mithril")});
    game.adamantPic.addEventListener("click", function() {switchOre(player, game, "adamant")});
    game.runePic.addEventListener("click", function() {switchOre(player, game, "rune")});

    //Update screen elements!
    updateDisplay(game, player);

    // Setup the chat box entry key event
    window.addEventListener('keydown', (event) => {
        if(event.keyCode === 13) {
            this.readLine(player, game)
        }
    });
    // Start the game loop!
    myInterval = setInterval(function() {mine(player, game); saveGame(player);}, player.tickRate * player.enchantment.speedMult);
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
        this.mithril = 0;
        this.adamant = 0;
        this.rune = 0;
        this.shards = 0;
        // For the lifetime stats page!
        this.creationDate = new Date();
        this.totalCopper = 0;
        this.totalIron = 0;
        this.totalSteel = 0;
        this.totalMithril = 0;
        this.totalAdamant = 0;
        this.totalRune = 0;
        this.totalShards = 0;

        // Enchantment reset
        this.enchantment = new Enchantment();
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
        this.mithrilPic = document.getElementById("mithril");
        this.mithrilCount = document.getElementById("inv4");
        this.adamantPic = document.getElementById("adamant");
        this.adamantCount = document.getElementById("inv5");
        this.runePic = document.getElementById("rune");
        this.runeCount = document.getElementById("inv6");
        this.pickName = document.getElementById("pickName");
        this.pickPower = document.getElementById("pickPower");
        this.shardCount = document.getElementById("magic");
        this.commandLine = document.getElementById("cmdline");
        this.enchantment = document.getElementById("enchantment");
        this.displayTick = document.getElementById("tickRate");
        // Log table data
        this.row1 = document.getElementById("row1");
        this.row2 = document.getElementById("row2");
        this.row3 = document.getElementById("row3");
        this.row4 = document.getElementById("row4");
        this.row5 = document.getElementById("row5");
    }
}

class Enchantment {
    constructor(roll, typeRoll) {
        this.speedMult = 1;
        this.powerMult = 1;
        this.tier = 0;
        this.color = "#000000";
        this.text = "None!";
        if(typeRoll == 1) {
            // Case speed enchantment
            if(roll > 0.99) {
                //Legendary
                this.speedMult = Math.random() * (0.65 - 0.5) + 0.5;
                this.tier = 5;
                this.color = "#FF4500";
            }
            else if(roll > 0.9) {
                //Epic
                this.speedMult = Math.random() * (0.8 - 0.65) + 0.65;
                this.tier = 4;
                this.color = "#9400D3";
            }
            else if(roll > 0.75) {
                //Rare
                this.speedMult = Math.random() * (0.9 - 0.8) + 0.8;
                this.tier = 3;
                this.color = "#1E90FF";
            }
            else if(roll > 0.5) {
                //Uncommon
                this.speedMult = Math.random() * (0.95 - 0.85) + 0.85;
                this.tier = 2;
                this.color = "#6A5ACD";
            }
            else {
                //Common
                this.speedMult = Math.random() * (0.99 - 0.9) + 0.9;
                this.tier = 1;
                this.color = "#696969";
            }
            this.speedMult = this.speedMult.toFixed(2);
            this.text = "Mining speed multiplier: ";
        }
        else if(typeRoll == 2) {
            // Case power enchantment
            if(roll > 0.99) {
                //Legendary
                this.powerMult = Math.random() * (2 - 1.7) + 1.7;
                this.tier = 5;
                this.color = "#FF4500";
            }
            else if(roll > 0.9) {
                //Epic
                this.powerMult = Math.random() * (1.7 - 1.5) + 1.5;
                this.tier = 4;
                this.color = "#9400D3";
            }
            else if(roll > 0.75) {
                //Rare
                this.powerMult = Math.random() * (1.5 - 1.3) + 1.3;
                this.tier = 3;
                this.color = "#1E90FF";
            }
            else if(roll > 0.5) {
                //Uncommon
                this.powerMult = Math.random() * (1.3 - 1.15) + 1.15;
                this.tier = 2;
                this.color = "#6A5ACD";
            }
            else {
                //Common
                this.powerMult = Math.random() * (1.2 - 1.05) + 1.05;
                this.tier = 1;
                this.color = "#696969";
            }
            this.powerMult = this.powerMult.toFixed(2);
            this.text = "Pickaxe power multiplier: ";
        }
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

class Mithril {
    constructor() {
        this.name = "mithril";
        this.power = 500;
        this.exp = 22;
    }
}

class Adamant {
    constructor() {
        this.name = "adamant";
        this.power = 1500;
        this.exp = 75;
    }
}

class Rune {
    constructor() {
        this.name = "rune";
        this.power = 5000;
        this.exp = 225;
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

class MithrilPickaxe {
    constructor() {
        this.name = "Mithril Pickaxe";
        this.minPower = 125;
        this.maxPower = 200; 
        this.power = Math.floor(Math.random() * (this.maxPower - this.minPower + 1)) + this.minPower;
        this.cost = 250;
        this.color = "#9370DB";
    }
}

class AdamantPickaxe {
    constructor() {
        this.name = "Adamant Pickaxe";
        this.minPower = 300;
        this.maxPower = 750; 
        this.power = Math.floor(Math.random() * (this.maxPower - this.minPower + 1)) + this.minPower;
        this.cost = 500;
        this.color = "#1C9017";
    }
}

class RunePickaxe {
    constructor() {
        this.name = "Rune Pickaxe";
        this.minPower = 1000;
        this.maxPower = 2000; 
        this.power = Math.floor(Math.random() * (this.maxPower - this.minPower + 1)) + this.minPower;
        this.cost = 1000;
        this.color = "#01BBED";
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
        updateLog(game, "You are now mining copper!", 0);
        player.currentOre = new Copper();
    }
    if(ore == "iron") {
        if(player.level >= 10) {
            updateLog(game, "You are now mining iron!", 0);
            player.currentOre = new Iron();
        }
        else {
            updateLog(game, "You are not skilled enough to mine this yet!", 0);
        }
    }
    if(ore == "mithril") {
        if(player.level >= 30) {
            updateLog(game, "You are now mining mithril!", 0);
            player.currentOre = new Mithril();
        }
        else {
            updateLog(game, "You are not skilled enough to mine this yet!", 0);
        }
    }
    if(ore == "adamant") {
        if(player.level >= 40) {
            updateLog(game, "You are now mining adamant!", 0);
            player.currentOre = new Adamant();
        }
        else {
            updateLog(game, "You are not skilled enough to mine this yet!", 0);
        }
    }
    if(ore == "rune") {
        if(player.level >= 50) {
            updateLog(game, "You are now mining rune!", 0);
            player.currentOre = new Rune();
        }
        else {
            updateLog(game, "You are not skilled enough to mine this yet!", 0);
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
    if(player.currentOre.name == "mithril") {
        player.mithril++;
        player.totalMithril++;
        console.log("Player Mithril: " + player.mithril);
        //Update the game display!
        game.mithrilCount.innerHTML = "Mithril: " + player.mithril;
    }
    if(player.currentOre.name == "adamant") {
        player.adamant++;
        player.totalAdamant++;
        console.log("Player Adamant: " + player.adamant);
        //Update the game display!
        game.adamantCount.innerHTML = "Adamant: " + player.adamant;
    }
    if(player.currentOre.name == "rune") {
        player.rune++;
        player.totalRune++;
        console.log("Player Rune: " + player.rune);
        //Update the game display!
        game.adamantCount.innerHTML = "Rune: " + player.rune;
    }
}


function craftItem(player, game, item) {
    // Allow the user to craft pickaxes!
    console.log(item.name);
    var success = 0;
    if(item.name == "Copper Pickaxe") {
        if(player.copper >= item.cost && item.maxPower >= player.pickaxe.maxPower) {
            // Do not allow the player to accidentely make a big downgrade!
            chance = Math.random();
            player.copper -= item.cost;
            if(chance >= 0.50) {
                // Successfully crafted!
                success = 1;
                swapItem(game, player, item);
            }
            else {
                updateLog(game, "Crafting failed! Maybe next time...", 0);
            }
        }
        else {
            updateLog(game, "Not enough resources!", 0);
        }
    }
    if(item.name == "Iron Pickaxe") {
        if(player.iron >= item.cost && item.maxPower >= player.pickaxe.maxPower) {
            // Do not allow the player to accidentely make a big downgrade!
            chance = Math.random();
            player.iron -= item.cost;
            if(chance >= 0.50) {
                // Successfully crafted!
                success = 1;
                swapItem(game, player, item);
            }
            else {
                updateLog(game, "Crafting failed! Maybe next time...", 0);
            }
        }
        else {
            updateLog(game, "Not enough resources!", 0);
        }
    }
    if(item.name == "Steel Pickaxe") {
        if(player.steel >= item.cost && item.maxPower >= player.pickaxe.maxPower) {
            // Do not allow the player to accidentely make a big downgrade!
            chance = Math.random();
            player.steel -= item.cost;
            if(chance >= 0.50) {
                // Successfully crafted!
                success = 1;
                swapItem(game, player, item);
            }
            else {
                updateLog(game, "Crafting failed! Maybe next time...", 0);
            }
        }
        else {
            updateLog(game, "Not enough resources!", 0);
        }
    }
    if(item.name == "Mithril Pickaxe") {
        if(player.mithril >= item.cost && item.maxPower >= player.pickaxe.maxPower) {
            // Do not allow the player to accidentely make a big downgrade!
            chance = Math.random();
            player.mithril -= item.cost;
            if(chance >= 0.50) {
                // Successfully crafted!
                success = 1;
                swapItem(game, player, item);
            }
            else {
                updateLog(game, "Crafting failed! Maybe next time...", 0);
            }
        }
        else {
            updateLog(game, "Not enough resources!", 0);
        }
    }
    if(item.name == "Adamant Pickaxe") {
        if(player.adamant >= item.cost && item.maxPower >= player.pickaxe.maxPower) {
            // Do not allow the player to accidentely make a big downgrade!
            chance = Math.random();
            player.adamant -= item.cost;
            if(chance >= 0.30) {
                // Successfully crafted!
                success = 1;
                swapItem(game, player, item);
            }
            else {
                updateLog(game, "Crafting failed! Maybe next time...", 0);
            }
        }
        else {
            updateLog(game, "Not enough resources!", 0);
        }
    }
    if(item.name == "Rune Pickaxe") {
        console.log("Got here!");
        if(player.rune >= item.cost && item.maxPower >= player.pickaxe.maxPower) {
            // Do not allow the player to accidentely make a big downgrade!
            chance = Math.random();
            player.rune -= item.cost;
            if(chance >= 0.25) {
                // Successfully crafted!
                success = 1;
                swapItem(game, player, item);
            }
            else {
                updateLog(game, "Crafting failed! Maybe next time...", 0);
            }
        }
        else {
            updateLog(game, "Not enough resources!", 0);
        }
    }
    if(success == 1) {
        player.enchantment = new Enchantment();
        player.pickaxe.power /= player.enchantment.powerMult;
        clearInterval(myInterval);
        myInterval = setInterval(function() {mine(player, game); saveGame(player);}, player.tickRate * player.enchantment.speedMult);
    }
    updateDisplay(game, player);
}

function swapItem(game, player, item) {
    // Set the player's current pickaxe to the one they just crafted and updates display accordingly
    updateLog(game, "Successfully crafted: " + item.name + " (+" + (item.power - player.pickaxe.power).toFixed(2) + " power!)", 0);
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
                if(roll >= 0.995) {
                    updateLog(game, "A seemingly magical shard emerges from the ore..", 0);
                    player.shards++;
                    player.totalShards++;
                }
                incrementItems(player, game);
                // Level up stuff
                updateLog(game, "You mined " + player.currentOre.name + "! (+" + player.currentOre.exp + " exp)", 1);
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
                    updateLog(game, "You mined an extra big piece of ore! (+" + player.currentOre.exp + " exp)", 0);
                }
            }
            else {
                updateLog(game, "Mining...", 1);
            }       
        }    
        else {
            updateLog(game, "You are not skillful enough to mine this ore!", 0);
        }
    }     
    else {
        updateLog(game, "Not mining anything currently...", 1)
    }
    updateDisplay(game, player);
}

function checkLevel(player, game) {
    // Checks every tick to see if the player has leveled!
    if(player.exp >= player.expMax) {
        levelUp(player, game);
        //Update the game display accordingly
        game.expDisplay.innerHTML = "Exp: " + player.exp + "/" + player.expMax; move(player, game);
        game.levelDisplay.innerHTML = "Level: " + player.level; 
        move(player, game);
    }
}

function levelUp(player, game) {
    // Levels up the player, and upgrades/resets any stats!
    while(player.exp >= player.expMax) {
        nextLevel = player.level + 1;
        updateLog(game, "You have leveled up! (" + player.level + " -> " + nextLevel + ")", 0);
        player.level += 1;
        player.exp -= player.expMax;
        player.expMax = Math.floor(player.expMax * 1.27);
        if(player.level % 10 == 0) {
            player.tickRate *= 0.9;
            updateLog(game, "You feel quicker than before! Mining speed up!", 0);
            console.log(player.tickRate);
            // Clear the game interval and reset with the new tickrate!
            clearInterval(myInterval);
            myInterval = setInterval(function() {mine(player, game); saveGame(player);}, player.tickRate * player.enchantment.speedMult);
        }
        updateDisplay(game, player);
    }
}

function viewStats(player) {
    // Gives the user an alert prompt that has all of their lifetime stats!
    alert("Player stats:\nDate started: " + player.creationDate + "\nTotal copper mined: " + player.totalCopper + "\ntotal iron mined: " + player.totalIron + "\ntotal steel crafted: " + player.totalSteel + "\ntotal magic shards found: " + player.totalShards);
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
    game.pickName.innerHTML = player.pickaxe.name + " <span id='pickPower'> " + "- Power: " + Math.floor(player.pickaxe.power);
    game.pickName.style.color = player.pickaxe.color;
    game.copperCount.innerHTML = "Copper: " + player.copper;
    game.ironCount.innerHTML = "Iron: " + player.iron;
    game.steelCount.innerHTML = "Steel: " + player.steel;
    game.mithrilCount.innerHTML = "Mithril: " + player.mithril;
    game.adamantCount.innerHTML = "Adamant: " + player.adamant;
    game.runeCount.innerHTML = "Rune: " + player.rune;
    game.shardCount.innerHTML = "Magic shards: " + player.shards;
    game.displayTick.innerHTML = "Mining speed: " + Math.round(player.tickRate * player.enchantment.speedMult) + "ms";
    if(player.enchantment.tier != 0 && player.enchantment.speedMult != 1) {
        game.enchantment.innerHTML = "Enchantment: " + player.enchantment.text + player.enchantment.speedMult;
        game.enchantment.style.color = player.enchantment.color;
    }
    else if(player.enchantment.tier != 0) {
        game.enchantment.innerHTML = "Enchantment: " + player.enchantment.text + player.enchantment.powerMult;
        game.enchantment.style.color = player.enchantment.color;
    }
    else {
        game.enchantment.innerHTML = "";
    }
}

function readLine(player, game) {
    // Reads a line from the command line interface and handles it!
    line = game.commandLine.value;
    splitLine = line.split(" ");
    game.commandLine.value = '';
    if(splitLine.length <= 2) {
        if(line == "enchant") {
            enchant(player);
        }
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
        if(line == "craft mpick"){
            item = new MithrilPickaxe();
            craftItem(player, game, item);
        }
        if(line == "craft apick"){
            item = new AdamantPickaxe();
            craftItem(player, game, item);
        }
        if(line == "craft rpick"){
            console.log("Got here!")
            item = new RunePickaxe();
            console.log(item)
            craftItem(player, game, item);
        }
        if(line == "reset") {
            reset(player)
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
            }
            catch(err) {
                updateLog(game, "Invalid argument(s) given!", 0);
                return;
            }
            if(num <= 0) {
                updateLog(game, "Invalid argument(s) given!", 0);
            }
            else {
                exchange(player, game, new Steel(), num);
            }
        }
    }

}

function exchange(player, game, target, num) {
    // Exchange certain ores for other ores!
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
        updateLog(game, "You have crafted " + target.name + "! (" + num + ")", 0);
        updateDisplay(game, player);
    } 
    else {
        updateLog("Not enough resources!", 0)
    }
}

function updateLog(game, message, withDate) {
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
        console.log(withDate);
        if(withDate == 1) {
            document.getElementById(current_row).innerHTML = message + " " + h + ":" + m + ":" + s;
        }
        else {
            document.getElementById(current_row).innerHTML = message; 
        }
        document.getElementById(current_row).style.fontWeight = "bold";
        document.getElementById(prev_row).style.fontWeight = "normal";
    }
    else {
        game.row1.innerHTML = game.row2.innerHTML;
        game.row2.innerHTML = game.row3.innerHTML;
        game.row3.innerHTML = game.row4.innerHTML;
        game.row4.innerHTML = game.row5.innerHTML;
        if(withDate) {
            game.row5.innerHTML = message + " " + h + ":" + m + ":" + s;
        }
        else {
            game.row5.innerHTML = message;
        }
        game.row5.style.fontWeight = "bold";
    }
}

function saveGame(player) {
    // Saves the player state into local storage
    localStorage.setItem('player', JSON.stringify(player));
}

function loadGame() {
    // Loads the player state from local storage
    return JSON.parse(localStorage.getItem('player'));
}

function enchant(player) {
    // Function for enchanting the user's pick with a cool ability!
    if(player.shards >= 5) {
        roll = Math.random();
        typeRoll = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
        enchantment = new Enchantment(roll, typeRoll);
        updateLog(game, "Your pick becomes imbued with magical energy...", 0);
        player.shards -= 5;
        //console.log("TESTING: " + roll + " " +  enchantment.tier + " " + enchantment.speedMult);
        if(typeRoll == 1) {
            player.pickaxe.power /= player.enchantment.powerMult;
            player.enchantment = enchantment;
            clearInterval(myInterval);
            myInterval = setInterval(function() {mine(player, game); saveGame(player);}, player.tickRate * player.enchantment.speedMult);
            updateDisplay(game, player);
        }
        else {
            player.pickaxe.power /= player.enchantment.powerMult;
            player.enchantment = enchantment;
            player.pickaxe.power *= player.enchantment.powerMult;
            clearInterval(myInterval);
            myInterval = setInterval(function() {mine(player, game); saveGame(player);}, player.tickRate * player.enchantment.speedMult);
            updateDisplay(game, player);
        }
    }
    else {
        updateLog(game, "You do not have enough magic shards to make an enchantment!", 0);
    }
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
    player.mithril = 0;
    player.adamant = 0;
    player.rune = 0;
    player.creationDate = new Date();
    player.totalCopper = 0;
    player.totalIron = 0;
    player.totalSteel = 0;
    player.totalMithril = 0;
    player.totalAdamant = 0;
    player.totalRune = 0;
    player.shards = 0;
    player.totalShards = 0;
    player.enchantment = new Enchantment();
    game.enchantment.innerHTML = "";
    updateDisplay(game, player);
}