  import { useEffect, useRef, useState } from "react";
  import { io } from "socket.io-client";
  import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
  } from "@mui/material";

  const socket = io("http://localhost:5000");

  interface Message {
    id: string;
    text: string;
    senderId?: string;
    time?: string;
  }

  const ChatBox = () => {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState<Message[]>([]);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [chat]);


    useEffect(() => {
      socket.on("connect", () => {
        console.log("✅ Connected to server:", socket.id);
      });

      socket.on("receive_message", (msg: Message) => {
        setChat((prev) => [...prev, msg]);
      });

      return () => {
        socket.off("receive_message");
      };
    }, []);

    const sendMessage = () => {
      if (message.trim() !== "") {
        socket.emit("send_message", message);
        setMessage("");
      }
    };

    return (
      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        height="100%"
      >
        {/* תיבת ההודעות */}
        <Paper
          variant="outlined"
          sx={{
            flex: 1,
            borderRadius: 3,
            p: 2,
            maxHeight:200,
            overflowY: "auto",
            backgroundColor: "#f9f9f9",
          }}
        >
          {chat.map((msg) => (
            <Box
              key={msg.id}
              display="flex"
              justifyContent={msg.senderId === "You" ? "flex-end" : "flex-start"}
              mb={1.5}
            >
              <Paper
                elevation={2}
                sx={{
                  maxWidth: "70%",
                  p: 1.5,
                  borderRadius: 3,
                  bgcolor: msg.senderId === "You" ? "primary.main" : "grey.200",
                  color: msg.senderId === "You" ? "white" : "black",
                }}
              >
                {msg.time && (
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    • {msg.time}
                  </Typography>
                )}
                <Typography variant="body1">{msg.text}</Typography>
              </Paper>
            </Box>
          ))}
          <div ref={messagesEndRef} />

        </Paper>

        {/* שורת הקלט */}
        <Box display="flex" gap={1}>
          <TextField
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="כתוב הודעה..."
            size="small"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
          >
            שלח
          </Button>
        </Box>
      </Box>
    );
  };

  export default ChatBox;
