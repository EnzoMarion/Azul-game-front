import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { Stone } from "../../components/Stones";
import { STONE_TYPES } from "../../constants";
import socket from "../../socket";
import styles from "./Lobby.module.scss";

const PLAYER_CONFIGS = [
    { count: 2, factories: 5, label: "2 joueurs" },
    { count: 3, factories: 7, label: "3 joueurs" },
    { count: 4, factories: 9, label: "4 joueurs" },
];

const Lobby = () => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [waitingRoomId, setWaitingRoomId] = useState(null);
    const [waitingPlayers, setWaitingPlayers] = useState([]);
    const [waitingMax, setWaitingMax] = useState(2);
    const [pseudo, setPseudo] = useState("");
    const [pseudoError, setPseudoError] = useState("");
    const [maxPlayers, setMaxPlayers] = useState(2);
    const [joinError, setJoinError] = useState("");

    useEffect(() => {
        const saved = sessionStorage.getItem("pseudo");
        if (saved) setPseudo(saved);
        socket.emit("request_rooms");

        const onRoomList = (list) => setRooms(list);
        const onJoinedRoom = (roomId) => { sessionStorage.setItem("roomId", roomId); };
        const onGameUpdate = (state) => { if (state) navigate("/game"); };
        const onRoomPlayersUpdate = ({ players, maxPlayers: max }) => {
            setWaitingPlayers(players);
            setWaitingMax(max);
        };
        const onJoinError = (msg) => {
            setJoinError(msg);
            setTimeout(() => setJoinError(""), 3000);
        };

        socket.on("room_list", onRoomList);
        socket.on("joined_room", onJoinedRoom);
        socket.on("game_update", onGameUpdate);
        socket.on("room_players_update", onRoomPlayersUpdate);
        socket.on("join_error", onJoinError);

        return () => {
            socket.off("room_list", onRoomList);
            socket.off("joined_room", onJoinedRoom);
            socket.off("game_update", onGameUpdate);
            socket.off("room_players_update", onRoomPlayersUpdate);
            socket.off("join_error", onJoinError);
        };
    }, [navigate]);

    const validatePseudo = () => {
        const trimmed = pseudo.trim();
        if (!trimmed) { setPseudoError("Entre un pseudo avant de continuer"); return null; }
        if (trimmed.length < 2) { setPseudoError("Le pseudo doit faire au moins 2 caractères"); return null; }
        setPseudoError("");
        sessionStorage.setItem("pseudo", trimmed);
        return trimmed;
    };

    const handleCreate = () => {
        const validPseudo = validatePseudo();
        if (!validPseudo) return;
        socket.emit("create_room", { pseudo: validPseudo, maxPlayers });
        socket.once("joined_room", (roomId) => {
            setWaitingRoomId(roomId);
            setWaitingPlayers([validPseudo]);
            setWaitingMax(maxPlayers);
        });
    };

    const handleJoin = (roomId) => {
        const validPseudo = validatePseudo();
        if (!validPseudo) return;
        setJoinError("");
        socket.emit("join_room", { roomId, pseudo: validPseudo });
        socket.once("room_players_update", ({ players, maxPlayers: max }) => {
            setWaitingRoomId(roomId);
            setWaitingPlayers(players);
            setWaitingMax(max);
        });
    };

    const handleRejoin = (roomId) => {
        const validPseudo = validatePseudo();
        if (!validPseudo) return;
        sessionStorage.setItem("roomId", roomId);
        sessionStorage.setItem("isRejoin", "true");
        socket.emit("rejoin_room", { roomId, pseudo: validPseudo });
        socket.once("joined_room", () => navigate("/game"));
    };

    const handleSpectate = (roomId) => {
        sessionStorage.setItem("roomId", roomId);
        sessionStorage.removeItem("pseudo");
        socket.emit("join_as_spectator", { roomId });
    };

    if (waitingRoomId) {
        return (
            <div className={styles.lobby}>
                <div className={styles.container}>
                    <div className={styles.waiting}>
                        <div className={styles.stonesAnimation}>
                            {Object.values(STONE_TYPES).map((stone, i) => (
                                <div key={stone} className={styles.stoneWrap} style={{ animationDelay: `${i * 0.15}s` }}>
                                    <Stone stoneType={stone} size="medium" />
                                </div>
                            ))}
                        </div>
                        <h2 className={styles.waitingTitle}>Partie créée !</h2>
                        <p className={styles.waitingText}>
                            Connecté en tant que <strong>{pseudo.trim()}</strong>
                        </p>
                        <div className={styles.waitingPlayerList}>
                            {Array.from({ length: waitingMax }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`${styles.waitingPlayerSlot} ${waitingPlayers[i] ? styles.slotFilled : styles.slotEmpty}`}
                                >
                                    <span className={waitingPlayers[i] ? styles.playerDot : styles.emptyDot} />
                                    {waitingPlayers[i] ?? "En attente…"}
                                </div>
                            ))}
                        </div>
                        <p className={styles.waitingText}>
                            {waitingPlayers.length}/{waitingMax} joueur{waitingMax > 1 ? "s" : ""} — la partie démarre automatiquement
                        </p>
                        <div className={styles.dots}><span /><span /><span /></div>
                        <Button
                            variant="ghost"
                            size="small"
                            onClick={() => {
                                socket.emit("leave_room", { roomId: waitingRoomId });
                                setWaitingRoomId(null);
                                setWaitingPlayers([]);
                            }}
                        >
                            ← Annuler
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const availableRooms = rooms.filter(r => r.playerCount < r.maxPlayers && r.status === "WAITING");
    const reconnectableRooms = rooms.filter(r => r.hasDisconnected && r.status !== "WAITING");
    const spectateableRooms = rooms.filter(r => r.playerCount === r.maxPlayers && r.status === "PLAYING" && !r.hasDisconnected);

    return (
        <div className={styles.lobby}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>
                        <span className={styles.titleMain}>AZUL</span>
                        <span className={styles.titleSub}>Infinity Stones</span>
                    </h1>
                    <p className={styles.subtitle}>Rejoins une partie ou crée la tienne</p>
                </header>

                <div className={styles.pseudoField}>
                    <label htmlFor="pseudo" className={styles.pseudoLabel}>Ton pseudo</label>
                    <input
                        id="pseudo"
                        type="text"
                        className={`${styles.pseudoInput} ${pseudoError ? styles.inputError : ""}`}
                        placeholder="Entre ton pseudo…"
                        value={pseudo}
                        maxLength={20}
                        onChange={(e) => { setPseudo(e.target.value); if (pseudoError) setPseudoError(""); }}
                        onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                    />
                    {pseudoError && <span className={styles.errorMsg}>{pseudoError}</span>}
                </div>

                <div className={styles.modeSelector}>
                    <p className={styles.pseudoLabel}>Nombre de joueurs</p>
                    <div className={styles.modeCards}>
                        {PLAYER_CONFIGS.map(({ count, factories, label }) => (
                            <button
                                key={count}
                                className={`${styles.modeCard} ${maxPlayers === count ? styles.modeCardActive : ""}`}
                                onClick={() => setMaxPlayers(count)}
                                aria-pressed={maxPlayers === count}
                            >
                                <span className={styles.modeCardCount}>{count}</span>
                                <span className={styles.modeCardLabel}>{label}</span>
                                <span className={styles.modeCardHint}>{factories} fabriques</span>
                            </button>
                        ))}
                    </div>
                </div>

                {joinError && <p className={styles.joinError}>⚠️ {joinError}</p>}

                <Button variant="primary" size="large" onClick={handleCreate}>
                    ➕ Créer une partie à {maxPlayers} joueurs
                </Button>

                <div className={styles.roomList}>
                    <h3 className={styles.roomListTitle}>Parties disponibles</h3>
                    {availableRooms.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>Aucune partie en attente.</p>
                            <p className={styles.emptyHint}>Crée la première !</p>
                        </div>
                    ) : (
                        availableRooms.map(room => (
                            <div key={room.id} className={styles.roomCard}>
                                <div className={styles.roomInfo}>
                                    <span className={styles.roomName}>{room.name}</span>
                                    <span className={styles.roomPlayers}>
                                        <span className={styles.dot} />
                                        {room.playerCount}/{room.maxPlayers} joueur{room.maxPlayers > 1 ? "s" : ""} — ⏳ En attente
                                        <span className={styles.factoryBadge}>{room.maxPlayers * 2 + 1} fabriques</span>
                                    </span>
                                </div>
                                <Button variant="secondary" size="small" onClick={() => handleJoin(room.id)}>
                                    Rejoindre
                                </Button>
                            </div>
                        ))
                    )}
                </div>

                {reconnectableRooms.length > 0 && (
                    <div className={styles.roomList}>
                        <h3 className={styles.roomListTitle}>🔌 Reconnexion possible</h3>
                        {reconnectableRooms.map(room => (
                            <div key={room.id} className={styles.roomCard}>
                                <div className={styles.roomInfo}>
                                    <span className={styles.roomName}>{room.name}</span>
                                    <span className={styles.roomPlayers}>
                                        <span className={styles.dotDisconnected} /> Partie en cours — joueur déconnecté
                                    </span>
                                </div>
                                <Button variant="primary" size="small" onClick={() => handleRejoin(room.id)}>
                                    🔁 Reprendre
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                {spectateableRooms.length > 0 && (
                    <div className={styles.roomList}>
                        <h3 className={styles.roomListTitle}>👁 Parties en cours</h3>
                        {spectateableRooms.map(room => (
                            <div key={room.id} className={styles.roomCard}>
                                <div className={styles.roomInfo}>
                                    <span className={styles.roomName}>{room.name}</span>
                                    <span className={styles.roomPlayers}>
                                        <span className={styles.dotPlaying} /> {room.maxPlayers} joueurs — En cours
                                        {room.spectatorCount > 0 && (
                                            <span className={styles.spectatorCount}>
                                                {" "}— 👁 {room.spectatorCount} spectateur{room.spectatorCount > 1 ? "s" : ""}
                                            </span>
                                        )}
                                    </span>
                                </div>
                                <Button variant="ghost" size="small" onClick={() => handleSpectate(room.id)}>
                                    👁 Regarder
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                <Button variant="ghost" size="small" onClick={() => navigate("/")}>
                    ← Retour
                </Button>
            </div>
        </div>
    );
};

export default Lobby;