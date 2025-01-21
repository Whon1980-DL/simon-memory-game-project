let game = {
    score: 0,
    currentGame: [],
    playerMoves: [],
    turnNumber: 0,
    choices: ["button1", "button2", "button3", "button4"]
}

function newGame() {
    game.score = 0;
    game.playerMoves =[];
    game.currentGame = [];
    for (let circle of document.getElementsByClassName("circle")) {
        if (circle.getAttribute("data-listener") != "true") {
            /* the click object as 'e' with that  because we're going to need it.
                And the reason we need it, is that we're going to  
                get our click targets ID. So depending on which  circle, we click on the ID will be button1,  
                button2, button3, or button4.
            */
            circle.addEventListener("click", (e) => {
                let move = e.target.getAttribute("id");
                lightsOn(move);
                game.playerMoves.push(move);
                playerTurn();
            });
            circle.setAttribute("data-listener", "true");
        } 
    }

    showScore();
    addTurn();
    game.turnNumber = 0;
}

function addTurn() {
    game.playerMoves = [];
    game.currentGame.push(game.choices[(Math.floor(Math.random() * 4))]);
    showTurns();
}

function showScore() {
      document.getElementById("score").innerText = game.score
}

function lightsOn(circ) {
    document.getElementById(circ).classList.add("light");
    // setTimeot to remove class after 400ms
    setTimeout(() => {
        document.getElementById(circ).classList.remove("light")
    }, 400);
}

function showTurns() {
    game.turnNumber = 0;
    let turns = setInterval(() => {
        lightsOn(game.currentGame[game.turnNumber]);
        game.turnNumber++;
        if (game.turnNumber >= game.currentGame.length) {
            clearInterval(turns);
        }
    }, 800);
}

function playerTurn() {
    
}

module.exports = { game, newGame, showScore, addTurn, lightsOn, showTurns };
// why the curly braces? Well this is because we'll be exporting more than  
// one object and function from this file,  so we need to put them in curly braces. 

