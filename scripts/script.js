"use strict";
const gameBoard = (function () {
    const board = [
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
    const play = (marker, position) => {
        if (board[position] === "empty") {
            board[position] = marker;
        }
    };
    return {
        play
    };
})();
const players = (name, marker) => {
    return {
        name,
        turn: () => marker
    };
};
const game = (function () {
})();
