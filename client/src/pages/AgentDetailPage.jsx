import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import {
  agents,
  agentProduction,
  initialLeads,
  tasks,
  recruitingLeads,
} from "../data/crmData";
import {
  ArrowLeft,
  Phone,
  Mail,
  Trophy,
  DollarSign,
  CheckSquare,
  Users,
  Rocket,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";
import StatRing from "../components/StatRing";

function getAgentReadiness(agentName) {
  const metrics = agentProduction.find((item) => item.agent === agentName);

  if (!metrics) return 18;

  let score = 20;
  score += Math.min(Math.round(metrics.monthlyPremium / 250), 35);
  score += Math.min(metrics.closeRate, 30);
  score += Math.min(metrics.issuedPolicies * 2, 15);

  return Math.max(0, Math.min(score, 100));
}

export default function AgentDetailPage() {
  const { id } = useParams();
  const agent = agents.find((item) => String(item.id) === String(id));

  if (!agent) {
    return (
      <div className="glass-card">
        <div className="card-pad">
          <div className="panel-title">Agent not found</div>
          <div className="section-spacing">
            <Link
              to="/agents"
              className="small-btn"
              style={{ display: "inline-block", textAlign: "center" }}
            >
              Back to Agents
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const metrics = agentProduction.find((item) => item.agent === agent.name);
  const assignedLeads = initialLeads.filter((lead) => lead.agent === agent.name);
  const assignedTasks = tasks.filter((task) => task.agent === agent.name);
  const submittedRecruits = recruitingLeads.filter(
    (item) => item.submittedBy === agent.name
  );

  const readiness = getAgentReadiness(agent.name);
  const openTasks = assignedTasks.filter((task) => task.status === "Open").length;
  const pendingLeads = assignedLeads.filter(
    (lead) => lead.stage === "Follow Up" || lead.stage === "Quoted"
  ).length;

  return (
    <div>
      <div className="section-spacing" style={{ marginTop: 0, marginBottom: 18 }}>
        <Link
          to="/agents"
          className="small-btn"
          style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
        >
          <ArrowLeft size={16} />
          Back to Agents
        </Link>
      </div>

      <div className="dashboard-hero-grid" style={{ marginBottom: 18 }}>
        <div className="glass-card neon-card">
          <div className="card-pad dashboard-ring-card">
            <StatRing
              value={readiness}
              label="Agent Readiness"
              sublabel={agent.role}
            />
            <div className="dashboard-ring-side">
              <div className="panel-title">{agent.name}</div>
              <div className="carrier-meta">
                Detail view for production, workflow pressure, and recruiting contribution.
              </div>
              <div className="soft-stat-row">
                <span className="soft-badge">{agent.role}</span>
                <span className="soft-badge">
                  Close Rate: {metrics?.closeRate || 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card neon-card">
          <div className="card-pad">
            <div className="panel-title">Agent Snapshot</div>

            <div className="dashboard-signal-list" style={{ marginTop: 14 }}>
              <div className="dashboard-signal-card">
                <div className="dashboard-signal-icon">
                  <Phone size={18} />
                </div>
                <div>
                  <div className="pipeline-name">Phone</div>
                  <div className="carrier-meta">{agent.phone}</div>
                </div>
              </div>

              <div className="dashboard-signal-card">
                <div className="dashboard-signal-icon">
                  <Mail size={18} />
                </div>
                <div>
                  <div className="pipeline-name">Email</div>
                  <div className="carrier-meta">{agent.email}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-cards" style={{ marginBottom: 18 }}>
        <div className="glass-card neon-card">
          <div className="card-pad">
            <div className="stat-label">Monthly Premium</div>
            <div className="stat-value">
              ${metrics?.monthlyPremium?.toLocaleString() || 0}
            </div>
            <div className="stat-change">Current tracked production</div>
          </div>
        </div>

        <div className="glass-card neon-card">
          <div className="card-pad">
            <div className="stat-label">Issued Policies</div>
            <div className="stat-value">{metrics?.issuedPolicies || 0}</div>
            <div className="stat-change">Policies placed</div>
          </div>
        </div>

        <div className="glass-card neon-card">
          <div className="card-pad">
            <div className="stat-label">Assigned Leads</div>
            <div className="stat-value">{assignedLeads.length}</div>
            <div className="stat-change">Lead ownership count</div>
          </div>
        </div>

        <div className="glass-card neon-card">
          <div className="card-pad">
            <div className="stat-label">Recruiting Entries</div>
            <div className="stat-value">{submittedRecruits.length}</div>
            <div className="stat-change">Submitted recruiting records</div>
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
            <div className="panel-title">Performance Signals</div>

            <div className="dashboard-signal-list">
              <div className="dashboard-signal-card">
                <div className="dashboard-signal-icon">
                  <Trophy size={18} />
                </div>
                <div>
                  <div className="pipeline-name">Production Signal</div>
                  <div className="carrier-meta">
                    Annualized revenue: ${metrics?.annualizedRevenue?.toLocaleString() || 0}.
                  </div>
                </div>
              </div>

              <div className="dashboard-signal-card">
                <div className="dashboard-signal-icon">
                  <CheckSquare size={18} />
                </div>
                <div>
                  <div className="pipeline-name">Workflow Signal</div>
                  <div className="carrier-meta">
                    {openTasks} open tasks and {pendingLeads} leads need follow-up pressure.
                  </div>
                </div>
              </div>

              <div className="dashboard-signal-card">
                <div className="dashboard-signal-icon">
                  <Rocket size={18} />
                </div>
                <div>
                  <div className="pipeline-name">Recruiting Signal</div>
                  <div className="carrier-meta">
                    {submittedRecruits.length} recruiting entries tied to this agent.
                  </div>
                </div>
              </div>
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
            <div className="panel-title">Leadership Read</div>

            <div className="coach-card">
              <div className="coach-label">Executive View</div>
              <div className="carrier-meta">
                {readiness >= 75
                  ? "Strong producer with real momentum. Keep pressure on consistency and scale."
                  : readiness >= 50
                  ? "Good operating range. More consistent execution can create bigger production jumps."
                  : "Needs stronger workflow discipline, tighter follow-up, and cleaner conversion control."}
              </div>
            </div>

            <div className="carrier-card-actions" style={{ marginTop: 16 }}>
              <button className="small-btn">
                <BadgeCheck size={15} />
                Review Agent
              </button>
              <button className="small-btn">
                <ShieldCheck size={15} />
                Assign Focus
              </button>
              <button className="small-btn">Message</button>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="section-spacing" />

      <div className="content-grid">
        <motion.div
          className="glass-card neon-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <div className="card-pad">
            <div className="panel-title">Assigned Leads</div>

            <div className="activity-list">
              {assignedLeads.length > 0 ? (
                assignedLeads.map((lead) => (
                  <div key={lead.id} className="activity-item">
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div className="stat-icon" style={{ width: 42, height: 42 }}>
                        <Users size={18} />
                      </div>
                      <div>
                        <div className="pipeline-name">{lead.name}</div>
                        <div className="activity-meta">
                          {lead.product} • {lead.stage} • {lead.premium}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="activity-item">
                  <div className="activity-meta">No leads assigned.</div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="glass-card neon-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
        >
          <div className="card-pad">
            <div className="panel-title">Assigned Tasks</div>

            <div className="activity-list">
              {assignedTasks.length > 0 ? (
                assignedTasks.map((task) => (
                  <div key={task.id} className="activity-item">
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div className="stat-icon" style={{ width: 42, height: 42 }}>
                        <CheckSquare size={18} />
                      </div>
                      <div>
                        <div className="pipeline-name">{task.title}</div>
                        <div className="activity-meta">
                          {task.lead} • {task.priority} • {task.status}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="activity-item">
                  <div className="activity-meta">No tasks assigned.</div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}