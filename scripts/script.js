"use strict";
const gameBoard = (function () {
    let board = [
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
    const setPosition = (marker, position) => {
        if (board[position] === "") {
            board[position] = marker;
            displayControl.renderBoard();
        }
    };
    const getPosition = (index) => board[index];
    const gameOver = (player1, player2) => {
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
        ];
        if (!winPositions[0].every((value) => value === false)) {
            alert("Player 1 wins");
            return true;
        }
        else if (!winPositions[1].every((value) => value === false)) {
            alert("Player 2 wins");
            return true;
        }
        else if (!board.some((value) => value === "")) {
            alert("tie");
            return true;
        }
        else
            return false;
    };
    return {
        setPosition,
        getPosition,
        gameOver
    };
})();
const players = (name, marker) => {
    return {
        getName: () => name,
        getMarker: () => marker
    };
};
const game = (function () {
    const game = {
        init() {
            this.player1 = players("player1", "A");
            this.player2 = players("player2", "B");
            this.turn = this.player1.getMarker();
            this.changeTurn = () => {
                var _a, _b, _c;
                if (this.turn === ((_a = this.player1) === null || _a === void 0 ? void 0 : _a.getMarker())) {
                    this.turn = (_b = this.player2) === null || _b === void 0 ? void 0 : _b.getMarker();
                }
                else {
                    this.turn = (_c = this.player1) === null || _c === void 0 ? void 0 : _c.getMarker();
                }
            };
            this.play = (index) => {
                if (typeof this.turn === "string" && this.changeTurn) {
                    gameBoard.setPosition(this.turn, index);
                    this.changeTurn();
                    if (this.player1 && this.player2) {
                        gameBoard.gameOver(this.player1, this.player2);
                    }
                }
            };
        }
    };
    return game;
})();
const displayControl = (function () {
    const renderBoard = () => {
        const cells = document.querySelectorAll(".cell");
        cells.forEach((cell) => {
            let temp = cell === null || cell === void 0 ? void 0 : cell.getAttribute("data-index");
            if (temp) {
                const index = parseInt(temp, 10);
                cell.textContent = gameBoard.getPosition(index);
            }
        });
    };
    return {
        renderBoard,
    };
})();
function play(e) {
    if (!game.player1) {
        game.init();
    }
    if (e.target instanceof Element) {
        let index = e.target.getAttribute("data-index");
        if (typeof index === "string") {
            let nIndex = parseInt(index, 10);
            if (game.play) {
                game.play(nIndex);
            }
        }
    }
}
const cells = document.querySelectorAll(".cell");
cells.forEach((cell) => {
    cell.addEventListener("click", play);
});
