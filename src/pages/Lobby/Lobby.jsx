import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { Stone } from "../../components/Stones";
import { STONE_TYPES } from "../../constants";
import socket from "../../socket";
import styles from "./Lobby.module.scss";

const Lobby = () => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [waitingRoomId, setWaitingRoomId] = useState(null);
    const [pseudo, setPseudo] = useState('');
    const [pseudoError, setPseudoError] = useState('');

    useEffect(() => {
        const saved = sessionStorage.getItem('pseudo');
        if (saved) setPseudo(saved);

        socket.emit('request_rooms');

        const onRoomList = (list) => setRooms(list);

        const onJoinedRoom = (roomId) => {
            sessionStorage.setItem('roomId', roomId);
        };

        const onGameUpdate = (state) => {
            if (state) navigate("/game");
        };

        socket.on('room_list', onRoomList);
        socket.on('joined_room', onJoinedRoom);
        socket.on('game_update', onGameUpdate);

        return () => {
            socket.off('room_list', onRoomList);
            socket.off('joined_room', onJoinedRoom);
            socket.off('game_update', onGameUpdate);
        };
    }, [navigate]);

    const validatePseudo = () => {
        const trimmed = pseudo.trim();
        if (!trimmed) {
            setPseudoError('Entre un pseudo avant de continuer');
            return null;
        }
        if (trimmed.length < 2) {
            setPseudoError('Le pseudo doit faire au moins 2 caractères');
            return null;
        }
        setPseudoError('');
        sessionStorage.setItem('pseudo', trimmed);
        return trimmed;
    };

    const handleCreate = () => {
        const validPseudo = validatePseudo();
        if (!validPseudo) return;

        socket.emit('create_room', { pseudo: validPseudo });
        socket.once('joined_room', (roomId) => {
            setWaitingRoomId(roomId);
        });
    };

    const handleJoin = (roomId) => {
        const validPseudo = validatePseudo();
        if (!validPseudo) return;

        socket.emit('join_room', { roomId, pseudo: validPseudo });
    };

    const handleRejoin = (roomId) => {
        const validPseudo = validatePseudo();
        if (!validPseudo) return;

        sessionStorage.setItem('roomId', roomId);
        socket.emit('rejoin_room', { roomId, pseudo: validPseudo });
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
                        <p className={styles.waitingText}>En attente d'un second joueur…</p>
                        <div className={styles.dots}>
                            <span /><span /><span />
                        </div>
                        <Button
                            variant="ghost"
                            size="small"
                            onClick={() => {
                                socket.emit('leave_room', { roomId: waitingRoomId });
                                setWaitingRoomId(null);
                            }}
                        >
                            ← Annuler
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const availableRooms = rooms.filter(r => r.playerCount < 2 && r.status === 'WAITING');
    const reconnectableRooms = rooms.filter(r => r.hasDisconnected && r.status !== 'WAITING');

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
                    <label htmlFor="pseudo" className={styles.pseudoLabel}>
                        Ton pseudo
                    </label>
                    <input
                        id="pseudo"
                        type="text"
                        className={`${styles.pseudoInput} ${pseudoError ? styles.inputError : ''}`}
                        placeholder="Entre ton pseudo…"
                        value={pseudo}
                        maxLength={20}
                        onChange={(e) => {
                            setPseudo(e.target.value);
                            if (pseudoError) setPseudoError('');
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                    />
                    {pseudoError && (
                        <span className={styles.errorMsg}>{pseudoError}</span>
                    )}
                </div>

                <Button variant="primary" size="large" onClick={handleCreate}>
                    ➕ Créer une nouvelle partie
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
                                        <span className={styles.dot} /> {room.playerCount}/2 — ⏳ En attente
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

                <Button variant="ghost" size="small" onClick={() => navigate("/")}>
                    ← Retour
                </Button>
            </div>
        </div>
    );
};

export default Lobby;