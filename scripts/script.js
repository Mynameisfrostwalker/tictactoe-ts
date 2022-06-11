"use strict";
const gameBoard = (function () {
    const board = [
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
    return {
        setPosition,
        getPosition
    };
})();
const players = (name, marker) => {
    return {
        getName: () => name,
        turn: () => marker
    };
};
const game = (function () {
    const game = {
        init() {
            this.player1 = players("player1", "A");
            this.player2 = players("player2", "B");
            this.turn = this.player1.turn();
            this.changeTurn = () => {
                var _a, _b, _c;
                if (this.turn === ((_a = this.player1) === null || _a === void 0 ? void 0 : _a.turn())) {
                    this.turn = (_b = this.player2) === null || _b === void 0 ? void 0 : _b.turn();
                }
                else {
                    this.turn = (_c = this.player1) === null || _c === void 0 ? void 0 : _c.turn();
                }
            };
            this.play = (index) => {
                if (typeof this.turn === "string" && this.changeTurn) {
                    gameBoard.setPosition(this.turn, index);
                    this.changeTurn();
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
