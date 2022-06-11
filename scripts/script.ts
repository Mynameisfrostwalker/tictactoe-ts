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
    init: () => void,
    turn?: string,
    changeTurn?: () => void,
    play?: (index: number) => void,
}

const game: Game = (
    function() {
        const game: Game = {
            init(): void{
                this.player1 = players("player1", "A");
                this.player2 = players("player2", "B");
                this.turn = this.player1.getMarker()
                this.changeTurn = () => {
                    if(this.turn === this.player1?.getMarker()) {
                        this.turn = this.player2?.getMarker();
                    }else {
                        this.turn = this.player1?.getMarker();
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
            }
        }

        return game
    }
)()

interface displayControl {
    renderBoard: () => void
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

        return {
            renderBoard,
        }
    }
)()

function play(e: Event) {
    if(!game.player1) {
        game.init();
    }
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

const cells = document.querySelectorAll(".cell");
cells.forEach((cell) => {
    cell.addEventListener("click", play)
})