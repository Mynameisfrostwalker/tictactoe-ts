interface Board {
    setPosition: (marker: string, position: number) => void,
    getPosition: (index: number) => string
}

const gameBoard: Board = (
    function() {
        const board: string[] = [
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
        }

        const getPosition = (index: number) => board[index]
        return {
            setPosition,
            getPosition
        }
    }
)()

interface Player {
    getName: () => string,
    turn: () => string
}

const players = (name: string, marker: string): Player => {
    return {
        getName: () => name,
        turn: () => marker
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
                this.turn = this.player1.turn()
                this.changeTurn = () => {
                    if(this.turn === this.player1?.turn()) {
                        this.turn = this.player2?.turn();
                    }else {
                        this.turn = this.player1?.turn();
                    }
                }
                this.play = (index: number) => {
                    if(typeof this.turn === "string" && this.changeTurn) {
                        gameBoard.setPosition(this.turn, index)
                        this.changeTurn()
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