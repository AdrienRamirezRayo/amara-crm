import { motion } from "framer-motion";
import { gameChallenges } from "../data/crmData";
import {
  Trophy,
  Flame,
  Swords,
  Rocket,
  Sparkles,
  Bone,
  Crown,
} from "lucide-react";
import StatRing from "../components/StatRing";

function getStatusClass(status = "") {
  const value = status.toLowerCase();
  if (value === "live") return "status-open";
  if (value === "upcoming") return "priority-medium";
  return "priority-default";
}

function getDifficultyScore(level = "") {
  const value = level.toLowerCase();
  if (value === "elite") return 95;
  if (value === "high") return 78;
  if (value === "medium") return 58;
  return 40;
}

export default function GamesArenaPage() {
  const liveCount = gameChallenges.filter((game) => game.status === "Live").length;
  const totalReward = gameChallenges.reduce((sum, game) => sum + game.reward, 0);

  return (
    <div>
      <div className="dashboard-hero-grid" style={{ marginBottom: 18 }}>
        <motion.div
          className="glass-card neon-card game-hero-card crazy-gradient-card arena-master-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="card-pad">
            <div className="games-arena-header">
              <div>
                <div className="panel-title">Games Arena</div>
                <div className="carrier-meta">
                  Compete with agents, stack Dog Bones, and win rewards like free leads.
                </div>
              </div>

              <div className="arena-icon-wrap crown-pulse">
                <Crown size={28} />
              </div>
            </div>

            <div className="soft-stat-row" style={{ marginTop: 16 }}>
              <span className="soft-badge">Live Games: {liveCount}</span>
              <span className="soft-badge">Reward Pool: {totalReward}</span>
              <span className="soft-badge">AMARA Arena</span>
            </div>

            <div className="arena-glow-strip">
              <span className="arena-glow-pill"><Trophy size={14} /> Weekly Prizes</span>
              <span className="arena-glow-pill"><Bone size={14} /> Dog Bones Rewards</span>
              <span className="arena-glow-pill"><Flame size={14} /> High Pressure</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="glass-card neon-card pulse-game-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="card-pad">
            <div className="panel-title">Competition Rules</div>

            <div className="dashboard-signal-list" style={{ marginTop: 14 }}>
              <div className="dashboard-signal-card">
                <div className="dashboard-signal-icon">
                  <Trophy size={18} />
                </div>
                <div>
                  <div className="pipeline-name">Win By Production</div>
                  <div className="carrier-meta">
                    Contests reward real activity, not random clicking.
                  </div>
                </div>
              </div>

              <div className="dashboard-signal-card">
                <div className="dashboard-signal-icon">
                  <Bone size={18} />
                </div>
                <div>
                  <div className="pipeline-name">Rewards</div>
                  <div className="carrier-meta">
                    Use Dog Bones to unlock marketplace value and incentives.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="leaderboard-list">
        {gameChallenges.map((game, index) => (
          <motion.div
            key={game.id}
            className="glass-card neon-card contest-card arena-contest-card"
            initial={{ opacity: 0, scale: 0.98, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.28, delay: index * 0.04 }}
            whileHover={{ y: -5, scale: 1.01 }}
          >
            <div className="card-pad">
              <div className="dashboard-ring-card">
                <StatRing
                  value={getDifficultyScore(game.difficulty)}
                  size={82}
                  stroke={8}
                  label={game.difficulty}
                  sublabel="Difficulty"
                />

                <div className="dashboard-ring-side">
                  <div className="task-row">
                    <div>
                      <div className="carrier-name">{game.title}</div>
                      <div className="carrier-meta">{game.description}</div>
                    </div>

                    <div className="task-badges">
                      <span className={`tag ${getStatusClass(game.status)}`}>{game.status}</span>
                      <span className="tag">{game.reward} Bones</span>
                    </div>
                  </div>

                  <div className="section-spacing">
                    <div className="dashboard-signal-list">
                      <div className="dashboard-signal-card">
                        <div className="dashboard-signal-icon">
                          <Flame size={18} />
                        </div>
                        <div>
                          <div className="pipeline-name">Reward Value</div>
                          <div className="carrier-meta">
                            Winners earn {game.reward} Dog Bones and leaderboard clout.
                          </div>
                        </div>
                      </div>

                      <div className="dashboard-signal-card">
                        <div className="dashboard-signal-icon">
                          <Rocket size={18} />
                        </div>
                        <div>
                          <div className="pipeline-name">Competition Energy</div>
                          <div className="carrier-meta">
                            Make contests feel intense, visible, and worth checking daily.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="carrier-card-actions">
                    <button className="primary-btn primary-btn-purple">
                      <Trophy size={15} />
                      Join Challenge
                    </button>
                    <button className="small-btn">
                      <Sparkles size={15} />
                      View Rules
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}