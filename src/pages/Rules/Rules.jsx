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

  return (
      <div className={styles.rules}>
        <button
            className={styles.backArrow}
            onClick={() => navigate("/")}
            aria-label="Retour à l'accueil"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>La Quête de l'Infini</h1>
            <p className={styles.subtitle}>
              L'univers tremble… Thanos recherche les Pierres d'Infinité.
            </p>
          </header>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>La Légende</h2>
            <div className={styles.legendContent}>
              <div className={styles.legendText}>
                <p className={styles.story}>
                  Avant l'aube des temps, six singularités existaient. Quand l'univers explosa,
                  leurs vestiges furent forgés en lingots concentrés : les <strong>Pierres d'Infinité</strong>.
                  Dispersées à travers le cosmos, chaque pierre confère à son porteur un pouvoir
                  absolu sur un aspect de l'existence.
                </p>
                <p className={styles.story}>
                  Désormais, le Titan fou <strong>Thanos</strong> a commencé sa chasse.
                  Son but : assembler les six pierres dans un Gantelet pour remodeler la réalité.
                  Mais toi — Gardien de la Galaxie, Avenger, héros de légende — tu te dresses sur son chemin.
                </p>
                <p className={styles.story}>
                  <strong>Forge ton propre Gantelet de l'Infini. Collecte les pierres avant Thanos.
                    C'est ta seule chance de le vaincre.</strong>
                </p>
              </div>
              <div className={styles.thanosContainer}>
                <img src={thanosImg} alt="Thanos, le Titan Fou" className={styles.thanosImage} />
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Les 6 Pierres d'Infinité</h2>
            <p className={styles.stonesIntro}>
              Chaque pierre renferme un pouvoir immense. Maîtrise-les toutes et l'univers se pliera à ta volonté.
            </p>
            <div className={styles.stonesShowcase}>
              <div className={styles.gauntletWrapper}>
                <img src={gauntletImg} alt="Le Gantelet de l'Infini" className={styles.gauntletImage} />
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
              <h2 className={styles.sectionTitle}>Ta Mission</h2>
              <p className={styles.story}>
                Rivalise avec les autres héros pour forger le Gantelet le plus puissant.
                Celui qui accumule le <strong>plus de puissance cosmique</strong> (points)
                sera digne d'affronter Thanos lors du combat final.
              </p>
              <p>
                La quête se termine quand un héros complète une{" "}
                <strong>rangée horizontale de 5 pierres</strong> sur son Mur du Gantelet —
                signe qu'il a suffisamment de puissance pour défier le Titan Fou.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Préparation au Combat</h2>
              <p className={styles.story}>
                Les Nains de Nidavellir ont activé leurs Forges, créant des pierres à partir d'énergie cosmique.
                Les héros se rassemblent, prêts à les revendiquer.
              </p>
              <div className={styles.setupGrid}>
                <div className={styles.setupItem}>
                  <span className={styles.setupNumber}>2</span>
                  <span className={styles.setupLabel}>héros</span>
                  <span className={styles.setupValue}>5 Forges</span>
                </div>
                <div className={styles.setupItem}>
                  <span className={styles.setupNumber}>3</span>
                  <span className={styles.setupLabel}>héros</span>
                  <span className={styles.setupValue}>7 Forges</span>
                </div>
                <div className={styles.setupItem}>
                  <span className={styles.setupNumber}>4</span>
                  <span className={styles.setupLabel}>héros</span>
                  <span className={styles.setupValue}>9 Forges</span>
                </div>
              </div>
              <ul className={styles.list}>
                <li>Place les <strong>Forges de Nidavellir</strong> au centre — c'est là que les pierres sont créées</li>
                <li>Remplis chaque Forge avec <strong>exactement 4 pierres aléatoires</strong> de la bourse cosmique</li>
                <li>Chaque héros reçoit son propre <strong>plateau Gantelet de l'Infini</strong></li>
                <li>Place ton <strong>marqueur de puissance</strong> sur zéro — ton voyage commence maintenant</li>
                <li>Le héros qui a le plus récemment contemplé les étoiles commence avec le <strong>marqueur Premier Joueur</strong></li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Ton Gantelet de l'Infini</h2>
              <p className={styles.story}>
                Eitri, Roi des Nains, t'a forgé un Gantelet. Mais les pierres brutes ne peuvent pas
                être maniées directement — elles doivent être canalisées avec soin dans les réceptacles du Gantelet.
              </p>
              <div className={styles.boardAreas}>
                <Box title="Conduits d'Énergie (Gauche)">
                  <p>
                    5 canaux où tu stabilises les pierres collectées avant de les insérer.
                    Le canal 1 contient 1 pierre, le canal 2 en contient 2, etc.
                  </p>
                </Box>
                <Box title="Grille du Gantelet (Droite)">
                  <p>
                    Une matrice 5×5 d'emplacements de puissance. Quand un conduit est plein,
                    la pierre s'y transfère définitivement. Chaque type de pierre apparaît une fois par rangée et par colonne.
                  </p>
                </Box>
                <Box title="Vide du Chaos (Bas)">
                  <p>
                    Les pierres instables tombent ici et drainent ta puissance ! Pénalités : -1, -1, -2, -2, -2, -3, -3
                  </p>
                </Box>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>La Chasse Commence</h2>
              <p className={styles.story}>
                La quête se déroule en plusieurs cycles d'alignement cosmique.
                Chaque cycle comporte <strong>3 phases</strong> où les héros rivalisent pour rassembler et exploiter la puissance des pierres.
              </p>

              <div className={styles.phase}>
                <div className={styles.phaseHeader}>
                  <span className={styles.phaseNumber}><span>A</span></span>
                  <h3 className={styles.phaseTitle}>La Collecte</h3>
                </div>
                <p className={styles.story}>
                  Les héros jouent à tour de rôle pour réclamer des pierres dans les Forges.
                  À ton tour, tu <strong>dois</strong> agir :
                </p>
                <Box title="Piller une Forge">
                  <ul>
                    <li>Prends <strong>TOUTES les pierres d'un même type</strong> depuis n'importe quelle Forge</li>
                    <li>Les pierres restantes se dispersent vers le <strong>Nexus Cosmique</strong> (centre de la table)</li>
                  </ul>
                </Box>
                <Box title="Fouiller le Nexus Cosmique">
                  <ul>
                    <li>Prends <strong>TOUTES les pierres d'un même type</strong> depuis le Nexus</li>
                    <li>Si tu es le <strong>premier</strong> à perturber le Nexus ce cycle, Thanos te remarque !
                      Prends le marqueur Premier Joueur dans ton Vide du Chaos (il compte comme pénalité)</li>
                  </ul>
                </Box>
                <p className={styles.phaseNote}>
                  Après avoir pris des pierres, canalise-les dans <strong>un seul</strong> de tes Conduits d'Énergie.
                  La Collecte se termine quand toutes les Forges ET le Nexus sont vides.
                </p>
              </div>

              <div className={styles.phase}>
                <div className={styles.phaseHeader}>
                  <span className={styles.phaseNumber}><span>B</span></span>
                  <h3 className={styles.phaseTitle}>Forgeage du Gantelet</h3>
                </div>
                <p className={styles.story}>
                  Tous les héros exploitent simultanément leurs pierres. Pour chaque Conduit d'Énergie, de haut en bas :
                </p>
                <ul className={styles.list}>
                  <li>Quand un Conduit est <strong>entièrement chargé</strong> : insère la pierre la plus à droite dans ta Grille du Gantelet</li>
                  <li><strong>Gagne de la puissance cosmique</strong> (points) immédiatement pour chaque pierre insérée</li>
                  <li>Les pierres excédentaires des conduits complétés retournent dans le vide cosmique</li>
                  <li>Les <strong>conduits incomplets</strong> conservent leur charge pour le prochain cycle</li>
                </ul>
                <Box title="Contrecoup du Vide du Chaos">
                  <p>Les pierres instables dans ton Vide du Chaos drainent ta puissance :</p>
                  <div className={styles.penaltyRow}>
                    {[-1,-1,-2,-2,-2,-3,-3].map((p, i) => (
                        <span key={i} className={styles.penalty}>{p}</span>
                    ))}
                  </div>
                  <p className={styles.penaltyNote}>
                    Ta puissance ne peut pas descendre en dessous de 0. Purge toutes les pierres du Vide du Chaos après le décompte.
                  </p>
                </Box>
              </div>

              <div className={styles.phase}>
                <div className={styles.phaseHeader}>
                  <span className={styles.phaseNumber}><span>C</span></span>
                  <h3 className={styles.phaseTitle}>Le Cosmos se Réaligne</h3>
                </div>
                <p className={styles.story}>
                  Si aucun héros n'a complété une rangée horizontale sur sa Grille du Gantelet :
                </p>
                <ul className={styles.list}>
                  <li>Le héros marqué par Thanos (avec le marqueur Premier Joueur) dirige le prochain cycle</li>
                  <li>Les Nains rallument les Forges avec 4 nouvelles pierres chacune</li>
                  <li>Si la bourse cosmique est vide, récupère les pierres défaussées et continue la chasse</li>
                </ul>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Canaliser les Pierres</h2>
              <p className={styles.story}>
                Les Pierres d'Infinité sont volatiles. Respecte ces règles sacrées pour les canaliser en sécurité :
              </p>
              <ul className={styles.list}>
                <li>Canalise les pierres <strong>de droite à gauche</strong> dans un seul Conduit d'Énergie</li>
                <li>Toutes les pierres d'un conduit doivent être du <strong>même type</strong></li>
                <li>Tu <strong>ne peux pas</strong> canaliser un type de pierre dans un conduit si ce type existe déjà dans la rangée correspondante du Gantelet</li>
                <li>Si tu prends plus de pierres que ton conduit ne peut en contenir, l'excédent tombe dans le <strong>Vide du Chaos</strong></li>
                <li>Tu peux délibérément sacrifier des pierres dans le Vide du Chaos (un risque stratégique)</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Exploiter la Puissance</h2>
              <p className={styles.story}>
                Chaque pierre insérée dans ton Gantelet augmente ta puissance cosmique :
              </p>
              <div className={styles.scoringExample}>
                <div className={styles.scoringCase}>
                  <span className={styles.scoringPoints}>1 pt</span>
                  <p>Une pierre placée <strong>seule</strong> (aucune pierre adjacente)</p>
                </div>
                <div className={styles.scoringCase}>
                  <span className={styles.scoringPoints}>+1 chacune</span>
                  <p>Compte toutes les pierres <strong>reliées horizontalement</strong> (y compris la nouvelle)</p>
                </div>
                <div className={styles.scoringCase}>
                  <span className={styles.scoringPoints}>+1 chacune</span>
                  <p>Compte toutes les pierres <strong>reliées verticalement</strong> (y compris la nouvelle)</p>
                </div>
              </div>
              <Box title="Puissance Ultime — Bonus de Victoire">
                <ul>
                  <li><strong>+2 points</strong> pour chaque <strong>alignement horizontal complet</strong> (5 pierres en rangée)</li>
                  <li><strong>+7 points</strong> pour chaque <strong>alignement vertical complet</strong> (5 pierres en colonne)</li>
                  <li><strong>+10 points</strong> pour avoir collecté les <strong>5 pierres d'un même type</strong> — maîtriser cet aspect de la réalité !</li>
                </ul>
              </Box>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Le Combat Final</h2>
              <p className={styles.story}>
                Quand un héros complète une <strong>rangée horizontale de 5 pierres</strong> sur son Gantelet,
                il a rassemblé assez de puissance pour défier Thanos. L'affrontement final commence !
              </p>
              <ul className={styles.list}>
                <li>Tous les héros ajoutent leurs <strong>Bonus de Puissance Ultime</strong> à leur score</li>
                <li>Le héros avec la <strong>plus grande puissance cosmique vainc Thanos</strong> et sauve l'univers !</li>
                <li>En cas d'égalité : le héros avec le plus d'alignements horizontaux complets l'emporte</li>
                <li>Toujours à égalité ? Vous unissez vos forces pour vaincre Thanos ensemble — victoire partagée !</li>
              </ul>
              <p className={styles.story}>
                <strong>« Je suis inévitable. »</strong> — Mais avec ton Gantelet complété, toi aussi.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Sagesse des Anciens</h2>
              <p className={styles.story}>La Guerre de l'Infini exige ruse et stratégie :</p>
              <ul className={styles.list}>
                <li><strong>Anticipation :</strong> Observe quelles pierres tes rivaux convoitent — prive-les de leur butin</li>
                <li><strong>Maîtriser une Pierre :</strong> Collecter les 5 pierres d'un type octroie +10 puissance — vraie maîtrise sur cet aspect de la réalité</li>
                <li><strong>Éviter le Chaos :</strong> Prendre trop de pierres remplit ton Vide du Chaos de pénalités handicapantes</li>
                <li><strong>Sacrifice Stratégique :</strong> Parfois prendre des pierres dont tu n'as pas besoin empêche tes rivaux de compléter leur Gantelet</li>
                <li><strong>Le Coup du Nexus :</strong> Être le premier au Nexus Cosmique fait de toi une cible, mais te donne aussi l'initiative</li>
                <li><strong>La Patience Paie :</strong> Les grands conduits (4 et 5 emplacements) sont plus longs à remplir mais offrent plus de flexibilité</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Tutoriel Vidéo</h2>
              <p>Tu préfères apprendre en regardant ? Consulte cette explication vidéo :</p>
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
                        alt="Tutoriel vidéo"
                        className={styles.thumbnailImage}
                    />
                    <div className={styles.playOverlay}>
                      <svg viewBox="0 0 24 24" fill="currentColor" className={styles.playIcon}>
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <span>Voir sur YouTube</span>
                </a>
              </div>
            </section>
          </div>

          <div className={styles.actions}>
            <Button variant="primary" size="large" onClick={() => navigate("/")}>
              Retour à l'Accueil
            </Button>
          </div>
        </div>
      </div>
  );
};

export default Rules;