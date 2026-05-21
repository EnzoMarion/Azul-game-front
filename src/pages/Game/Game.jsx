import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stone } from "../../components/Stones";
import { STONE_TYPES } from "../../constants";
import styles from "./Game.module.scss";
import { Button } from "../../components/Button";
import socket, { myPlayerIndex } from "../../socket";

const WALL_ORDER = [
    [STONE_TYPES.SPACE, STONE_TYPES.MIND, STONE_TYPES.REALITY, STONE_TYPES.POWER, STONE_TYPES.TIME],
    [STONE_TYPES.TIME, STONE_TYPES.SPACE, STONE_TYPES.MIND, STONE_TYPES.REALITY, STONE_TYPES.POWER],
    [STONE_TYPES.POWER, STONE_TYPES.TIME, STONE_TYPES.SPACE, STONE_TYPES.MIND, STONE_TYPES.REALITY],
    [STONE_TYPES.REALITY, STONE_TYPES.POWER, STONE_TYPES.TIME, STONE_TYPES.SPACE, STONE_TYPES.MIND],
    [STONE_TYPES.MIND, STONE_TYPES.REALITY, STONE_TYPES.POWER, STONE_TYPES.TIME, STONE_TYPES.SPACE],
];

const PLAYER_COLORS = {
    1: { border: "#4ade80", glow: "rgba(74,222,128,0.25)" },
    2: { border: "#a78bfa", glow: "rgba(167,139,250,0.25)" },
    3: { border: "#f87171", glow: "rgba(248,113,113,0.25)" },
    4: { border: "#60a5fa", glow: "rgba(96,165,250,0.25)" },
};

const Game = () => {
    const navigate = useNavigate();
    const [showBag, setShowBag] = useState(false);
    const [game, setGame] = useState(null);
    const [opponentDisconnected, setOpponentDisconnected] = useState(false);
    const [rematchVotes, setRematchVotes] = useState(0);
    const [rematchRequested, setRematchRequested] = useState(false);

    const isSpectator = myPlayerIndex === 0;

    useEffect(() => {
        const roomId = sessionStorage.getItem("roomId");
        const pseudo = sessionStorage.getItem("pseudo");

        if (isSpectator) {
            socket.emit("request_state", { roomId });
        } else if (roomId && pseudo) {
            socket.emit("rejoin_room", { roomId, pseudo });
        } else {
            socket.emit("request_state", { roomId });
        }

        const onGameUpdate = (state) => {
            setGame(state);
            setOpponentDisconnected(false);
            if (!isSpectator) { setRematchVotes(0); setRematchRequested(false); }
        };
        const onOpponentDisconnected = () => { if (!isSpectator) setOpponentDisconnected(true); };
        const onRematchVotes = (count) => setRematchVotes(count);

        socket.on("game_update", onGameUpdate);
        socket.on("opponent_disconnected", onOpponentDisconnected);
        socket.on("rematch_votes", onRematchVotes);

        return () => {
            socket.off("game_update", onGameUpdate);
            socket.off("opponent_disconnected", onOpponentDisconnected);
            socket.off("rematch_votes", onRematchVotes);
        };
    }, []);

    if (!game) {
        return (
            <div className={styles.loadingScreen}>
                <p className={styles.loadingText}>
                    {isSpectator ? "Chargement de la partie…" : "Connexion à la partie…"}
                </p>
                <div className={styles.loadingDots}><span /><span /><span /></div>
            </div>
        );
    }

    const { factories, center, players, currentPlayerId, heldStones, gameState, bag } = game;
    const bagStats = (bag || []).reduce((acc, s) => { acc[s] = (acc[s] || 0) + 1; return acc; }, {});

    const myPlayer = isSpectator ? null : players[myPlayerIndex - 1];
    const isMyTurn = !isSpectator && myPlayer && currentPlayerId === myPlayer.id;
    const myPseudo = myPlayer?.pseudo || `Joueur ${myPlayerIndex}`;
    const currentPlayerData = players.find(p => p.id === currentPlayerId);
    const currentPseudo = currentPlayerData?.pseudo || `Joueur ${currentPlayerId}`;

    const allLinesInvalid = !isSpectator && heldStones && myPlayer && myPlayer.patternLines.every((line, i) => {
        const colIndex = WALL_ORDER[i].indexOf(heldStones.type);
        return myPlayer.wall[i][colIndex] !== null || line.some(s => s !== null && s !== heldStones.type);
    });

    const handleRematch = () => {
        const roomId = sessionStorage.getItem("roomId");
        socket.emit("request_rematch", { roomId });
        setRematchRequested(true);
    };

    if (gameState === "GAME_OVER") {
        const sorted = [...players].sort((a, b) => b.score - a.score);
        const winnerPseudo = sorted[0].pseudo || `Joueur ${sorted[0].id}`;
        const totalPlayers = players.length;

        return (
            <div className={styles.gameOverOverlay}>
                <div className={styles.finalModal}>
                    <h2>🏆 Victoire de {winnerPseudo} 🏆</h2>
                    {isSpectator && <p className={styles.spectatorNote}>👁 Vous étiez spectateur</p>}
                    <div className={styles.resultsContainer}>
                        {sorted.map((p, rank) => {
                            const color = PLAYER_COLORS[p.id] || PLAYER_COLORS[1];
                            return (
                                <div
                                    key={p.id}
                                    className={styles.playerResultCard}
                                    style={{ borderColor: color.border, boxShadow: `0 0 12px ${color.glow}` }}
                                >
                                    <h3>
                                        {rank === 0 ? "🥇" : rank === 1 ? "🥈" : rank === 2 ? "🥉" : "4️⃣"}
                                        {" "}{p.pseudo || `Joueur ${p.id}`}
                                    </h3>
                                    <div className={styles.finalWallPreview}>
                                        {p.wall.map((row, i) => (
                                            <div key={i} className={styles.row}>
                                                {row.map((cell, j) => (
                                                    <div key={j} className={`${styles.cell} ${cell ? styles.filled : ""}`}>
                                                        {cell
                                                            ? <Stone stoneType={cell} size="small" />
                                                            : <div className={styles.ghost}><Stone stoneType={WALL_ORDER[i][j]} size="small" /></div>}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                    <p>Score final : <strong>{p.score}</strong></p>
                                </div>
                            );
                        })}
                    </div>
                    <div className={styles.gameOverActions}>
                        {!isSpectator && (
                            <Button variant="primary" size="large" onClick={handleRematch} disabled={rematchRequested}>
                                {rematchRequested ? `⏳ En attente… (${rematchVotes}/${totalPlayers})` : "🔁 Revanche"}
                            </Button>
                        )}
                        <Button variant="secondary" size="large" onClick={() => navigate("/")}>
                            Menu Principal
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const renderPlayerBoard = (p) => {
        const isMe = !isSpectator && p.id === myPlayerIndex;
        const isActive = currentPlayerId === p.id;
        const color = PLAYER_COLORS[p.id] || PLAYER_COLORS[1];
        const pseudo = p.pseudo || `Joueur ${p.id}`;

        const boardStyle = {
            borderColor: isActive ? color.border : `${color.border}55`,
            boxShadow: isActive ? `0 0 0 2px ${color.border}, 0 0 16px ${color.glow}` : "none",
        };

        return (
            <div
                key={p.id}
                className={`${styles.playerBoard} ${isActive ? styles.active : ""} ${isSpectator && isActive ? styles.spectatorActive : ""}`}
                style={boardStyle}
            >
                <h3>
                    {isMe ? `⭐ ${pseudo}` : isSpectator ? (isActive ? `▶ ${pseudo}` : pseudo) : `👤 ${pseudo}`}
                    {" "}| Score : {p.score}
                    {isActive && isMe && <span className={styles.yourTurnBadge}>Votre tour</span>}
                    {isActive && <span className={styles.activeTurnDot} style={{ background: color.border }} />}
                </h3>

                <div className={styles.boardGrid}>
                    <div className={styles.patterns}>
                        {p.patternLines.map((line, i) => {
                            const colIndex = heldStones && isMe ? WALL_ORDER[i].indexOf(heldStones.type) : -1;
                            const isInvalid = isMe && heldStones && (
                                p.wall[i][colIndex] !== null ||
                                line.some(s => s !== null && s !== heldStones.type)
                            );
                            const canPlace = isMe && isMyTurn && !!heldStones && !isInvalid && !isSpectator;
                            return (
                                <div
                                    key={i}
                                    className={`${styles.line} ${isInvalid ? styles.invalid : ""} ${canPlace ? styles.canPlace : ""} ${(!isMyTurn || !isMe || isSpectator) ? styles.noHover : ""}`}
                                    onClick={() => canPlace && socket.emit("place_stones", { lineIndex: i })}
                                >
                                    <div className={styles.lineSlots}>
                                        {line.map((s, j) => (
                                            <div key={j} className={styles.slot}>
                                                {s && <Stone stoneType={s} size="small" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className={styles.wall}>
                        {p.wall.map((row, i) => (
                            <div key={i} className={styles.row}>
                                {row.map((cell, j) => (
                                    <div key={j} className={`${styles.cell} ${cell ? styles.filled : ""}`}>
                                        {cell
                                            ? <Stone stoneType={cell} size="small" />
                                            : <div className={styles.ghost}><Stone stoneType={WALL_ORDER[i][j]} size="small" /></div>}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.floor}>
                    {Array(7).fill(null).map((_, i) => (
                        <div key={i} className={styles.floorSlot}>
                            <span className={styles.penalty}>{-1 * (i < 2 ? 1 : i < 5 ? 2 : 3)}</span>
                            {p.floorLine[i] === "FIRST_PLAYER"
                                ? <div className={styles.firstMarker}>1st</div>
                                : p.floorLine[i] && <Stone stoneType={p.floorLine[i]} size="small" />}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className={styles.gameContainer}>
            {isSpectator && (
                <div className={styles.spectatorBanner}>👁 Mode spectateur — vous observez la partie</div>
            )}
            {!isSpectator && opponentDisconnected && (
                <div className={styles.disconnectBanner}>⚠️ Un joueur s'est déconnecté… En attente de reconnexion</div>
            )}

            <header className={styles.header}>
                <div className={styles.turnBanner}>
                    {isSpectator
                        ? <span className={styles.spectatorTurn}>👁 Tour de {currentPseudo}</span>
                        : isMyTurn
                            ? <span className={styles.myTurn}>🟢 Votre tour, {myPseudo}</span>
                            : <span className={styles.opponentTurn}>⏳ Tour de {currentPseudo}</span>
                    }
                </div>
                <div className={styles.headerActions}>
                    {!isSpectator && heldStones && (
                        <div className={styles.hand}>
                            <span>Main : {heldStones.count}×</span>
                            <Stone stoneType={heldStones.type} size="small" />
                            {(allLinesInvalid || isMyTurn) && (
                                <Button variant="ghost" size="small" onClick={() => socket.emit("discard_to_floor")}>
                                    ❌ Défausser en pénalité
                                </Button>
                            )}
                        </div>
                    )}
                    <Button size="small" onClick={() => setShowBag(true)}>
                        👜 Sac ({bag?.length || 0})
                    </Button>
                </div>
            </header>

            {showBag && (
                <div className={styles.modalOverlay} onClick={() => setShowBag(false)}>
                    <div className={styles.bagModal} onClick={e => e.stopPropagation()}>
                        <h2>Contenu du Sac</h2>
                        <div className={styles.bagGrid}>
                            {Object.entries(bagStats).map(([type, count]) => (
                                <div key={type} className={styles.bagItem}>
                                    <Stone stoneType={type} size="medium" />
                                    <span>×{count}</span>
                                </div>
                            ))}
                        </div>
                        <Button variant="secondary" size="small" onClick={() => setShowBag(false)}>Fermer</Button>
                    </div>
                </div>
            )}

            <main className={styles.mainLayout}>
                <section className={`${styles.commonArea} ${(!isMyTurn || isSpectator) ? styles.disabled : ""}`}>
                    <div className={styles.factories}>
                        {factories.map((stones, i) => (
                            <div key={i} className={`${styles.factory} ${(!isMyTurn || heldStones || isSpectator) ? styles.noHover : ""}`}>
                                {stones.map((s, j) => (
                                    <div key={j} onClick={() => !isSpectator && isMyTurn && !heldStones && socket.emit("pick_from_factory", { factoryIndex: i, stoneType: s })}>
                                        <Stone stoneType={s} size="medium" />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className={`${styles.center} ${(!isMyTurn || heldStones || isSpectator) ? styles.noHover : ""}`}>
                        {center.map((s, i) => (
                            <div key={i} onClick={() => !isSpectator && isMyTurn && !heldStones && socket.emit("pick_from_center", { stoneType: s })}>
                                <Stone stoneType={s} size="small" />
                            </div>
                        ))}
                    </div>
                </section>

                <section
                    className={styles.playersContainer}
                    data-player-count={players.length}
                >
                    {players.map(p => renderPlayerBoard(p))}
                </section>
            </main>
        </div>
    );
};

export default Game;