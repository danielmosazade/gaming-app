type Player = "X" | "O" | null;

interface GameResult {
  winner: Player;
  isDraw: boolean;
}

export function calculateGameResult(squares: Player[]): GameResult {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], isDraw: false };
    }
  }

  // ✅ אם אין null בלוח ואין מנצח → תיקו
  const isBoardFull = squares.every((cell) => cell !== null);
  if (isBoardFull) {
    return { winner: null, isDraw: true };
  }

  return { winner: null, isDraw: false };
}
