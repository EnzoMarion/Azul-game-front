import React from 'react';
import { Stone } from '../Stones';
import styles from './Factory.module.scss';

const Factory = ({ stones, onStoneClick }) => {
    return (
        <div className={styles.factory}>
            {stones.map((stone, index) => (
                <div key={index} className={styles.stoneWrapper} onClick={() => onStoneClick(stone)}>
                    <Stone stoneType={stone} size="medium" />
                </div>
            ))}
        </div>
    );
};

export default Factory;