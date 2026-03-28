import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { UserRound, Phone, Mail, ShieldCheck } from "lucide-react";
import { agents, agentProduction } from "../data/crmData";

export default function AgentsPage() {
  return (
    <div>
      <div className="grid-cards" style={{ marginBottom: "18px" }}>
        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">Active Agents</div>
            <div className="stat-value">{agents.length}</div>
            <div className="stat-change">Tracked inside AMARA</div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">Top Producer</div>
            <div className="stat-value">
              {[...agentProduction].sort((a, b) => b.monthlyPremium - a.monthlyPremium)[0]?.agent}
            </div>
            <div className="stat-change">Highest monthly premium</div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">Total Monthly Premium</div>
            <div className="stat-value">
              $
              {agentProduction
                .reduce((sum, agent) => sum + agent.monthlyPremium, 0)
                .toLocaleString()}
            </div>
            <div className="stat-change">Combined agent production</div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">Team Status</div>
            <div className="stat-value">Online</div>
            <div className="stat-change">All active agents available</div>
          </div>
        </div>
      </div>

      <div className="carrier-grid">
        {agents.map((agent, index) => {
          const production = agentProduction.find((item) => item.agent === agent.name);

          return (
            <motion.div
              key={agent.id}
              className="glass-card"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: index * 0.05 }}
            >
              <div className="card-pad">
                <div className="carrier-top">
                  <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                    <div className="carrier-logo-badge">
                      {agent.name.slice(0, 2).toUpperCase()}
                    </div>

                    <div>
                      <div className="carrier-name">{agent.name}</div>
                      <div className="carrier-meta">
                        {agent.role} • {agent.team}
                      </div>
                    </div>
                  </div>

                  <span className="tag">{agent.status}</span>
                </div>

                <div className="section-spacing" style={{ display: "grid", gap: 10 }}>
                  <div className="carrier-meta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <UserRound size={15} />
                    Monthly Premium: ${production?.monthlyPremium?.toLocaleString() || 0}
                  </div>

                  <div className="carrier-meta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Phone size={15} />
                    {agent.phone}
                  </div>

                  <div className="carrier-meta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Mail size={15} />
                    {agent.email}
                  </div>

                  <div className="carrier-meta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <ShieldCheck size={15} />
                    Close Rate: {production?.closeRate || 0}%
                  </div>
                </div>

                <div className="carrier-card-actions">
                  <Link to={`/agents/${agent.id}`} className="small-btn" style={{ textAlign: "center" }}>
                    Open Profile
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}