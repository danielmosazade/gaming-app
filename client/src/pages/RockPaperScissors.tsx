import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";

interface RPSProps {
  onBackToMenu: () => void;
}

type Choice = "🪨" | "📄" | "✂️";

export default function RockPaperScissors({ onBackToMenu }: RPSProps) {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [score, setScore] = useState({ player: 0, computer: 0 });

  const choices: Choice[] = ["🪨", "📄", "✂️"];

  const playRound = (choice: Choice) => {
    const compChoice = choices[Math.floor(Math.random() * choices.length)];
    setPlayerChoice(choice);
    setComputerChoice(compChoice);

    let roundResult = "";
    if (choice === compChoice) roundResult = "תיקו 🤝";
    else if (
      (choice === "🪨" && compChoice === "✂️") ||
      (choice === "📄" && compChoice === "🪨") ||
      (choice === "✂️" && compChoice === "📄")
    ) {
      roundResult = "🎉 ניצחת!";
      setScore((prev) => ({ ...prev, player: prev.player + 1 }));
    } else {
      roundResult = "💻 המחשב ניצח!";
      setScore((prev) => ({ ...prev, computer: prev.computer + 1 }));
    }

    setResult(roundResult);
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
    setScore({ player: 0, computer: 0 });
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={1} p={4}>
      <Typography variant="h4">Rock-Paper-Scissors</Typography>
      <Typography fontSize={14} color="text.secondary">
        בחר סמל והראה למחשב מי המנצח
      </Typography>

      {/* כפתורים עם אייקונים */}
      <Box display="flex" gap={2} mt={2}>
        {choices.map((c) => (
          <Button
            key={c}
            onClick={() => playRound(c)}
            sx={{
              fontSize: 30,
              width: 60,
              height: 60,
              borderRadius: 2,
              transition: "transform 0.1s",
              "&:hover": { transform: "scale(1.2)" },
            }}
          >
            {c}
          </Button>
        ))}
      </Box>

      {/* תוצאה */}
      {playerChoice && computerChoice && (
        <Box textAlign="center" mt={2} display="flex" flexDirection="column" gap={1}>
          <Typography fontSize={24}>
            שחקן: {playerChoice} | מחשב: {computerChoice}
          </Typography>
          <Typography variant="h6">{result}</Typography>
        </Box>
      )}

      {/* ניקוד */}
      <Typography mt={1}>
        ניקוד – אתה: {score.player} | מחשב: {score.computer}
      </Typography>

      {/* כפתורים משחק חדש / חזרה */}
      <Box display="flex" gap={2} mt={2}>
        <Button variant="contained" onClick={resetGame}>
          🔄 משחק חדש
        </Button>
        <Button variant="outlined" color="secondary" onClick={onBackToMenu}>
          ↩️ חזור לתפריט
        </Button>
      </Box>
    </Box>
  );
}
