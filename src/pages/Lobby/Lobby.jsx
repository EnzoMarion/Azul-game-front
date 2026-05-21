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

    useEffect(() => {
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

    const handleCreate = () => {
        socket.emit('create_room', { pseudo: 'Joueur' });
        socket.once('joined_room', (roomId) => {
            setWaitingRoomId(roomId);
        });
    };

    const handleJoin = (roomId) => {
        socket.emit('join_room', { roomId, pseudo: 'Joueur' });
    };

    // Écran d'attente après création d'une partie
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

                <Button variant="primary" size="large" onClick={handleCreate}>
                    ➕ Créer une nouvelle partie
                </Button>

                <div className={styles.roomList}>
                    <h3 className={styles.roomListTitle}>Parties disponibles</h3>
                    {rooms.filter(r => r.playerCount < 2 && r.status === 'WAITING').length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>Aucune partie en attente.</p>
                            <p className={styles.emptyHint}>Crée la première !</p>
                        </div>
                    ) : (
                        rooms
                            .filter(r => r.playerCount < 2 && r.status === 'WAITING')
                            .map(room => (
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

                <Button variant="ghost" size="small" onClick={() => navigate("/")}>
                    ← Retour
                </Button>
            </div>
        </div>
    );
};

export default Lobby;