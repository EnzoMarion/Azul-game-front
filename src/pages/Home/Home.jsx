import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { Stone } from "../../components/Stones";
import { STONE_TYPES } from "../../constants";
import styles from "./Home.module.scss";

const Home = () => {
  const navigate = useNavigate();

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
            <Button variant="primary" size="large" onClick={() => navigate("/lobby")}>
              Start New Game
            </Button>
            <Button variant="ghost" size="large" onClick={() => navigate("/rules")}>
              View Rules
            </Button>
          </div>

          <footer className={styles.footer}>
            <p>A Marvel-themed reimagining of the award-winning board game Azul</p>
          </footer>
        </div>
      </div>
  );
};

export default Home;