import React from "react";
import PropTypes from "prop-types";
import { STONE_COLORS, STONE_TYPES } from "../../constants";
import styles from "./Stone.module.scss";

// Import stone images
import mindStone from "../../assets/stones/mind.png";
import powerStone from "../../assets/stones/power.png";
import realityStone from "../../assets/stones/reality.png";
import spaceStone from "../../assets/stones/space.png";
import timeStone from "../../assets/stones/time.png";

// Map stone types to their images
const STONE_IMAGES = {
  [STONE_TYPES.MIND]: mindStone,
  [STONE_TYPES.REALITY]: realityStone,
  [STONE_TYPES.SPACE]: spaceStone,
  [STONE_TYPES.POWER]: powerStone,
  [STONE_TYPES.TIME]: timeStone,
};

export const Stone = ({ stoneType, size = "medium", className = "" }) => {
  const color = STONE_COLORS[stoneType];
  const image = STONE_IMAGES[stoneType];

  return (
    <div
      className={`${styles.stone} ${styles[size]} ${className}`}
      data-stone-type={stoneType}
    >
      {image && (
        <img
          src={image}
          alt={`${stoneType} stone`}
          className={styles.stoneImage}
          style={{ filter: `drop-shadow(0 0 10px ${color})` }}
        />
      )}
      <div className={styles.glow} style={{ backgroundColor: color }} />
    </div>
  );
};

Stone.propTypes = {
  stoneType: PropTypes.string.isRequired,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  className: PropTypes.string,
};

export default Stone;
