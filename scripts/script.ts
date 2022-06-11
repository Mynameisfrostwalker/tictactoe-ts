interface Board {
    setPosition: (marker: string, position: number) => void,
    getPosition: (index: number) => string
}

const gameBoard: Board = (
    function() {
        const board: string[] = [
            "X", 
            "O", 
            "X", 
            "O", 
            "X", 
            "X", 
            "X", 
            "O",
            "O"
            ];

        const setPosition = (marker: string, position: number): void => {
           if(board[position] === "empty") {
                board[position] = marker;
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
    readonly getName: () => string,
    readonly turn: () => string
}

const players = (name: string, marker: string): Player => {
    return {
        getName: () => name,
        turn: () => marker
    }
}

const game = (
    function() {
        
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

displayControl.renderBoard()