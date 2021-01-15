import React, { useState, useEffect } from "react";
import SocketEvents from "../lib/enums/socketEvents";
import moment from "moment";
import Chat from "./Chat";

function ChatRoom({ socket, userName }) {
  const [messages, updateMessage] = useState([]);
  const [chatInput, updateChatInput] = useState();

  useEffect(() => {
    function addMessages(message) {
      let newMessages = messages.concat(message);
      updateMessage(newMessages);
    }
    socket.on(SocketEvents.LOBBY_MESSAGE, addMessages);

    //WORK DONE

    return () => {
      socket.off(SocketEvents.LOBBY_MESSAGE, addMessages);
    };
  }, [messages]);

  function submitChatMessage(chatInput) {
    socket.emit(SocketEvents.SUBMIT_CHAT_MESSAGE, chatInput, (isCorrect) => {
      console.log(isCorrect);
    });
  }

  return (
    <>
      {messages.map((message, i) => {
        return <Chat message={message} key={message} />;
      })}
      <input
        type="text"
        value={chatInput}
        onChange={(e) => updateChatInput(e.target.value)}
      />
      <input
        type="submit"
        value="enter"
        onClick={() => submitChatMessage({ guess: chatInput, userName })}
      />
    </>
  );
}

export default ChatRoom;
