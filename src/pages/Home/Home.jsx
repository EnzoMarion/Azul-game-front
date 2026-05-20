import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { Stone } from "../../components/Stones";
import { STONE_TYPES } from "../../constants";
import styles from "./Home.module.scss";
import { useDispatch } from "react-redux";
import { initGame } from "../../store/gameSlice";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleStartGame = () => {
    // 1. Initialise les données du jeu dans le store
    dispatch(initGame({ playerCount: 2 }));
    // 2. Navigue vers la page de jeu
    navigate("/game");
  };

  const handleViewRules = () => {
    navigate("/rules");
  };

  return (
    <div className={styles.home}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            <span className={styles.titleMain}>AZUL</span>
            <span className={styles.titleSub}>Infinity Stones</span>
          </h1>

          <p className={styles.subtitle}>
            Collect the legendary Infinity Stones and build your perfect pattern
          </p>
        </header>

        <div className={styles.stonesPreview}>
          {Object.values(STONE_TYPES).map((stone) => (
            <Stone key={stone} stoneType={stone} size="large" />
          ))}
        </div>

        <div className={styles.actions}>
          <Button variant="primary" size="large" onClick={handleStartGame}>
            Start New Game
          </Button>
          <Button variant="ghost" size="large" onClick={handleViewRules}>
            View Rules
          </Button>
        </div>

        <footer className={styles.footer}>
          <p>
            A Marvel-themed reimagining of the award-winning board game Azul
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
