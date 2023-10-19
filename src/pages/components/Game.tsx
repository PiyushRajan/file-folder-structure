import React, { useState } from "react";
import { VStack, Text, Box, Flex, Button } from "@chakra-ui/react";

const Game = () => {
  const [board, setBoard] = useState<string[] | null>(Array(9).fill(null));
  const [turnX, setTurnX] = useState<boolean>(true);
  const [gameWinner, setGameWinner] = useState<string | null>(null);
  const [winnerIndex, setWinnerIndex] = useState<number[] | null>(null);
  const [isDraw, setIsDraw] = useState<boolean>(false);

  const winningPositions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const findWinner = (board: string[]) => {
    for (const position of winningPositions) {
      let [a, b, c] = position;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const findWinningIndex = (board: string[]) => {
    for (const position of winningPositions) {
      let [a, b, c] = position;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return [a, b, c];
      }
    }
    return null;
  };

  const checkDraw = (board: string[]) => {
    return board.every((ele) => ele !== null);
  };

  const handleClick = (index: number) => {
    if (board && board[index] === null && !gameWinner) {
      let newBoard = [...board];
      if (turnX === true) {
        newBoard[index] = "X";
      } else {
        newBoard[index] = "0";
      }
      let winner = findWinner(newBoard);
      if (winner) {
        let winIndex = findWinningIndex(newBoard);
        setWinnerIndex(winIndex);
        setGameWinner(winner);
      } else if (checkDraw(newBoard)) {
        setIsDraw(true);
      }
      setBoard(newBoard);
      setTurnX(!turnX);
    }
  };

  const handleNewGame = () => {
    setBoard(Array(9).fill(null));
    setTurnX(true);
    setGameWinner(null);
    setWinnerIndex(null);
    setIsDraw(false);
  };

  let text;

  if (gameWinner) {
    text = `Player ${gameWinner} Wins the Game`;
  } else if (isDraw) {
    text = "Match is Draw";
  } else {
    text = turnX ? "Player X Turn" : "Player 0 Turn";
  }

  return (
    <VStack justifyContent="space-between" height="96vh">
      <Text fontWeight={600} fontSize={"18px"}>
        {text}
      </Text>
      <Box
        display="Grid"
        gridTemplateColumns="80px 80px 80px"
        gridTemplateRows="80px 80px 80px"
      >
        {board?.map((ele, index) => (
          <Flex
            key={index}
            borderRight={index % 3 !== 2 ? "1px solid black" : "none"}
            borderBottom={index < 6 ? "1px solid black" : "none"}
            justifyContent="center"
            alignItems="center"
            onClick={() => handleClick(index)}
            fontSize="18px"
            backgroundColor={
              winnerIndex?.includes(index) ? "lightblue" : "none"
            }
          >
            {ele}
          </Flex>
        ))}
      </Box>
      <Button
        variant="unstyled"
        width={"120px"}
        height={"50px"}
        fontWeight={600}
        fontSize={"18px"}
        backgroundColor={"black"}
        color={"white"}
        border={"none"}
        borderRadius={"12px"}
        onClick={handleNewGame}
      >
        New Game
      </Button>
    </VStack>
  );
};

export default Game;
