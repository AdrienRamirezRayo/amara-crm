import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  Trophy,
  CheckSquare,
  Flame,
  DollarSign,
} from "lucide-react";
import { agentProduction } from "../data/crmData";

export default function ManagerDashboardPage({ leads, tasks, currentUser }) {
  const totalMonthlyPremium = agentProduction.reduce(
    (sum, agent) => sum + agent.monthlyPremium,
    0
  );

  const totalAnnualizedRevenue = agentProduction.reduce(
    (sum, agent) => sum + agent.annualizedRevenue,
    0
  );

  const totalIssuedPolicies = agentProduction.reduce(
    (sum, agent) => sum + agent.issuedPolicies,
    0
  );

  const openTasks = tasks.filter((task) => task.status === "Open").length;

  const topAgents = [...agentProduction]
    .sort((a, b) => b.monthlyPremium - a.monthlyPremium)
    .slice(0, 3);

  const hotLeads = leads.filter(
    (lead) =>
      lead.stage === "Application" ||
      lead.stage === "Underwriting" ||
      lead.stage === "Illustration Review"
  );

  return (
    <div>
      <div className="grid-cards" style={{ marginBottom: "18px" }}>
        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-row">
              <div>
                <div className="stat-label">Agency Monthly Premium</div>
                <div className="stat-value">${totalMonthlyPremium.toLocaleString()}</div>
              </div>
              <div className="stat-icon">
                <DollarSign size={22} />
              </div>
            </div>
            <div className="stat-change">{currentUser?.role} production view</div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-row">
              <div>
                <div className="stat-label">Annualized Revenue</div>
                <div className="stat-value">${totalAnnualizedRevenue.toLocaleString()}</div>
              </div>
              <div className="stat-icon">
                <BarChart3 size={22} />
              </div>
            </div>
            <div className="stat-change">Estimated yearly premium flow</div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-row">
              <div>
                <div className="stat-label">Issued Policies</div>
                <div className="stat-value">{totalIssuedPolicies}</div>
              </div>
              <div className="stat-icon">
                <Users size={22} />
              </div>
            </div>
            <div className="stat-change">Total issued across visible business</div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-row">
              <div>
                <div className="stat-label">Open Tasks</div>
                <div className="stat-value">{openTasks}</div>
              </div>
              <div className="stat-icon">
                <CheckSquare size={22} />
              </div>
            </div>
            <div className="stat-change">Tasks still needing action</div>
          </div>
        </div>
      </div>

      <div className="content-grid">
        <motion.div
          className="glass-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="card-pad">
            <div className="panel-title">Top Agents</div>

            <div className="leaderboard-list">
              {topAgents.map((agent, index) => (
                <div key={agent.id} className="pipeline-item">
                  <div className="pipeline-top">
                    <div>
                      <div className="pipeline-name">
                        #{index + 1} {agent.agent}
                      </div>
                      <div className="pipeline-meta">
                        ${agent.monthlyPremium.toLocaleString()} monthly premium
                      </div>
                    </div>
                    <span className="tag">
                      <Trophy size={14} style={{ marginRight: 6 }} />
                      Top
                    </span>
                  </div>

                  <div className="progress-wrap">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${Math.min(
                            (agent.monthlyPremium / topAgents[0].monthlyPremium) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                    <div className="pipeline-meta" style={{ marginTop: 8 }}>
                      Close Rate: {agent.closeRate}% • Issued: {agent.issuedPolicies}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="glass-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
        >
          <div className="card-pad">
            <div className="panel-title">Hottest Leads</div>

            <div className="activity-list">
              {hotLeads.map((lead) => (
                <div key={lead.id} className="activity-item">
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="stat-icon" style={{ width: 42, height: 42 }}>
                      <Flame size={18} />
                    </div>
                    <div>
                      <div className="pipeline-name">{lead.name}</div>
                      <div className="activity-meta">
                        {lead.product} • {lead.carrier} • {lead.stage}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="section-spacing">
              <div className="panel-title" style={{ marginBottom: 12 }}>
                Executive Focus
              </div>

              <div className="pipeline-item">
                <div className="pipeline-name">Agency Priority</div>
                <div className="pipeline-meta">
                  Increase agent follow-up consistency, improve app-to-issued conversion,
                  and move more quoted cases into submitted business.
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}