import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// מתחברים לשרת
const socket = io("http://localhost:5000"); // תוודא שזה הפורט מה-env שלך

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // מאזינים לאירוע "welcome" מהשרת
    socket.on("welcome", (data) => {
      setMessage(data);
    });

    // מנקים את האזנה כשהרכיב מתפרק
    return () => {
      socket.off("welcome");
    };
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🎮 משחק בזמן אמת</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
