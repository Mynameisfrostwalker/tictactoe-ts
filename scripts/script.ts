interface Board {
    play: (marker: string, position: number) => void
}

const gameBoard: Board = (
    function() {
        const board: string[] = [
            "empty", 
            "empty", 
            "empty", 
            "empty", 
            "empty", 
            "empty", 
            "empty", 
            "empty",
            "empty"
            ];

        const play = (marker: string, position: number): void => {
           if(board[position] === "empty") {
                board[position] = marker;
           }
        }
        return {
            play
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