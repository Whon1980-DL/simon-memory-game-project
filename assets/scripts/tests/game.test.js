/**
 * @jest-environment jsdom
 */

const { game, newGame, showScore, addTurn ,lightsOn, showTurns, playerTurn } = require("../game")

// spy on window object for the alert method as alert is one of window methods
// we will catch the alert when it happen and divert it harmlessly into an empty funciton
jest.spyOn(window, "alert").mockImplementation(() => {});

beforeAll(() => {
    let fs = require("fs");
    let fileContents = fs.readFileSync("index.html", "utf-8");
    document.open();
    document.write(fileContents);
    document.close();
});

describe("game object contains correct keys", () => {
    test("score key exists", () => {
        expect("score" in game).toBe(true);
    })
    test("currentGame key exists", () => {
        expect("currentGame" in game).toBe(true);
    })
    test("playerMoves key exists", () => {
        expect("playerMoves" in game).toBe(true);
    })
    test("choices key exists", () => {
        expect("choices" in game).toBe(true);
    })
    test("turnNumber key exists", () => {
        expect("turnNumber" in game).toBe(true);
    })
    test("choices contain correct ids", () => {
        expect(game.choices).toEqual(["button1", "button2", "button3", "button4"])
    });
    test("turnInProgress key exists", () => {
        expect("turnInProgress" in game).toBe(true);
    })
    test("turnInProgress key value is false", () => {
        expect(game.turnInProgress).toBe(false);
    })

    test("lastButton key exists", () => {
        expect("lastButton" in game).toBe(true);
    })
});

describe("newGame works correctly", () => {
    // I want to use another beforeAll  function, because we want to set  
    // up the game state with some fake values to  see if the new game function resets them.
    beforeAll(() => {
        game.score = 42;
        game.playerMoves = ["button1", "button2"];
        game.currentGame = ["button1", "button2"];
        document.getElementById("score").innerText = "42";
        game.turnNumber = 42
        game.turnInProgress = true;
        game.lastButton = "button1";
        newGame()
    });
    test("should set game score to zero", () => {
        expect(game.score).toEqual(0);
    });
    test("should clear the player moves array", () =>{
        expect(game.playerMoves.length).toBe(0);
    });
    test("should be one move in the computer's game array", () => {
        expect(game.currentGame.length).toBe(1)
    });
    test("should display 0 for the element with id of score", () => {
        expect(document.getElementById("score").innerText).toEqual(0)
    });
    test("should set turn number to zero", () => {
        expect(game.turnNumber).toEqual(0);
    });
    test("expect data-listener to be true", () => {
        newGame();
        const elements = document.getElementsByClassName("circle)");
        for (let element of elements) {
            expect(element.getAttribute("data-listener")).toEqual("true");
        }
    });
    test("expect turnInProgress value to be set to false", () => {
        expect(game.turnInProgress).toEqual(false);
    })
    test("expect lastButton value to be set to empty", () => {
        expect(game.lastButton).toBe("");
    })
});

describe("gameplay works correctly", () => {
    // beforeEach runs before each test is run not like before all that run before all test is run
    beforeEach(() => {
        game.score = 0;
        game.currentGame = [];
        game.playerMoves = [];
        addTurn();
    });
    afterEach(() => {
        game.score = 0;
        game.currentGame = [];
        game.playerMoves = [];
    });
    test("addTurn adds a new turn to the game", () => {
        addTurn();
        expect(game.currentGame.length).toBe(2);
    });
    test("should add correct class to light up the buttons", () => {
        let button = document.getElementById(game.currentGame[0]);
        lightsOn(game.currentGame[0]);
        expect(button.classList).toContain("light");
    });
    test("showTurns should update game.turnNumber", () => {
        game.turnNumber = 42;
        showTurns();
        expect(game.turnNumber).toBe(0);
    });
    test("should increment the score if the turn is correct", () => {
        /* To simulate the situation, as you'll remember, in the beforeEach  function for our gameplay, we're adding one turn.
            So we're going to take that turn and  we're going to push it into the playerMoves array  
            before calling playerTurn. That way we know that  we have a correct answer because the playerTurn  
            and the computersTurn match each other
        */
        game.playerMoves.push(game.currentGame[0]);
        playerTurn();
        expect(game.score).toBe(1);
    });
    test("should call an alert if the move is wrong", () => {
        game.playerMoves.push("wrong");
        playerTurn();
        expect(window.alert).toBeCalledWith("Wrong move!");
    });
    test("showTurns toggle turnInProgress to true", () => {
        showTurns();
        expect(game.turnInProgress).toBe(true);
    });
    test("clicking during computer sequence should fail", () => {
        showTurns();
        game.lastButton = "";
        document.getElementById("button2").click();
        expect(game.lastButton).toEqual("");
    });
});