import { motion } from "framer-motion";
import { dailyPowerBoard } from "../data/crmData";
import { Flame, Target, Zap, ShieldAlert, Rocket } from "lucide-react";
import StatRing from "../components/StatRing";

export default function DailyPowerBoardPage({ currentUser }) {
  const totalTarget = dailyPowerBoard.goals.reduce((sum, goal) => sum + goal.target, 0);
  const totalCompleted = dailyPowerBoard.goals.reduce((sum, goal) => sum + goal.completed, 0);
  const completionRate = totalTarget
    ? Math.round((totalCompleted / totalTarget) * 100)
    : 0;

  return (
    <div>
      <div className="dashboard-hero-grid" style={{ marginBottom: 18 }}>
        <div className="glass-card neon-card">
          <div className="card-pad dashboard-ring-card">
            <StatRing
              value={completionRate}
              label="Daily Completion"
              sublabel={`${totalCompleted}/${totalTarget} actions`}
            />
            <div className="dashboard-ring-side">
              <div className="panel-title">Power Focus</div>
              <div className="carrier-meta">{dailyPowerBoard.focus}</div>
              <div className="soft-stat-row">
                <span className="soft-badge">{currentUser?.name || "User"}</span>
                <span className="soft-badge">{currentUser?.role || "Agent"} Mode</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card neon-card">
          <div className="card-pad dashboard-ring-card">
            <StatRing
              value={Math.min(dailyPowerBoard.alerts.length * 20, 100)}
              label="Pressure Index"
              sublabel={`${dailyPowerBoard.alerts.length} active alerts`}
            />
            <div className="dashboard-ring-side">
              <div className="panel-title">Attention Radar</div>
              <div className="carrier-meta">
                AMARA should show what needs action today, not just report data.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="content-grid">
        <motion.div
          className="glass-card neon-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="card-pad">
            <div className="panel-title">Daily Goal Stack</div>

            <div className="leaderboard-list">
              {dailyPowerBoard.goals.map((goal) => {
                const rate = goal.target
                  ? Math.round((goal.completed / goal.target) * 100)
                  : 0;

                return (
                  <div key={goal.id} className="glass-card inner-glow-card">
                    <div className="card-pad dashboard-ring-card">
                      <StatRing
                        value={rate}
                        size={78}
                        stroke={8}
                        label={goal.title}
                        sublabel={`${goal.completed}/${goal.target}`}
                      />

                      <div className="dashboard-ring-side">
                        <div className="pipeline-name">{goal.title}</div>
                        <div className="carrier-meta">
                          Completed {goal.completed} out of {goal.target} today.
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="glass-card neon-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
        >
          <div className="card-pad">
            <div className="panel-title">Today’s Alerts</div>

            <div className="activity-list">
              {dailyPowerBoard.alerts.map((alert, index) => (
                <div key={index} className="activity-item">
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="stat-icon" style={{ width: 42, height: 42 }}>
                      <ShieldAlert size={18} />
                    </div>
                    <div>
                      <div className="pipeline-name">{alert}</div>
                      <div className="activity-meta">
                        Power-board alert generated for today.
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="section-spacing">
              <div className="dashboard-signal-list">
                <div className="dashboard-signal-card">
                  <div className="dashboard-signal-icon">
                    <Flame size={18} />
                  </div>
                  <div>
                    <div className="pipeline-name">Momentum Rule</div>
                    <div className="carrier-meta">
                      Follow-up speed beats talent when pipeline volume grows.
                    </div>
                  </div>
                </div>

                <div className="dashboard-signal-card">
                  <div className="dashboard-signal-icon">
                    <Target size={18} />
                  </div>
                  <div>
                    <div className="pipeline-name">Operator Rule</div>
                    <div className="carrier-meta">
                      The board should tell agents what to do next, not just what happened.
                    </div>
                  </div>
                </div>

                <div className="dashboard-signal-card">
                  <div className="dashboard-signal-icon">
                    <Rocket size={18} />
                  </div>
                  <div>
                    <div className="pipeline-name">Growth Rule</div>
                    <div className="carrier-meta">
                      Recruiting, follow-up, and production should all connect on the same daily board.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="section-spacing" />

      <motion.div
        className="glass-card neon-card"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
      >
        <div className="card-pad">
          <div className="panel-title">Quick Win System</div>

          <div className="carrier-card-actions">
            <button className="primary-btn primary-btn-purple">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Zap size={15} />
                Start Power Hour
              </div>
            </button>
            <button className="small-btn">Open Hot Leads</button>
            <button className="small-btn">Open Recruiting</button>
            <button className="small-btn">Open Team Hub</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}