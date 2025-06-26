import { useEffect, useRef, useState } from "react";

type Message = {
  sender: string;
  text: string;
};

const App = () => {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(import.meta.env.VITE_WS_URL);

    ws.current.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      setMessages((prev) => [...prev, parsed]);
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const joinRoom = () => {
    if (ws.current && roomId.trim() && username.trim()) {
      ws.current.send(
        JSON.stringify({
          type: "join",
          payload: { roomId },
        })
      );
      setJoined(true);
    }
  };

  const sendMessage = () => {
    if (ws.current && message.trim()) {
      const chatMessage = {
        sender: username,
        text: message,
      };

      ws.current.send(
        JSON.stringify({
          type: "chat",
          payload: { message: JSON.stringify(chatMessage) },
        })
      );

      setMessage("");
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-4 flex flex-col items-center justify-center">
      {!joined ? (
        <div className="bg-gray-800 border border-gray-700 rounded-md space-y-4 w-full max-w-md p-6">
          <h1 className="text-2xl font-bold text-center">Join a Room</h1>
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded placeholder-gray-400"
          />
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded placeholder-gray-400"
          />
          <button
            onClick={joinRoom}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Join
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md space-y-4">
          <div className="bg-gray-800 p-4 border border-gray-700 rounded h-80 overflow-y-auto shadow-inner">
            {messages.map((msg, i) => {
              const isMe = msg.sender === username;
              return (
                <div
                  key={i}
                  className={`flex items-start gap-2 mb-2 ${isMe ? "justify-end" : "justify-start"
                    }`}
                >
                  {!isMe && (
                    <div className="bg-gray-500 text-white rounded-full h-8 w-8 flex items-center justify-center text-sm font-bold">
                      {msg.sender[0].toUpperCase()}
                    </div>
                  )}
                  <div
                    className={`p-2 max-w-[70%] text-sm rounded-lg ${isMe
                        ? "bg-green-600 text-white rounded-br-none"
                        : "bg-gray-700 text-white rounded-bl-none"
                      }`}
                  >
                    {msg.text}
                  </div>
                  {isMe && (
                    <div className="bg-blue-500 text-white rounded-full h-8 w-8 flex items-center justify-center text-sm font-bold">
                      {msg.sender[0].toUpperCase()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-grow p-2 bg-gray-700 text-white border border-gray-600 rounded placeholder-gray-400"
            />
            <button
              onClick={sendMessage}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Send
            </button>
          </div>
        </div>
      )}



      <p className="absolute inset-x-0 bottom-0 text-center text-white font-semibold">Made By Harsh Upadhyay🍵</p>
    </div>
  );
};

export default App;
