import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stone } from '../../components/Stones';
import { STONE_TYPES } from '../../constants';
import styles from './Game.module.scss';
import { Button } from '../../components/Button';
import socket, { myPlayerIndex } from '../../socket';

const WALL_ORDER = [
    [STONE_TYPES.SPACE, STONE_TYPES.MIND, STONE_TYPES.REALITY, STONE_TYPES.POWER, STONE_TYPES.TIME],
    [STONE_TYPES.TIME, STONE_TYPES.SPACE, STONE_TYPES.MIND, STONE_TYPES.REALITY, STONE_TYPES.POWER],
    [STONE_TYPES.POWER, STONE_TYPES.TIME, STONE_TYPES.SPACE, STONE_TYPES.MIND, STONE_TYPES.REALITY],
    [STONE_TYPES.REALITY, STONE_TYPES.POWER, STONE_TYPES.TIME, STONE_TYPES.SPACE, STONE_TYPES.MIND],
    [STONE_TYPES.MIND, STONE_TYPES.REALITY, STONE_TYPES.POWER, STONE_TYPES.TIME, STONE_TYPES.SPACE],
];

const Game = () => {
    const navigate = useNavigate();
    const [showBag, setShowBag] = useState(false);
    const [game, setGame] = useState(null);
    const [opponentDisconnected, setOpponentDisconnected] = useState(false);
    const [rematchVotes, setRematchVotes] = useState(0);
    const [rematchRequested, setRematchRequested] = useState(false);

    useEffect(() => {
        const roomId = sessionStorage.getItem('roomId');
        const pseudo = sessionStorage.getItem('pseudo');

        if (roomId && pseudo) {
            socket.emit('rejoin_room', { roomId, pseudo });
        } else {
            socket.emit('request_state', { roomId });
        }

        const onGameUpdate = (state) => {
            setGame(state);
            setOpponentDisconnected(false);
            setRematchVotes(0);
            setRematchRequested(false);
        };
        const onOpponentDisconnected = () => setOpponentDisconnected(true);
        const onRematchVotes = (count) => setRematchVotes(count);

        socket.on('game_update', onGameUpdate);
        socket.on('opponent_disconnected', onOpponentDisconnected);
        socket.on('rematch_votes', onRematchVotes);

        return () => {
            socket.off('game_update', onGameUpdate);
            socket.off('opponent_disconnected', onOpponentDisconnected);
            socket.off('rematch_votes', onRematchVotes);
        };
    }, []);

    if (!game) {
        return (
            <div className={styles.loadingScreen}>
                <p className={styles.loadingText}>Connexion à la partie…</p>
                <div className={styles.loadingDots}>
                    <span /><span /><span />
                </div>
            </div>
        );
    }

    const { factories, center, players, currentPlayerId, heldStones, gameState, bag } = game;
    const bagStats = (bag || []).reduce((acc, s) => { acc[s] = (acc[s] || 0) + 1; return acc; }, {});
    const myPlayer = players[myPlayerIndex - 1];
    const opponentPlayer = players[myPlayerIndex === 1 ? 1 : 0];
    const isMyTurn = myPlayer && currentPlayerId === myPlayer.id;

    const myPseudo = myPlayer?.pseudo || `Joueur ${myPlayerIndex}`;
    const opponentPseudo = opponentPlayer?.pseudo || `Joueur ${myPlayerIndex === 1 ? 2 : 1}`;
    const currentPseudo = currentPlayerId === myPlayer?.id ? myPseudo : opponentPseudo;

    const allLinesInvalid = heldStones && myPlayer && myPlayer.patternLines.every((line, i) => {
        const colIndex = WALL_ORDER[i].indexOf(heldStones.type);
        return (
            myPlayer.wall[i][colIndex] !== null ||
            line.some(s => s !== null && s !== heldStones.type)
        );
    });

    const handleRematch = () => {
        const roomId = sessionStorage.getItem('roomId');
        socket.emit('request_rematch', { roomId });
        setRematchRequested(true);
    };

    if (gameState === 'GAME_OVER') {
        const sorted = [...players].sort((a, b) => b.score - a.score);
        const winnerPseudo = sorted[0].pseudo || `Joueur ${sorted[0].id}`;
        return (
            <div className={styles.gameOverOverlay}>
                <div className={styles.finalModal}>
                    <h2>🏆 Victoire de {winnerPseudo} 🏆</h2>
                    <div className={styles.resultsContainer}>
                        {sorted.map(p => (
                            <div key={p.id} className={styles.playerResultCard}>
                                <h3>{p.pseudo || `Joueur ${p.id}`}</h3>
                                <div className={styles.finalWallPreview}>
                                    {p.wall.map((row, i) => (
                                        <div key={i} className={styles.row}>
                                            {row.map((cell, j) => (
                                                <div key={j} className={`${styles.cell} ${cell ? styles.filled : ''}`}>
                                                    {cell
                                                        ? <Stone stoneType={cell} size="small" />
                                                        : <div className={styles.ghost}><Stone stoneType={WALL_ORDER[i][j]} size="small" /></div>}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                                <p>Score final : {p.score}</p>
                            </div>
                        ))}
                    </div>
                    <div className={styles.gameOverActions}>
                        <Button
                            variant="primary"
                            size="large"
                            onClick={handleRematch}
                            disabled={rematchRequested}
                        >
                            {rematchRequested
                                ? `⏳ En attente… (${rematchVotes}/2)`
                                : '🔁 Revanche'}
                        </Button>
                        <Button variant="secondary" size="large" onClick={() => navigate('/')}>
                            Menu Principal
                        </Button>
                    </div>
                    {rematchRequested && rematchVotes < 2 && (
                        <p className={styles.rematchHint}>
                            En attente que {opponentPseudo} accepte la revanche…
                        </p>
                    )}
                </div>
            </div>
        );
    }

    const renderPlayerBoard = (p, isMe) => {
        const pseudo = p.pseudo || (isMe ? `Joueur ${myPlayerIndex}` : `Joueur ${myPlayerIndex === 1 ? 2 : 1}`);
        return (
            <div key={p.id} className={`${styles.playerBoard} ${currentPlayerId === p.id ? styles.active : ''} ${!isMe ? styles.opponent : ''}`}>
                <h3>
                    {isMe ? `⭐ ${pseudo}` : `👤 ${pseudo}`}
                    {' '}| Score : {p.score}
                    {isMyTurn && isMe && <span className={styles.yourTurnBadge}>Votre tour</span>}
                </h3>
                <div className={styles.boardGrid}>
                    <div className={styles.patterns}>
                        {p.patternLines.map((line, i) => {
                            const colIndex = heldStones ? WALL_ORDER[i].indexOf(heldStones.type) : -1;
                            const isInvalid = heldStones && (
                                p.wall[i][colIndex] !== null ||
                                line.some(s => s !== null && s !== heldStones.type)
                            );
                            const canPlace = isMe && isMyTurn && !!heldStones && !isInvalid;
                            return (
                                <div
                                    key={i}
                                    className={`${styles.line} ${isInvalid ? styles.invalid : ''} ${canPlace ? styles.canPlace : ''} ${!isMyTurn || !isMe ? styles.noHover : ''}`}
                                    onClick={() => canPlace && socket.emit('place_stones', { lineIndex: i })}
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
                                    <div key={j} className={`${styles.cell} ${cell ? styles.filled : ''}`}>
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
                            {p.floorLine[i] === 'FIRST_PLAYER'
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
            {opponentDisconnected && (
                <div className={styles.disconnectBanner}>
                    ⚠️ {opponentPseudo} s'est déconnecté(e)… En attente de reconnexion
                </div>
            )}

            <header className={styles.header}>
                <div className={styles.turnBanner}>
                    {isMyTurn
                        ? <span className={styles.myTurn}>🟢 Votre tour, {myPseudo}</span>
                        : <span className={styles.opponentTurn}>⏳ Tour de {currentPseudo}</span>}
                </div>
                <div className={styles.headerActions}>
                    {heldStones && (
                        <div className={styles.hand}>
                            <span>Main : {heldStones.count}×</span>
                            <Stone stoneType={heldStones.type} size="small" />
                            {(allLinesInvalid || isMyTurn) && (
                                <Button
                                    variant="ghost"
                                    size="small"
                                    onClick={() => socket.emit('discard_to_floor')}
                                >
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
                        <Button variant="secondary" size="small" onClick={() => setShowBag(false)}>
                            Fermer
                        </Button>
                    </div>
                </div>
            )}

            <main className={styles.mainLayout}>
                <section className={`${styles.commonArea} ${!isMyTurn ? styles.disabled : ''}`}>
                    <div className={styles.factories}>
                        {factories.map((stones, i) => (
                            <div
                                key={i}
                                className={`${styles.factory} ${!isMyTurn || heldStones ? styles.noHover : ''}`}
                            >
                                {stones.map((s, j) => (
                                    <div
                                        key={j}
                                        onClick={() => isMyTurn && !heldStones && socket.emit('pick_from_factory', { factoryIndex: i, stoneType: s })}
                                    >
                                        <Stone stoneType={s} size="medium" />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className={`${styles.center} ${!isMyTurn || heldStones ? styles.noHover : ''}`}>
                        {center.map((s, i) => (
                            <div
                                key={i}
                                onClick={() => isMyTurn && !heldStones && socket.emit('pick_from_center', { stoneType: s })}
                            >
                                <Stone stoneType={s} size="small" />
                            </div>
                        ))}
                    </div>
                </section>

                <section className={styles.playersContainer}>
                    {myPlayer && renderPlayerBoard(myPlayer, true)}
                    {opponentPlayer && renderPlayerBoard(opponentPlayer, false)}
                </section>
            </main>
        </div>
    );
};

export default Game;