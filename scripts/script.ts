interface Board {
    setPosition: (marker: string, position: number) => void,
    getPosition: (index: number) => string,
    gameOver: (player1: Player, player2: Player) => Result
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
        return {
            setPosition,
            getPosition,
            gameOver
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
    player1?:  Player,
    player2?: Player,
    init: (player1Name: string, player2Name: string) => void,
    turn?: string,
    changeTurn?: () => void,
    play?: (index: number) => void,
}

const game: Game = (
    function() {
        const game: Game = {
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
                        this.changeTurn();
                        if(this.player1 && this.player2) {
                            gameBoard.gameOver(this.player1, this.player2);
                        }
                    }
                }

                if(this.player1) {
                    displayControl.showTurn(this.player1)
                }
            }
        }

        return game
    }
)()

interface displayControl {
    renderBoard: () => void,
    displayGame: (player1: string, player2: string) => void
}

const displayControl = (
    function() {
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

        return {
            renderBoard,
            displayGame,
            showTurn
        }
    }
)()

function play(e: Event) {
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

function isInputElement(element: HTMLInputElement | Element | null): element is HTMLInputElement{
    return (element?.id === "player1") || (element?.id === "player2");
}

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

const cells = document.querySelectorAll(".cell");
cells.forEach((cell) => {
    cell.addEventListener("click", play)
})

const form = document.querySelector("form");
form?.addEventListener("submit", begin)