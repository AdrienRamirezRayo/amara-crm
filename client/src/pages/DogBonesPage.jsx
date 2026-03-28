import { motion } from "framer-motion";
import { dogBonesWallet } from "../data/crmData";
import {
  Bone,
  Flame,
  Trophy,
  Sparkles,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import StatRing from "../components/StatRing";

function getLedgerClass(type = "") {
  const value = type.toLowerCase();
  if (value === "earned") return "status-open";
  if (value === "spent") return "priority-high";
  return "priority-default";
}

function FloatingBones() {
  return (
    <div className="floating-bones-layer" aria-hidden="true">
      <span className="floating-bone fb1">🦴</span>
      <span className="floating-bone fb2">🦴</span>
      <span className="floating-bone fb3">🦴</span>
      <span className="floating-bone fb4">🦴</span>
      <span className="floating-bone fb5">🦴</span>
    </div>
  );
}

export default function DogBonesPage({ balance, ledger }) {
  const earned = ledger
    .filter((item) => item.amount > 0)
    .reduce((sum, item) => sum + item.amount, 0);

  const spent = Math.abs(
    ledger
      .filter((item) => item.amount < 0)
      .reduce((sum, item) => sum + item.amount, 0)
  );

  const walletScore = Math.min(Math.round((balance / 1500) * 100), 100);

  return (
    <div>
      <div className="dashboard-hero-grid" style={{ marginBottom: 18 }}>
        <motion.div
          className="glass-card neon-card game-hero-card reward-hero-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FloatingBones />

          <div className="card-pad dashboard-ring-card">
            <StatRing
              value={walletScore}
              label="Dog Bone Power"
              sublabel={`${balance} bones`}
            />

            <div className="dashboard-ring-side">
              <div className="panel-title">Dog Bones Wallet</div>
              <div className="carrier-meta">
                Earn Dog Bones by producing, competing, booking, and staying active inside AMARA.
              </div>

              <div className="soft-stat-row">
                <span className="soft-badge">Rank #{dogBonesWallet.rank}</span>
                <span className="soft-badge">{dogBonesWallet.streak}-day streak</span>
              </div>

              <div className="section-spacing">
                <div className="reward-burst-row">
                  <div className="reward-burst-card">
                    <Wallet size={18} />
                    <span>{balance} Balance</span>
                  </div>
                  <div className="reward-burst-card">
                    <Flame size={18} />
                    <span>{dogBonesWallet.streak} Day Streak</span>
                  </div>
                  <div className="reward-burst-card">
                    <Trophy size={18} />
                    <span>Rank #{dogBonesWallet.rank}</span>
                  </div>
                </div>
              </div>
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
            <div className="panel-title">Reward System</div>

            <div className="dashboard-signal-list" style={{ marginTop: 14 }}>
              <div className="dashboard-signal-card">
                <div className="dashboard-signal-icon">
                  <Bone size={18} />
                </div>
                <div>
                  <div className="pipeline-name">Earn</div>
                  <div className="carrier-meta">
                    Sales, issued policies, booked appointments, and contests earn bones.
                  </div>
                </div>
              </div>

              <div className="dashboard-signal-card">
                <div className="dashboard-signal-icon">
                  <Sparkles size={18} />
                </div>
                <div>
                  <div className="pipeline-name">Spend</div>
                  <div className="carrier-meta">
                    Use Dog Bones in the lead marketplace and for reward-based perks.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid-cards animated-stat-grid" style={{ marginBottom: 18 }}>
        <motion.div className="glass-card neon-card stat-pop-card" whileHover={{ y: -4, scale: 1.01 }}>
          <div className="card-pad">
            <div className="stat-row">
              <div>
                <div className="stat-label">Balance</div>
                <div className="stat-value">{balance}</div>
              </div>
              <div className="stat-icon pulse-ring">
                <Wallet size={22} />
              </div>
            </div>
            <div className="stat-change">Current Dog Bones balance</div>
          </div>
        </motion.div>

        <motion.div className="glass-card neon-card stat-pop-card" whileHover={{ y: -4, scale: 1.01 }}>
          <div className="card-pad">
            <div className="stat-row">
              <div>
                <div className="stat-label">Earned</div>
                <div className="stat-value">{earned}</div>
              </div>
              <div className="stat-icon pulse-ring">
                <ArrowUpRight size={22} />
              </div>
            </div>
            <div className="stat-change">Recent Dog Bones earned</div>
          </div>
        </motion.div>

        <motion.div className="glass-card neon-card stat-pop-card" whileHover={{ y: -4, scale: 1.01 }}>
          <div className="card-pad">
            <div className="stat-row">
              <div>
                <div className="stat-label">Spent</div>
                <div className="stat-value">{spent}</div>
              </div>
              <div className="stat-icon pulse-ring">
                <ArrowDownLeft size={22} />
              </div>
            </div>
            <div className="stat-change">Recent Dog Bones spent</div>
          </div>
        </motion.div>

        <motion.div className="glass-card neon-card stat-pop-card" whileHover={{ y: -4, scale: 1.01 }}>
          <div className="card-pad">
            <div className="stat-row">
              <div>
                <div className="stat-label">Streak</div>
                <div className="stat-value">{dogBonesWallet.streak}</div>
              </div>
              <div className="stat-icon pulse-ring">
                <Flame size={22} />
              </div>
            </div>
            <div className="stat-change">Daily activity streak</div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="glass-card neon-card"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
      >
        <div className="card-pad">
          <div className="panel-title">Wallet Activity</div>

          <div className="leaderboard-list">
            {ledger.map((entry, index) => (
              <motion.div
                key={entry.id}
                className="glass-card inner-glow-card wallet-ledger-card"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ x: 4 }}
              >
                <div className="card-pad">
                  <div className="task-row">
                    <div>
                      <div className="carrier-name">{entry.title}</div>
                      <div className="carrier-meta">
                        {entry.reason} • {entry.time}
                      </div>
                    </div>

                    <div className="task-badges">
                      <span className={`tag ${getLedgerClass(entry.type)}`}>{entry.type}</span>
                      <span className="tag">
                        {entry.amount > 0 ? `+${entry.amount}` : entry.amount}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}