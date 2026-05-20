import React from 'react';
import { Stone } from '../Stones';
import styles from './Board.module.scss';

const PatternLine = ({ size, stones = [] }) => {
    const slots = Array(size).fill(null);

    return (
        <div className={styles.patternLine}>
            {slots.map((_, index) => (
                <div key={index} className={styles.slot}>
                    {stones[index] && <Stone stoneType={stones[index]} size="small" />}
                </div>
            ))}
        </div>
    );
};