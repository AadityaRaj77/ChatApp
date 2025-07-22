import React from "react";
import { useState } from "react";

function Chatroom() {
  const [message, setMessage] = useState("");
  const [sendmessages, setSendmessages] = useState([]);

  const handleSend = () => {
    if (message.trim() !== "") {
      const msgObj = {
        id: Date.now(),
        text: message,
        sender: "me",
        timestamp: new Date(),
      };

      setSendmessages([...sendmessages, msgObj]);
      setMessage("");
    }
  };
  return (
    <>
      <div className="relative bg-pink-300 h-screen">
        <div className="bg-pink-600 text-2xl p-4 text-center text-pink-200">
          Room Name
        </div>
        <div className="m-6 space-y-4">
          {sendmessages.map((msg) => (
            <div
              key={msg.id}
              className="w-fit max-w-[50%] whitespace-normal break-words bg-pink-600 p-4 rounded-3xl text-pink-200"
            >
              <p>{msg.text}</p>
              <span className="text-sm text-pink-300">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
        <div className="absolute bottom-8 flex justify-self-center w-3/4 bg-pink-500 py-4 px-4 rounded-full items-center space-x-6 backdrop-blur-lg">
          <button className="w-10 rounded-full bg-pink-600 p-2 cursor-pointer">
            <img
              src="https://cdn-icons-png.flaticon.com/128/8138/8138518.png"
              className="invert"
            ></img>
          </button>
          <input
            type="text"
            placeholder="Send a message"
            className="border-0 border-pink-600 text-lg text-pink-200 w-full focus:outline-none focus:border-pink-600"
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
          ></input>
          <div className="flex space-x-2">
            <button className="w-10 rounded-full bg-pink-600 p-2 cursor-pointer">
              <img
                src="https://cdn-icons-png.flaticon.com/128/665/665909.png"
                className="invert"
              ></img>
            </button>
            <button
              className="w-10 rounded-full bg-pink-600 p-2 cursor-pointer"
              onClick={handleSend}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/10322/10322482.png"
                className="invert"
              ></img>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chatroom;
