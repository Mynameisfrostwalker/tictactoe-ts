interface Board {
    setPosition: (marker: string, position: number) => void,
    getPosition: (index: number) => string,
    gameOver: (player1: Player, player2: Player) => Result,
    clear: () => void,
    findEmptyCell: () => number[],
}

interface Result {
    value: boolean,
    result: string,
    winner: string
}

const gameBoard: Board = (
    function() {
        let board: string[] = [
            "", 
            "", 
            "", 
            "", 
            "", 
            "", 
            "", 
            "",
            ""
            ];

        const setPosition = (marker: string, position: number): void => {
            board[position] = marker;
            displayControl.renderBoard();
        };

        const getPosition = (index: number) => board[index];


        const gameOver = (player1: Player, player2: Player): Result => {
             let winPositions = [
                 [
                ((board[0] === board[1]) && (board[1] === board[2]) && (board[1] === player1.getMarker())),
                ((board[3] === board[4]) && (board[4] === board[5]) && (board[4] === player1.getMarker())),
                ((board[6] === board[7]) && (board[7] === board[8]) && (board[7] === player1.getMarker())),
                ((board[0] === board[3]) && (board[3] === board[6]) && (board[3] === player1.getMarker())),
                ((board[1] === board[4]) && (board[4] === board[7]) && (board[4] === player1.getMarker())),
                ((board[2] === board[5]) && (board[5] === board[8]) && (board[5] === player1.getMarker())),
                ((board[0] === board[4]) && (board[4] === board[8]) && (board[4] === player1.getMarker())),
                ((board[2] === board[4]) && (board[4] === board[6]) && (board[4] === player1.getMarker())),
             ],
             [
                ((board[0] === board[1]) && (board[1] === board[2]) && (board[1] === player2.getMarker())),
                ((board[3] === board[4]) && (board[4] === board[5]) && (board[4] === player2.getMarker())),
                ((board[6] === board[7]) && (board[7] === board[8]) && (board[7] === player2.getMarker())),
                ((board[0] === board[3]) && (board[3] === board[6]) && (board[3] === player2.getMarker())),
                ((board[1] === board[4]) && (board[4] === board[7]) && (board[4] === player2.getMarker())),
                ((board[2] === board[5]) && (board[5] === board[8]) && (board[5] === player2.getMarker())),
                ((board[0] === board[4]) && (board[4] === board[8]) && (board[4] === player2.getMarker())),
                ((board[2] === board[4]) && (board[4] === board[6]) && (board[4] === player2.getMarker())), 
             ]
            ]
            if(!winPositions[0].every((value) => value === false)) {
                return {
                    value: true,
                    result: `${player1.getName()} wins`,
                    winner: "Player1"
                }
            } else if(!winPositions[1].every((value) => value === false)) {
                return {
                    value: true,
                    result: `${player2.getName()} wins`,
                    winner: "Player2"
                }
            }else if(!board.some((value) => value === "")) {
                return {
                    value: true,
                    result: `Tie`,
                    winner: "None"
                }
            } else return {
                value: false,
                result: "",
                winner: ""
            };
        }

        const clear = () => {
            board = [
                "", 
                "", 
                "", 
                "", 
                "", 
                "", 
                "", 
                "",
                ""
                ] 
                displayControl.renderBoard();
        }

        const findEmptyCell = (): number[] => {
            const arr = [];
            for (let i = 0; i < board.length; i++) {
                if (board[i] === "") {
                    arr.push(i)
                }
            }
            return arr
        }

        return {
            setPosition,
            getPosition,
            gameOver,
            clear,
            findEmptyCell
        }
    }
)()

interface Player {
    getName: () => string,
    getMarker: () => string
}

const players = (name: string, marker: string): Player => {
    return {
        getName: () => name,
        getMarker: () => marker
    }
}

interface Game {
    begin: (e: Event) => void
    player1?:  Player,
    player2?: Player,
    mode?: string,
    difficulty?: string,
    init: (player1Name: string, player2Name: string, mode: string, difficulty?: string) => void,
    turn?: string,
    changeTurn?: () => void,
    play?: (index?: number) => void,
    restart: () => void,
}

const game: Game = (
    function() { 

        function _isInputElement(element: HTMLInputElement | Element | null): element is HTMLInputElement{
            return (element?.id === "player1") || (element?.id === "player2");
        }

        let game: Game = {

            begin(e: Event) {
                e.preventDefault();
                const aicheck = document.querySelector("#AI");
                const difficulty = document.querySelector("select")?.value;
                if(aicheck instanceof HTMLInputElement){
                    if(e.target instanceof Element) {
                        let player1 = e.target.querySelector("#player1");
                        let player2 = e.target.querySelector("#player2");
                        if(_isInputElement(player1) && _isInputElement(player2)) {
                            let p2 = aicheck.checked ? "AI" : player2.value;
                            let mode = aicheck.checked ? "AI" : "Human"
                            displayControl.displayGame(player1.value, p2);
                            this.init(player1.value, p2, mode, difficulty);
                        }
                    }
                }
            },

            init(player1Name: string, player2Name: string, mode: string, difficulty?: string): void {
                this.player1 = players(player1Name, "A");
                this.player2 = players(player2Name, "B");
                this.turn = this.player1.getMarker();
                this.mode = mode;
                this.difficulty = difficulty;

                this.changeTurn = () => {
                    if(this.turn === this.player1?.getMarker()) {
                        this.turn = this.player2?.getMarker();
                        if(this.player2){
                            displayControl.showTurn(this.player2)
                        }
                    }else {
                        this.turn = this.player1?.getMarker();
                        if(this.player1) {
                            displayControl.showTurn(this.player1)
                        }
                    }
                }

                this.play = (index?: number) => {
                    if(typeof this.turn === "string" && this.changeTurn) {
                        if(mode === "Human" || this.turn === this.player1?.getMarker()) {
                            if(typeof index === "number"){
                                if(gameBoard.getPosition(index) === "") { //????
                                    gameBoard.setPosition(this.turn, index);
                                } else {
                                    return
                                }
                            }
                        }else {
                            if(this.difficulty === "easy") {
                                gameBoard.setPosition(this.turn, aiModes.easyMode());
                            }

                            if(this.difficulty === "medium") {
                                displayControl.removeClick()
                                gameBoard.setPosition(this.turn, aiModes.mediumMode());
                                displayControl.addClick()
                            }

                            if(this.difficulty === "hard") {
                                displayControl.removeClick()
                                gameBoard.setPosition(this.turn, aiModes.hardMode());
                                displayControl.addClick()
                            }
                        }
                        if(this.player1 && this.player2) {
                            const result = gameBoard.gameOver(this.player1, this.player2);
                            if(result.value === true) {
                                displayControl.endTurns(result)
                                return
                            }
                        }
                        this.changeTurn();
                        if(mode === "AI" && this.play && this.turn === this.player2?.getMarker()) {
                            this.play();
                        }
                    }
                }

                if(this.player1) {
                    displayControl.showTurn(this.player1)
                }
                const cells = document.querySelectorAll(".cell");
                cells.forEach((cell) => {
                    cell.addEventListener("click", displayControl.playGame)
                })
            },

            restart() {
                gameBoard.clear();
                game = {begin: this.begin, init: this.init, restart: this.restart};
                displayControl.removeMessage();
                displayControl.displayStart();
            }
        }

        const form = document.querySelector("form");
        form?.addEventListener("submit", game.begin.bind(game))

        const button = document.querySelector("button.restart");
        button?.addEventListener("click", game.restart)

        return game
    }
)()

interface displayControl {
    renderBoard: () => void,
    displayGame: (player1: string, player2: string) => void,
    showTurn: (player: Player) => void,
    displayStart: () => void,
    endTurns: (result: Result) => void,
    playGame: (e: Event) => void,
    removeMessage: () => void,
    removeClick: () => void,
    addClick: () => void,
}

const displayControl = (
    function() {

        function playGame(e: Event) {
            if(e.target instanceof Element) {
                let index = e.target.getAttribute("data-index");
                if(typeof index === "string") {
                    let nIndex = parseInt(index, 10);
                    if(game.play) {
                        game.play(nIndex);
                    }
                }
            }
        }

        const renderBoard = (): void => {
            const cells = document.querySelectorAll(".cell");
            cells.forEach((cell) => {
                let temp = cell?.getAttribute("data-index")
                if(temp) {
                    const index = parseInt(temp, 10);
                    cell.textContent = gameBoard.getPosition(index);
                }
            })
        }

        const displayGame = (player1: string, player2: string) => {
            const wrapper1 = document.querySelector(".wrapper1");
            const wrapper2 = document.querySelector(".wrapper2");
            const player1card = document.querySelector(".player1"); 
            const player2card = document.querySelector(".player2");

            if(wrapper1 && wrapper2 && player1card && player2card) {
                wrapper1.classList.add("invisible");
                wrapper2.classList.remove("invisible");
                player1card.textContent = player1;
                player2card.textContent = player2;
            }
        }

        const showTurn = (player: Player) => {
            const player1card = document.querySelector(".player1"); 
            const player2card = document.querySelector(".player2");

            if(player.getName() === player1card?.textContent && player2card) {
                player1card.classList.add("turn");
                if(player2card.classList.contains("turn")) {
                    player2card.classList.remove("turn");
                }
            } else if (player.getName() === player2card?.textContent && player1card) {
                player2card.classList.add("turn")
                if(player1card.classList.contains("turn")) {
                    player1card.classList.remove("turn");
                }
            }
        }

        const displayStart = () => {
            const wrapper1 = document.querySelector(".wrapper1");
            const wrapper2 = document.querySelector(".wrapper2");

            if(wrapper1 && wrapper2) {
                wrapper1.classList.remove("invisible");
                wrapper2.classList.add("invisible");
            }
        }

        const endTurns = (result: Result) => {
            const cells = document.querySelectorAll(".cell");
            const message = document.querySelector(".message");

            cells.forEach((cell) => {
                cell.removeEventListener("click", playGame)
            })
            if(message) {
                message.textContent = result.result;
            }
        }

        const removeMessage = () => {
            const message = document.querySelector(".message"); 
            if(message) {
                message.textContent = "";
            }
        }

        const input2 = document.querySelector("#player2");
        const aicheck = document.querySelector("#AI");
        const mode = document.querySelector("#difficulty");

        const _toggleMode = (e: Event) => {
            if(e.target instanceof HTMLInputElement) {
                if(e.target.checked && (input2 instanceof HTMLInputElement)) {
                    input2?.setAttribute("disabled", "");
                    input2.value = "";
                    mode?.removeAttribute("disabled");
                } else {
                    input2?.removeAttribute("disabled");
                    mode?.setAttribute("disabled", "");
                }
            }
        }

        aicheck?.addEventListener("input", _toggleMode);

        const removeClick = () => {
            const cells = document.querySelectorAll(".cell");

            cells.forEach((cell) => {
                cell.removeEventListener("click", playGame)
            })
        }

        const addClick = () => {
            const cells = document.querySelectorAll(".cell");

            cells.forEach((cell) => {
                cell.addEventListener("click", playGame)
            })
        }

        return {
            renderBoard,
            displayGame,
            showTurn,
            displayStart,
            endTurns,
            playGame,
            removeMessage,
            removeClick,
            addClick
        }
    }
)()

interface AImodes {
    easyMode: () => number,
    hardMode: () => number,
    mediumMode: () => number,
}

const aiModes: AImodes = (
    function() {
        const easyMode = (): number => {
            const options = gameBoard.findEmptyCell();
            const value = Math.floor(Math.random() * options.length);
            return options[value];
        }

        const hardMode = (): number => {
            function findFreeCell() {
              if(gameBoard.findEmptyCell().length === 0) {
                  return false
              }  else {
                  return true
              }
            }

            function evaluate() {
                if(game.player1 && game.player2) {
                    const ans = gameBoard.gameOver(game.player1, game.player2);
                    if(ans.winner === "Player1") {
                        return -10
                    } else if(ans.winner === "Player2") {
                        return +10
                    } else {
                        return 0;
                    }
                }
            }

            function minimax (depth: number, player: string) {
                let score = evaluate();

                if(score === 10) {
                    return score - depth
                }

                if(score === -10) {
                    return score + depth
                }

                if(findFreeCell() === false) {
                    return 0
                }

                if(player === game.player2?.getName()) {
                    let best = -1000;
                    for (let i = 0; i < 9; i++) {
                        if (gameBoard.getPosition(i) === "") {
                            gameBoard.setPosition(game.player2.getMarker(), i)
                            if(game.player1) {
                                let recursive = minimax(depth + 1, game.player1.getName())
                                if(typeof recursive === "number") {
                                    best = Math.max(best, recursive);
                                    gameBoard.setPosition("", i)
                                }
                            }
                        }
                    }
                    return best;
                }else if (player === game.player1?.getName()) {
                    let best = 1000;
                    for (let i = 0; i < 9; i++) {
                        if (gameBoard.getPosition(i) === "") {
                            gameBoard.setPosition(game.player1.getMarker(), i)
                            if(game.player2) {
                                let recursive = minimax(depth + 1, game.player2.getName())
                                if(typeof recursive === "number"){
                                    best = Math.min(best, recursive);
                                    gameBoard.setPosition("", i)
                                }
                            }
                        }
                    }
                    return best
                }
            }

            function findBest(): number {
                let bestVal = -1000;
                let bestMove = 0;
                for(let i = 0; i < 9; i++) {
                    if(gameBoard.getPosition(i) === "") {
                        if(game.player1 && game.player2) {
                            gameBoard.setPosition(game.player2.getMarker(), i)
                            let moveVal = minimax(0, game.player1?.getName());
                            gameBoard.setPosition("", i)

                            if(typeof moveVal === "number") {
                                if (moveVal > bestVal) {
                                    bestMove = i;
                                    bestVal = moveVal;
                                }
                            }
                        }
                    }
                }
                return bestMove;
            }

            return findBest();
        }

        const mediumMode = () => {
            let val = Math.random();
            if (val <= 0.5) {
                return easyMode()
            } else {
                return hardMode()
            }
        }

        return {
            easyMode,
            hardMode,
            mediumMode
        }
    }
)()