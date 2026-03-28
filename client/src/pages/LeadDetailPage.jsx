import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";

import {
  initialLeads,
  tasks,
  leadActivity,
} from "../data/crmData";
import {
  Phone,
  DollarSign,
  UserRound,
  CalendarClock,
  FileText,
  ArrowLeft,
  Activity,
  CheckSquare,
  Brain,
  Flame,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

function getLeadHeatScore(lead, relatedTasks) {
  let score = 35;

  if (lead.stage === "Quoted") score += 10;
  if (lead.stage === "Application") score += 25;
  if (lead.stage === "Underwriting") score += 30;
  if (lead.stage === "Illustration Review") score += 18;
  if (lead.notes?.length) score += Math.min(lead.notes.length * 5, 15);
  if (relatedTasks.some((task) => task.due === "Overdue")) score -= 12;
  if (relatedTasks.some((task) => task.priority === "High")) score += 8;

  return Math.max(0, Math.min(score, 100));
}

function getCommitmentLabel(score) {
  if (score >= 80) return "Hot";
  if (score >= 60) return "Warm";
  if (score >= 40) return "Active";
  return "Cold";
}

function getPredictedObjection(lead) {
  if (lead.stage === "Quoted") return "Price sensitivity likely";
  if (lead.stage === "Follow Up") return "Timing hesitation likely";
  if (lead.stage === "New Lead") return "Trust / interest still forming";
  if (lead.stage === "Illustration Review") return "Decision comparison phase";
  return "Qualification / approval questions likely";
}

function getNextBestAction(lead, relatedTasks) {
  if (relatedTasks.some((task) => task.due === "Overdue")) {
    return "Call immediately and re-open the conversation before momentum dies.";
  }

  if (lead.stage === "New Lead") {
    return "Run a strong discovery call and uncover the real need before pitching.";
  }

  if (lead.stage === "Quoted") {
    return "Review affordability and ask which part needs to feel better first.";
  }

  if (lead.stage === "Application") {
    return "Guide the client calmly through completion and remove hesitation.";
  }

  if (lead.stage === "Underwriting") {
    return "Keep expectations clear and maintain trust while waiting on carrier updates.";
  }

  return "Re-engage the lead with a direct question that uncovers the real objection.";
}

export default function LeadDetailPage() {
  const { id } = useParams();
  const lead = initialLeads.find((item) => String(item.id) === String(id));

  if (!lead) {
    return (
      <div className="glass-card">
        <div className="card-pad">
          <div className="panel-title">Lead not found</div>
          <div className="section-spacing">
            <Link to="/leads" className="small-btn" style={{ textAlign: "center", display: "inline-block" }}>
              Back to Leads
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const relatedTasks = tasks.filter((task) => task.lead === lead.name);
  const relatedActivity = leadActivity.filter(
  (item) => String(item.leadId) === String(lead.id)
);
  const heatScore = getLeadHeatScore(lead, relatedTasks);
  const commitment = getCommitmentLabel(heatScore);
  const predictedObjection = getPredictedObjection(lead);
  const nextBestAction = getNextBestAction(lead, relatedTasks);

  return (
    <div>
      <div className="section-spacing" style={{ marginTop: 0, marginBottom: 18 }}>
        <Link to="/leads" className="small-btn" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <ArrowLeft size={16} />
          Back to Leads
        </Link>
      </div>

      <div className="grid-cards" style={{ marginBottom: "18px" }}>
        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">Lead Name</div>
            <div className="stat-value" style={{ fontSize: "1.5rem" }}>{lead.name}</div>
            <div className="stat-change">{lead.stage}</div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">Monthly Premium</div>
            <div className="stat-value">{lead.premium}</div>
            <div className="stat-change">Current quoted or tracked premium</div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">Assigned Agent</div>
            <div className="stat-value" style={{ fontSize: "1.5rem" }}>{lead.agent}</div>
            <div className="stat-change">Lead ownership</div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">Follow Up</div>
            <div className="stat-value" style={{ fontSize: "1.3rem" }}>{lead.followUp}</div>
            <div className="stat-change">Next scheduled contact</div>
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
            <div className="panel-title">Lead Profile</div>

            <div className="pipeline-item">
              <div className="pipeline-name">{lead.name}</div>
              <div className="pipeline-meta">
                {lead.product} • {lead.carrier}
              </div>
            </div>

            <div className="section-spacing" style={{ display: "grid", gap: 12 }}>
              <div className="drawer-info-card">
                <div className="carrier-meta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Phone size={15} />
                  {lead.phone}
                </div>
              </div>

              <div className="drawer-info-card">
                <div className="carrier-meta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <DollarSign size={15} />
                  {lead.premium}
                </div>
              </div>

              <div className="drawer-info-card">
                <div className="carrier-meta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <UserRound size={15} />
                  Agent: {lead.agent}
                </div>
              </div>

              <div className="drawer-info-card">
                <div className="carrier-meta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <CalendarClock size={15} />
                  Follow up: {lead.followUp}
                </div>
              </div>

              <div className="drawer-info-card">
                <div className="carrier-meta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <FileText size={15} />
                  Stage: {lead.stage}
                </div>
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
            <div className="panel-title">Lead Intelligence Center</div>

            <div className="coach-card">
              <div className="coach-label">Heat Score</div>
              <div className="intelligence-row">
                <div className="pipeline-name" style={{ fontSize: "1.3rem" }}>
                  {heatScore}/100
                </div>
                <span className="tag">{commitment}</span>
              </div>

              <div className="progress-wrap">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${heatScore}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="coach-card">
              <div className="coach-label">Predicted Objection</div>
              <div className="carrier-meta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ShieldAlert size={16} />
                {predictedObjection}
              </div>
            </div>

            <div className="coach-card">
              <div className="coach-label">Next Best Action</div>
              <div className="pipeline-name" style={{ lineHeight: 1.5 }}>
                {nextBestAction}
              </div>
            </div>

            <div className="coach-card">
              <div className="coach-label">Smart Action Suggestions</div>
              <div className="carrier-card-actions">
                <button className="small-btn">
                  <Flame size={15} />
                  Prioritize Lead
                </button>
                <button className="small-btn">
                  <Brain size={15} />
                  Generate Script
                </button>
                <button className="small-btn">
                  <Sparkles size={15} />
                  Create Follow-Up
                </button>
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
            <div className="panel-title">Notes</div>

            <div className="notes-list">
              {lead.notes && lead.notes.length > 0 ? (
                lead.notes.map((note, index) => (
                  <div key={index} className="note-card">
                    <div className="carrier-meta">{note}</div>
                  </div>
                ))
              ) : (
                <div className="note-card">
                  <div className="carrier-meta">No notes yet.</div>
                </div>
              )}
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
            <div className="panel-title">Related Tasks</div>

            <div className="pipeline-list">
              {relatedTasks.length > 0 ? (
                relatedTasks.map((task) => (
                  <div key={task.id} className="pipeline-item">
                    <div className="pipeline-top">
                      <div>
                        <div className="pipeline-name">{task.title}</div>
                        <div className="pipeline-meta">
                          {task.agent} • {task.due}
                        </div>
                      </div>
                      <span className="tag">{task.status}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="pipeline-item">
                  <div className="pipeline-meta">No tasks tied to this lead.</div>
                </div>
              )}
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
          transition={{ duration: 0.3, delay: 0.22 }}
        >
          <div className="card-pad">
            <div className="panel-title">Lead Activity</div>

            <div className="activity-list">
              {relatedActivity.length > 0 ? (
                relatedActivity.map((item) => (
                  <div key={item.id} className="activity-item">
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div className="stat-icon" style={{ width: 42, height: 42 }}>
                        <Activity size={18} />
                      </div>
                      <div>
                        <div className="pipeline-name">{item.type}</div>
<div className="activity-meta">
  {item.note} • {item.date}
</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="activity-item">
                  <div className="activity-meta">No activity yet.</div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="glass-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.28 }}
        >
          <div className="card-pad">
            <div className="panel-title">Quick Actions</div>

            <div className="carrier-card-actions">
              <button className="small-btn">
                <Phone size={16} />
                Call Lead
              </button>

              <button className="small-btn">
                <CheckSquare size={16} />
                Create Task
              </button>

              <button className="small-btn">
                <FileText size={16} />
                Add Note
              </button>
            </div>

            <div className="section-spacing">
              <div className="coach-card">
                <div className="coach-label">Experimental Feature</div>
                <div className="carrier-meta">
                  This lead page can evolve into a full predictive decision cockpit with AI scripting, objection tracking, and conversion scoring.
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}