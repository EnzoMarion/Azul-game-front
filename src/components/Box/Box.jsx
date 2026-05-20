import React from "react";
import PropTypes from "prop-types";
import styles from "./Box.module.scss";

export const Box = ({ children, title, className = "" }) => {
  return (
    <div className={`${styles.box} ${className}`}>
      {title && <h4 className={styles.title}>{title}</h4>}
      <div className={styles.content}>{children}</div>
    </div>
  );
};

Box.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  className: PropTypes.string,
};

export default Box;
