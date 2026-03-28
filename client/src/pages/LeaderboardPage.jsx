import { motion } from "framer-motion";
import { Trophy, TrendingUp, BadgeDollarSign, Target } from "lucide-react";
import { agentProduction } from "../data/crmData";

export default function LeaderboardPage() {
  const rankedAgents = [...agentProduction].sort(
    (a, b) => b.monthlyPremium - a.monthlyPremium
  );

  return (
    <div>
      <div className="grid-cards" style={{ marginBottom: "18px" }}>
        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">Top Producer</div>
            <div className="stat-value">{rankedAgents[0]?.agent}</div>
            <div className="stat-change">Highest monthly premium</div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">Agency Monthly Premium</div>
            <div className="stat-value">
              $
              {rankedAgents
                .reduce((sum, agent) => sum + agent.monthlyPremium, 0)
                .toLocaleString()}
            </div>
            <div className="stat-change">Combined production</div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">Issued Policies</div>
            <div className="stat-value">
              {rankedAgents.reduce((sum, agent) => sum + agent.issuedPolicies, 0)}
            </div>
            <div className="stat-change">Across all tracked agents</div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">Average Close Rate</div>
            <div className="stat-value">
              {Math.round(
                rankedAgents.reduce((sum, agent) => sum + agent.closeRate, 0) /
                  rankedAgents.length
              )}
              %
            </div>
            <div className="stat-change">Team average</div>
          </div>
        </div>
      </div>

      <div className="leaderboard-list">
        {rankedAgents.map((agent, index) => (
          <motion.div
            key={agent.id}
            className="glass-card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.06 }}
          >
            <div className="card-pad">
              <div className="leaderboard-row">
                <div className="leaderboard-left">
                  <div className="leaderboard-rank">#{index + 1}</div>
                  <div>
                    <div className="carrier-name">{agent.agent}</div>
                    <div className="carrier-meta">
                      ${agent.monthlyPremium.toLocaleString()} monthly premium
                    </div>
                  </div>
                </div>

                <div className="tag">
                  <Trophy size={14} style={{ marginRight: 6 }} />
                  Ranked
                </div>
              </div>

              <div className="leaderboard-stats">
                <div className="drawer-info-card">
                  <div className="carrier-meta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <TrendingUp size={15} />
                    Issued Policies: {agent.issuedPolicies}
                  </div>
                </div>

                <div className="drawer-info-card">
                  <div className="carrier-meta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <BadgeDollarSign size={15} />
                    Annualized Revenue: ${agent.annualizedRevenue.toLocaleString()}
                  </div>
                </div>

                <div className="drawer-info-card">
                  <div className="carrier-meta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Target size={15} />
                    Close Rate: {agent.closeRate}%
                  </div>
                </div>

                <div className="drawer-info-card">
                  <div className="carrier-meta">
                    Pending Policies: {agent.pendingPolicies}
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