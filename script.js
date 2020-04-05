window.onload = function() {
    // Main function -> Sets up all variables at the start and begins the game loop!
    player = new Player();
    game = new Game();
    game.copperPic.addEventListener("click", function() {switchOre(player, game, "copper")});
    game.ironPic.addEventListener("click", function() {switchOre(player, game, "iron")});
    window.addEventListener('keydown', (event) => {
        if(event.keyCode === 13) {
            this.readLine(player, game)
        }
    });
    this.setInterval(function() {mine(player, game);}, game.tickRate)
};

class Player {
    // Describes all of the stats of the player!
    constructor() {
        this.progress = 0;
        this.exp = 0;
        this.expMax = 12;
        this.level = 1;
        // Player items/states
        this.currentOre = null;
        this.pickaxe = new WoodPickaxe();
        this.copper = 0;
        this.iron = 0;
    }
}

class Game {
    // Describes all of the game objects such as display etc.
    constructor() {
        this.logRow = 1;
        this.tickRate = 3000;
        this.progressBar = document.getElementById("myBar");
        this.progressPercent = document.getElementById("progressText");
        this.levelDisplay = document.getElementById("level");
        this.expDisplay = document.getElementById("exp");
        this.copperPic = document.getElementById("copper");
        this.copperCount = document.getElementById("inv1");
        this.ironPic = document.getElementById("iron");
        this.ironCount = document.getElementById("inv2");
        this.pickName = document.getElementById("pickName");
        this.pickPower = document.getElementById("pickPower");
        this.commandLine = document.getElementById("cmdline")
    }
}

class Copper {
    // Describes the stats for copper ore!
    constructor() {
        this.name = "copper";
        this.power = 25;
        this.exp = 1;
    }

}

class Iron {
    // Describes the stats for iron ore!
    constructor() {
        this.name = "iron";
        this.power = 500;
        this.exp = 4;
    }

}

class WoodPickaxe {
    // Describes the equippable items!
    constructor() {
        this.name = "Wooden Pickaxe";
        this.minPower = 5;
        this.maxPower = 5; 
        this.power = Math.floor(Math.random() * (this.maxPower - this.minPower + 1)) + this.minPower;
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
        updateLog(game, "You are now mining iron!");
        player.currentOre = new Iron();
    }
}

function incrementItems(player, game) {
    // Add the correct items to the player's inventory after successful mine!
    if(player.currentOre.name == "copper") {
        player.copper++;
        console.log("Player copper: " + player.copper);
        //Update the game display!
        game.copperCount.innerHTML = "Copper: " + player.copper;
    }
    if(player.currentOre.name == "iron") {
        player.iron++;
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
    // Add more items here later..
}

function swapItem(game, player, item) {
    // Set the player's current pickaxe to the one they just crafted and updates display accordingly
    updateLog(game, "Successfully crafted: " + item.name + " (+" + (item.power - player.pickaxe.power) + " power!)");
    player.pickaxe = item;
    if(item.name == "Copper Pickaxe") {
        game.pickName.innerHTML = "Copper Pickaxe <span id='pickPower'> " + "- Power: " + item.power;
        game.pickName.style.color = "#e67300";
        //game.pickPower.innerHTML = " - Power: " + item.power;
    }
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
}

function move(player, game) {
    // Moves the player's exp progress bar!
    player.progress = Math.floor((player.exp / player.expMax) * 100);
    game.progressBar.style.width = player.progress + "%";
    game.progressPercent.innerHTML = player.progress + "%";
}

function readLine(player, game) {
    // Reads a line from the command line interface and handles it!
    line = game.commandLine.value;
    console.log(line);
    game.commandLine.value = '';
    if(line == "craft cpick") {
        item = new CopperPickaxe();
        craftItem(player, game, item);
    }
}

function updateLog(game, message) {
    // Biggest QOL issue is this log 
    // -> Will need a major rework where the newest item appears in bold at the bottom and older entries bubble up
    // Updates the game activity log! -> Keeps track of all player actions
    current_row = "row" + game.logRow;
    if(game.logRow != 1) {
        prev_row = "row" + (game.logRow - 1);
    }
    else {
        prev_row = "row5"
    }
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
    // Update the game display elements!
    document.getElementById(current_row).innerHTML = message + " " + h + ":" + m + ":" + s;
    document.getElementById(current_row).style.fontWeight = "bold";
    document.getElementById(prev_row).style.fontWeight = "normal";
    game.logRow++;
    if(game.logRow == 6) {
        game.logRow = 1;
    } 
}