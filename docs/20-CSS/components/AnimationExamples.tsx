import React from 'react';
import styles from './AnimationExamples.module.css';

export const TransitionExample = () => (
  <div className={styles.transitionContainer}>
    <div className={styles.transitionBox}>
      Hover Me!
    </div>
  </div>
);

export const KeyframeExample = () => (
  <div className={styles.keyframeContainer}>
    <div className={styles.bouncingBall} />
  </div>
);

export const TransformExample = () => (
  <div className={styles.transformContainer}>
    <div className={styles.transformBox}>
      Hover for 3D Transform
    </div>
  </div>
);

export const LoadingExample = () => (
  <div className={styles.loadingContainer}>
    <div className={styles.loadingSpinner} />
  </div>
);

export const CombinedExample = () => (
  <div className={styles.combinedContainer}>
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <h3>Animated Card</h3>
        <p>Hover me to see multiple effects!</p>
      </div>
    </div>
  </div>
);

export const ResponsiveExample = () => (
  <div className={styles.responsiveContainer}>
    <div className={styles.responsiveCard}>
      <div className={styles.cardIcon} />
      <div className={styles.cardContent}>
        <h3>Responsive Animation</h3>
        <p>Resize window to see different animations</p>
      </div>
    </div>
  </div>
); 