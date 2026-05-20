import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Rules from "./pages/Rules/Rules";
import Game from "./pages/Game/Game";
import socket from "./socket";

function App() {
    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connecté au serveur :', socket.id);
            socket.emit('join_game', 'Joueur Test');
        });

        socket.on('game_state', (state) => {
            console.log('État du jeu reçu :', state);
        });

        return () => {
            socket.off('connect');
            socket.off('game_state');
        };
    }, []);

  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;