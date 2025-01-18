let game = {
    score: 0,
    currentGame: [],
    playerMoves: [],
    choices: [],
}

module.exports = { game };
// why the curly braces? Well this is because we'll be exporting more than  
// one object and function from this file,  so we need to put them in curly braces. 