import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Lobby from "./pages/Lobby/Lobby";
import Rules from "./pages/Rules/Rules";
import Game from "./pages/Game/Game";
import socket from "./socket";

const AutoRejoin = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const roomId = sessionStorage.getItem("roomId");
        const pseudo = sessionStorage.getItem("pseudo");
        const isRejoin = sessionStorage.getItem("isRejoin");

        if (roomId && pseudo && isRejoin === "true" && window.location.pathname !== "/game") {
            socket.emit("rejoin_room", { roomId, pseudo });

            const onJoined = () => {
                navigate("/game");
                socket.off("join_error", onError);
            };
            const onError = () => {
                sessionStorage.removeItem("roomId");
                sessionStorage.removeItem("isRejoin");
                socket.off("joined_room", onJoined);
            };

            socket.once("joined_room", onJoined);
            socket.once("join_error", onError);
        }
    }, [navigate]);

    return children;
};

function App() {
    return (
        <BrowserRouter>
            <AutoRejoin>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/lobby" element={<Lobby />} />
                    <Route path="/rules" element={<Rules />} />
                    <Route path="/game" element={<Game />} />
                </Routes>
            </AutoRejoin>
        </BrowserRouter>
    );
}

export default App;