"use strict";
const gameBoard = (function () {
    const board = [
        "A",
        "B",
        "A",
        "B",
        "A",
        "A",
        "A",
        "B",
        "B"
    ];
    const setPosition = (marker, position) => {
        if (board[position] === "empty") {
            board[position] = marker;
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
displayControl.renderBoard();
