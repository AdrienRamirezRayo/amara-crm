import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import {
  agents,
  agentProduction,
  initialLeads,
  tasks,
} from "../data/crmData";
import { Phone, Mail, Trophy, CheckSquare, Users } from "lucide-react";

export default function AgentDetailPage() {
  const { id } = useParams();
  const agent = agents.find((item) => String(item.id) === String(id));

  if (!agent) {
    return (
      <div className="glass-card">
        <div className="card-pad">
          <div className="panel-title">Agent not found</div>
        </div>
      </div>
    );
  }

  const production = agentProduction.find((item) => item.agent === agent.name);
  const agentLeads = initialLeads.filter((lead) => lead.agent === agent.name);
  const agentTasks = tasks.filter((task) => task.agent === agent.name);

  return (
    <div>
      <div className="grid-cards" style={{ marginBottom: "18px" }}>
        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">Monthly Premium</div>
            <div className="stat-value">${production?.monthlyPremium?.toLocaleString() || 0}</div>
            <div className="stat-change">Current tracked production</div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">Issued Policies</div>
            <div className="stat-value">{production?.issuedPolicies || 0}</div>
            <div className="stat-change">Policies issued this cycle</div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">Close Rate</div>
            <div className="stat-value">{production?.closeRate || 0}%</div>
            <div className="stat-change">Tracked conversion performance</div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">Pending Policies</div>
            <div className="stat-value">{production?.pendingPolicies || 0}</div>
            <div className="stat-change">Still in motion</div>
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
            <div className="panel-title">Agent Profile</div>

            <div className="pipeline-item">
              <div className="pipeline-name">{agent.name}</div>
              <div className="pipeline-meta">{agent.role} • {agent.team}</div>
            </div>

            <div className="section-spacing" style={{ display: "grid", gap: 10 }}>
              <div className="carrier-meta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Phone size={15} />
                {agent.phone}
              </div>
              <div className="carrier-meta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Mail size={15} />
                {agent.email}
              </div>
              <div className="carrier-meta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Trophy size={15} />
                Annualized Revenue: ${production?.annualizedRevenue?.toLocaleString() || 0}
              </div>
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
            <div className="panel-title">Agent Workload</div>

            <div className="activity-list">
              <div className="activity-item">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="stat-icon" style={{ width: 42, height: 42 }}>
                    <Users size={18} />
                  </div>
                  <div>
                    <div className="pipeline-name">{agentLeads.length} Assigned Leads</div>
                    <div className="activity-meta">Current lead ownership</div>
                  </div>
                </div>
              </div>

              <div className="activity-item">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="stat-icon" style={{ width: 42, height: 42 }}>
                    <CheckSquare size={18} />
                  </div>
                  <div>
                    <div className="pipeline-name">{agentTasks.length} Tasks</div>
                    <div className="activity-meta">Tracked daily task load</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="section-spacing" />

      <div className="content-grid">
        <motion.div
          className="glass-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.12 }}
        >
          <div className="card-pad">
            <div className="panel-title">Assigned Leads</div>

            <div className="pipeline-list">
              {agentLeads.map((lead) => (
                <div key={lead.id} className="pipeline-item">
                  <div className="pipeline-top">
                    <div>
                      <div className="pipeline-name">{lead.name}</div>
                      <div className="pipeline-meta">
                        {lead.product} • {lead.carrier}
                      </div>
                    </div>
                    <span className="tag">{lead.stage}</span>
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
          transition={{ duration: 0.3, delay: 0.18 }}
        >
          <div className="card-pad">
            <div className="panel-title">Assigned Tasks</div>

            <div className="pipeline-list">
              {agentTasks.map((task) => (
                <div key={task.id} className="pipeline-item">
                  <div className="pipeline-top">
                    <div>
                      <div className="pipeline-name">{task.title}</div>
                      <div className="pipeline-meta">
                        {task.lead} • {task.due}
                      </div>
                    </div>
                    <span className="tag">{task.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}