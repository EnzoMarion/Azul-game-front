import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "../../components/Box";
import { Button } from "../../components/Button";
import { Stone } from "../../components/Stones";
import { STONE_TYPES } from "../../constants";
import thanosImg from "../../assets/thanos.png";
import gauntletImg from "../../assets/gauntlet.png";
import styles from "./Rules.module.scss";

const Rules = () => {
  const navigate = useNavigate();
  const [hoveredStone, setHoveredStone] = useState(null);

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className={styles.rules}>
      <button
        className={styles.backArrow}
        onClick={handleBack}
        aria-label="Back to home"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>

      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>The Infinity Quest</h1>
          <p className={styles.subtitle}>
            The universe trembles... Thanos seeks the Infinity Stones.
          </p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>The Legend</h2>
          <div className={styles.legendContent}>
            <div className={styles.legendText}>
              <p className={styles.story}>
                Before the dawn of time, six singularities existed. When the
                universe exploded into being, their remnants were forged into
                concentrated ingots: the <strong>Infinity Stones</strong>.
                Scattered across the cosmos, each stone grants its bearer
                absolute power over one aspect of existence.
              </p>
              <p className={styles.story}>
                Now, the Mad Titan <strong>Thanos</strong> has begun his hunt.
                His goal: to assemble all six stones into a Gauntlet and reshape
                reality itself. But you a Guardian of the Galaxy, an Avenger, a
                hero of legend stand in his way.
              </p>
              <p className={styles.story}>
                <strong>
                  Forge your own Infinity Gauntlet. Collect the stones before
                  Thanos does. Only then can you hope to defeat him.
                </strong>
              </p>
            </div>
            <div className={styles.thanosContainer}>
              <img
                src={thanosImg}
                alt="Thanos, the Mad Titan"
                className={styles.thanosImage}
              />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>The 6 Infinity Stones</h2>
          <p className={styles.stonesIntro}>
            Each stone holds immense power. Master them all, and the universe
            bends to your will.
          </p>
          <div className={styles.stonesShowcase}>
            <div className={styles.gauntletWrapper}>
              <img
                src={gauntletImg}
                alt="The Infinity Gauntlet"
                className={styles.gauntletImage}
              />
              <div className={styles.stonesRow}>
                {Object.values(STONE_TYPES).map((stone) => (
                  <div
                    key={stone}
                    className={styles.stoneItem}
                    data-stone={stone}
                    onMouseEnter={() => setHoveredStone(stone)}
                    onMouseLeave={() => setHoveredStone(null)}
                  >
                    <Stone stoneType={stone} size="small" />
                  </div>
                ))}
              </div>
              <div className={styles.stoneNameGang}>
                {hoveredStone ? hoveredStone : ""}
              </div>
            </div>
          </div>
        </section>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Your Mission</h2>
            <p className={styles.story}>
              Race against other heroes to forge the most powerful Gauntlet. The
              one who accumulates the <strong>most cosmic power</strong>{" "}
              (points) will be worthy to face Thanos in the final battle.
            </p>
            <p>
              The quest ends when a hero completes a{" "}
              <strong>horizontal row of 5 stones</strong> on their Gauntlet Wall
              signaling they have enough power to challenge the Mad Titan.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Preparing for Battle</h2>
            <p className={styles.story}>
              The Dwarves of Nidavellir have activated their Forges, crafting
              stones from cosmic energy. Heroes gather around, ready to claim
              them.
            </p>
            <div className={styles.setupGrid}>
              <div className={styles.setupItem}>
                <span className={styles.setupNumber}>2</span>
                <span className={styles.setupLabel}>heroes</span>
                <span className={styles.setupValue}>5 Forges</span>
              </div>
              <div className={styles.setupItem}>
                <span className={styles.setupNumber}>3</span>
                <span className={styles.setupLabel}>heroes</span>
                <span className={styles.setupValue}>7 Forges</span>
              </div>
              <div className={styles.setupItem}>
                <span className={styles.setupNumber}>4</span>
                <span className={styles.setupLabel}>heroes</span>
                <span className={styles.setupValue}>9 Forges</span>
              </div>
            </div>
            <ul className={styles.list}>
              <li>
                Place the <strong>Forges of Nidavellir</strong> in the center —
                these are where stones are crafted
              </li>
              <li>
                Fill each Forge with <strong>exactly 4 random stones</strong>{" "}
                from the cosmic pouch
              </li>
              <li>
                Each hero receives their own{" "}
                <strong>Infinity Gauntlet board</strong>
              </li>
              <li>
                Place your <strong>power marker</strong> on zero — your journey
                begins now
              </li>
              <li>
                The hero who most recently gazed at the stars begins with the{" "}
                <strong>First Player marker</strong>
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Your Infinity Gauntlet</h2>
            <p className={styles.story}>
              Eitri, King of the Dwarves, has forged you a Gauntlet. But raw
              stones cannot be wielded directly they must be carefully channeled
              into the Gauntlet's receptacles.
            </p>
            <div className={styles.boardAreas}>
              <Box title="Energy Conduits (Left)">
                <p>
                  5 channels where you stabilize collected stones before
                  embedding them. Channel 1 holds 1 stone, channel 2 holds 2,
                  etc.
                </p>
              </Box>
              <Box title="The Gauntlet Grid (Right)">
                <p>
                  A 5×5 matrix of power slots. When a conduit is full, the stone
                  transfers here permanently. Each stone type appears once per
                  row and column.
                </p>
              </Box>
              <Box title="Chaos Void (Bottom)">
                <p>
                  Unstable stones fall here and drain your power! Penalties: -1,
                  -1, -2, -2, -2, -3, -3
                </p>
              </Box>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>The Hunt Begins</h2>
            <p className={styles.story}>
              The quest unfolds over multiple cycles of cosmic alignment. Each
              cycle has <strong>3 phases</strong>
              as heroes compete to gather and harness the stones' power.
            </p>

            <div className={styles.phase}>
              <div className={styles.phaseHeader}>
                <span className={styles.phaseNumber}>
                  <span>A</span>
                </span>
                <h3 className={styles.phaseTitle}>The Gathering</h3>
              </div>
              <p className={styles.story}>
                Heroes take turns claiming stones from the Forges. On your turn,
                you <strong>must</strong> act decisively:
              </p>

              <Box title="Raid a Forge">
                <ul>
                  <li>
                    Claim <strong>ALL stones of one type</strong> from any Forge
                  </li>
                  <li>
                    The unclaimed stones scatter to the{" "}
                    <strong>Cosmic Nexus</strong> (center of the table)
                  </li>
                </ul>
              </Box>

              <Box title="Search the Cosmic Nexus">
                <ul>
                  <li>
                    Claim <strong>ALL stones of one type</strong> from the Nexus
                  </li>
                  <li>
                    If you're the <strong>first</strong> to disturb the Nexus
                    this cycle, Thanos notices you! Take the First Player marker
                    onto your Chaos Void (it counts as a penalty)
                  </li>
                </ul>
              </Box>

              <p className={styles.phaseNote}>
                After claiming stones, channel them into <strong>one</strong> of
                your Energy Conduits. The Gathering ends when all Forges AND the
                Nexus are depleted.
              </p>
            </div>

            <div className={styles.phase}>
              <div className={styles.phaseHeader}>
                <span className={styles.phaseNumber}>
                  <span>B</span>
                </span>
                <h3 className={styles.phaseTitle}>Forging the Gauntlet</h3>
              </div>
              <p className={styles.story}>
                All heroes simultaneously harness their gathered stones. For
                each Energy Conduit, from top to bottom:
              </p>
              <ul className={styles.list}>
                <li>
                  When a Conduit is <strong>fully charged</strong>: embed the
                  rightmost stone into your Gauntlet Grid
                </li>
                <li>
                  <strong>Gain cosmic power</strong> (points) immediately for
                  each stone embedded
                </li>
                <li>
                  Excess stones from completed conduits return to the cosmic
                  void
                </li>
                <li>
                  <strong>Incomplete conduits</strong> retain their charge for
                  the next cycle
                </li>
              </ul>

              <Box title="Chaos Void Backlash">
                <p>Unstable stones in your Chaos Void drain your power:</p>
                <div className={styles.penaltyRow}>
                  <span className={styles.penalty}>-1</span>
                  <span className={styles.penalty}>-1</span>
                  <span className={styles.penalty}>-2</span>
                  <span className={styles.penalty}>-2</span>
                  <span className={styles.penalty}>-2</span>
                  <span className={styles.penalty}>-3</span>
                  <span className={styles.penalty}>-3</span>
                </div>
                <p className={styles.penaltyNote}>
                  Your power cannot fall below 0. Purge all Chaos Void stones
                  after scoring.
                </p>
              </Box>
            </div>

            <div className={styles.phase}>
              <div className={styles.phaseHeader}>
                <span className={styles.phaseNumber}>
                  <span>C</span>
                </span>
                <h3 className={styles.phaseTitle}>The Cosmos Realigns</h3>
              </div>
              <p className={styles.story}>
                If no hero has completed a horizontal row on their Gauntlet
                Grid:
              </p>
              <ul className={styles.list}>
                <li>
                  The hero marked by Thanos (with the First Player marker) leads
                  the next cycle
                </li>
                <li>The Dwarves rekindle the Forges with 4 new stones each</li>
                <li>
                  If the cosmic pouch is empty, reclaim discarded stones and
                  continue the hunt
                </li>
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Channeling the Stones</h2>
            <p className={styles.story}>
              The Infinity Stones are volatile. Follow these sacred rules to
              channel them safely:
            </p>
            <ul className={styles.list}>
              <li>
                Channel stones from <strong>right to left</strong> into a single
                Energy Conduit
              </li>
              <li>
                All stones in a conduit must be the <strong>same type</strong>
              </li>
              <li>
                You <strong>cannot</strong> channel a stone type into a conduit
                if that type already exists in the corresponding Gauntlet row
              </li>
              <li>
                If you claim more stones than your conduit can hold, excess
                falls into the <strong>Chaos Void</strong>
              </li>
              <li>
                You may deliberately sacrifice stones to the Chaos Void (a
                strategic risk)
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Harnessing Power</h2>
            <p className={styles.story}>
              Each stone embedded in your Gauntlet increases your cosmic might:
            </p>

            <div className={styles.scoringExample}>
              <div className={styles.scoringCase}>
                <span className={styles.scoringPoints}>1 pt</span>
                <p>
                  A stone placed in <strong>isolation</strong> (no adjacent
                  stones)
                </p>
              </div>
              <div className={styles.scoringCase}>
                <span className={styles.scoringPoints}>+1 each</span>
                <p>
                  Count all <strong>horizontally linked</strong> stones
                  (including the new one)
                </p>
              </div>
              <div className={styles.scoringCase}>
                <span className={styles.scoringPoints}>+1 each</span>
                <p>
                  Count all <strong>vertically linked</strong> stones (including
                  the new one)
                </p>
              </div>
            </div>

            <Box title="Ultimate Power — Victory Bonuses">
              <ul>
                <li>
                  <strong>+2 power</strong> for each complete{" "}
                  <strong>horizontal alignment</strong> (5 stones in a row)
                </li>
                <li>
                  <strong>+7 power</strong> for each complete{" "}
                  <strong>vertical alignment</strong> (5 stones in a column)
                </li>
                <li>
                  <strong>+10 power</strong> for collecting all{" "}
                  <strong>5 stones of one type</strong> — mastering that aspect
                  of reality!
                </li>
              </ul>
            </Box>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>The Final Battle</h2>
            <p className={styles.story}>
              When a hero completes a{" "}
              <strong>horizontal row of 5 stones</strong> on their Gauntlet,
              they have gathered enough power to challenge Thanos. The final
              confrontation begins!
            </p>
            <ul className={styles.list}>
              <li>
                All heroes add their <strong>Ultimate Power bonuses</strong> to
                their score
              </li>
              <li>
                The hero with the{" "}
                <strong>most cosmic power defeats Thanos</strong> and saves the
                universe!
              </li>
              <li>
                If tied: the hero with more completed horizontal alignments
                prevails
              </li>
              <li>
                Still tied? You join forces to defeat Thanos together — shared
                victory!
              </li>
            </ul>
            <p className={styles.story}>
              <strong>"I am inevitable."</strong> — But with your completed
              Gauntlet, so are you.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Wisdom of the Ancients</h2>
            <p className={styles.story}>
              The Infinity War demands cunning strategy:
            </p>
            <ul className={styles.list}>
              <li>
                <strong>Foresight:</strong> Observe which stones your rivals
                seek — deny them their prize
              </li>
              <li>
                <strong>Master a Stone:</strong> Collecting all 5 of one type
                grants +10 power — true mastery over that aspect of reality
              </li>
              <li>
                <strong>Avoid Chaos:</strong> Claiming too many stones fills
                your Chaos Void with crippling penalties
              </li>
              <li>
                <strong>Strategic Sacrifice:</strong> Sometimes taking stones
                you don't need prevents rivals from completing their Gauntlet
              </li>
              <li>
                <strong>The Nexus Gambit:</strong> Being first to the Cosmic
                Nexus makes you a target, but also grants initiative
              </li>
              <li>
                <strong>Patience Pays:</strong> The larger conduits (4 and 5
                slots) take longer to fill but offer more flexibility
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Video Tutorial</h2>
            <p>
              Prefer to learn by watching? Check out this video explanation:
            </p>
            <div className={styles.videoContainer}>
              <a
                href="https://www.youtube.com/watch?v=193R2h2M3Yk"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.videoLink}
              >
                <div className={styles.videoThumbnail}>
                  <img
                    src="https://img.youtube.com/vi/193R2h2M3Yk/mqdefault.jpg"
                    alt="Video tutorial"
                    className={styles.thumbnailImage}
                  />
                  <div className={styles.playOverlay}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className={styles.playIcon}
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <span>Watch on YouTube</span>
              </a>
            </div>
          </section>
        </div>

        <div className={styles.actions}>
          <Button variant="primary" size="large" onClick={handleBack}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Rules;
