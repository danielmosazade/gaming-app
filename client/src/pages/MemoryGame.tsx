import { useState, useEffect } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";

interface MemoryGameProps {
  onBackToMenu: () => void;
}

interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryGame({ onBackToMenu }: MemoryGameProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    const values = ["🍎", "🍌", "🍇", "🍉", "🍒", "🥝"];
    const deck = [...values, ...values]
      .map((value, index) => ({
        id: index,
        value,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5);

    setCards(deck);
  }, []);

  const handleFlip = (id: number) => {
    if (flippedCards.length === 2) return;

    setCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, isFlipped: true } : card
      )
    );

    setFlippedCards((prev) => [...prev, id]);
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstId, secondId] = flippedCards;
      const firstCard = cards.find((c) => c.id === firstId);
      const secondCard = cards.find((c) => c.id === secondId);

      if (firstCard && secondCard) {
        if (firstCard.value === secondCard.value) {
          setCards((prev) =>
            prev.map((card) =>
              card.value === firstCard.value
                ? { ...card, isMatched: true }
                : card
            )
          );
        } else {
          setTimeout(() => {
            setCards((prev) =>
              prev.map((card) =>
                card.id === firstId || card.id === secondId
                  ? { ...card, isFlipped: false }
                  : card
              )
            );
          }, 1000);
        }
      }

      setMoves((m) => m + 1);
      setFlippedCards([]);
    }
  }, [flippedCards, cards]);

  const allMatched = cards.every((c) => c.isMatched);

  // גודל קלף דינמי לפי רוחב המסך
  const cardSize = Math.min(60, Math.floor(window.innerWidth / 6));

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={1} p={2}>
      <Typography variant="h5" mb={1}>🎯 Memory Game</Typography>
      <Typography mb={1}>מהלכים: {moves}</Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(4, ${cardSize}px)`,
          gap: 0.5,
          justifyContent: "center",
        }}
      >
        {cards.map((card) => (
          <Paper
            key={card.id}
            onClick={() => !card.isFlipped && !card.isMatched && handleFlip(card.id)}
            sx={{
              width: cardSize,
              height: cardSize,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: cardSize / 2,
              cursor: "pointer",
              backgroundColor: card.isFlipped || card.isMatched ? "white" : "grey.400",
              transition: "0.3s",
            }}
          >
            {card.isFlipped || card.isMatched ? card.value : "❓"}
          </Paper>
        ))}
      </Box>

      {allMatched && (
        <Typography variant="h6" color="success.main" mt={1}>
          🎉 כל הכרטיסים נחשפו! ניצחת!
        </Typography>
      )}

      <Button variant="contained" color="secondary" sx={{ mt: 1 }} onClick={onBackToMenu}>
        חזור לתפריט
      </Button>
    </Box>
  );
}
