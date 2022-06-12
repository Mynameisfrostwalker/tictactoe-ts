interface Board {
    setPosition: (marker: string, position: number) => void,
    getPosition: (index: number) => string,
    gameOver: (player1: Player, player2: Player) => Result,
    clear: () => void
}

interface Result {
    value: boolean,
    result: string
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
           if(board[position] === "") {
                board[position] = marker;
                displayControl.renderBoard();
           }
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
                    result: `${player1.getName()} wins`
                }
            } else if(!winPositions[1].every((value) => value === false)) {
                return {
                    value: true,
                    result: `${player2.getName()} wins`
                }
            }else if(!board.some((value) => value === "")) {
                return {
                    value: true,
                    result: `Tie`
                }
            } else return {
                value: false,
                result: ""
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

        return {
            setPosition,
            getPosition,
            gameOver,
            clear
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
    init: (player1Name: string, player2Name: string) => void,
    turn?: string,
    changeTurn?: () => void,
    play?: (index: number) => void,
    restart: () => void,
}

const game: Game = (
    function() { 

        let game: Game = {

            begin(e: Event) {
                e.preventDefault();
                if(e.target instanceof Element) {
                    let player1 = e.target.querySelector("#player1");
                    let player2 = e.target.querySelector("#player2");
                    if(isInputElement(player1) && isInputElement(player2)) {
                        displayControl.displayGame(player1.value, player2.value);
                        this.init(player1.value, player2.value)
                    }
                }
            },

            init(player1Name: string, player2Name: string): void {
                this.player1 = players(player1Name, "A");
                this.player2 = players(player2Name, "B");
                this.turn = this.player1.getMarker();

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

                this.play = (index: number) => {
                    if(typeof this.turn === "string" && this.changeTurn) {
                        gameBoard.setPosition(this.turn, index);
                        if(this.player1 && this.player2) {
                            const result = gameBoard.gameOver(this.player1, this.player2);
                            if(result.value === true) {
                                displayControl.endTurns(result)
                                return
                            }
                        }
                        this.changeTurn();
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

        return {
            renderBoard,
            displayGame,
            showTurn,
            displayStart,
            endTurns,
            playGame,
            removeMessage
        }
    }
)()

function isInputElement(element: HTMLInputElement | Element | null): element is HTMLInputElement{
    return (element?.id === "player1") || (element?.id === "player2");
}

/*

function begin(e: Event) {
    e.preventDefault();
    if(e.target instanceof Element) {
        let player1 = e.target.querySelector("#player1");
        let player2 = e.target.querySelector("#player2");
        if(isInputElement(player1) && isInputElement(player2)) {
            displayControl.displayGame(player1.value, player2.value);
            game.init(player1.value, player2.value)
        }
    }
}

const restart = () => {
    game.restart();
    displayControl.removeMessage();
    displayControl.displayStart();
}

const form = document.querySelector("form");
form?.addEventListener("submit", begin)

const button = document.querySelector("button.restart");
button?.addEventListener("click", restart)

*/