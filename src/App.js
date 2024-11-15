import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Style components using Tailwind CSS
import "./App.css";
import ChatHistory from "./components/ChatHistory";
import Loading from "./components/Loading";

const App = () => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_API_KEY); // replace with your API key
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Function to handle user input
  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  // Function to send user message to Gemini
  const sendMessage = async () => {
    if (userInput.trim() === "") return;

    setIsLoading(true);
    try {
      // call Gemini Api to get a response
      const result = await model.generateContent(userInput);
      const response = await result.response;

      // add Gemini response to the chat history
      setChatHistory([
        ...chatHistory,
        { type: "user", message: userInput },
        { type: "bot", message: response.text() },
      ]);
    } catch {
      console.error("Error sending message");
    } finally {
      setUserInput("");
      setIsLoading(false);
    }
  };

  // clear the chat history
  const clearChat = () => {
    setChatHistory([]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-4">Ask Me Something</h1>
      {isLoading && <Loading />}
      {chatHistory.length > 0 && !isLoading && (
        <div className="chat-container rounded-lg shadow-md p-4">
          <ChatHistory chatHistory={chatHistory} />
        </div>
      )}
      <div className="flex mt-4">
        <input
          type="text"
          className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-300"
          placeholder="Type your question..."
          value={userInput}
          onChange={handleUserInput}
        />
        <button
          className={`px-4 py-2 ml-2 rounded-lg bg-blue-400 text-white  focus:outline-none ${
            isLoading || !userInput ? "" : "hover:bg-blue-500"
          }`}
          onClick={sendMessage}
          disabled={isLoading || !userInput}
        >
          Send
        </button>
      </div>
      <button
        className={`mt-4 block px-4 py-2 rounded-lg bg-gray-400 text-white focus:outline-none ${
          !chatHistory.length > 0 ? "" : "hover:bg-gray-500"
        } `}
        onClick={clearChat}
        disabled={!chatHistory.length > 0}
      >
        Clear Chat
      </button>
    </div>
  );
};

export default App;
