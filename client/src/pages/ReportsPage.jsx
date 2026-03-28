import { motion } from "framer-motion";
import { BarChart3, DollarSign, ShieldCheck, TrendingUp } from "lucide-react";
import ProgressRingCard from "../components/ProgressRingCard";
import { agentProduction } from "../data/crmData";

export default function ReportsPage() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">
            Track production, conversion quality, and revenue movement across your team.
          </p>
        </div>
        <button className="small-btn">Export Summary</button>
      </div>

      <div className="grid-cards" style={{ marginBottom: 18 }}>
        <div className="glass-card"><div className="card-pad"><div className="stat-icon"><DollarSign size={18} /></div><div className="section-spacing" /><div className="stat-label">Monthly Premium</div><div className="stat-value">$35.7K</div><div className="stat-change">Tracked across active production</div></div></div>
        <div className="glass-card"><div className="card-pad"><div className="stat-icon"><TrendingUp size={18} /></div><div className="section-spacing" /><div className="stat-label">Revenue Pace</div><div className="stat-value">$429K</div><div className="stat-change">Annualized momentum view</div></div></div>
        <div className="glass-card"><div className="card-pad"><div className="stat-icon"><BarChart3 size={18} /></div><div className="section-spacing" /><div className="stat-label">Issued Policies</div><div className="stat-value">45</div><div className="stat-change">Across tracked agents</div></div></div>
        <div className="glass-card"><div className="card-pad"><div className="stat-icon"><ShieldCheck size={18} /></div><div className="section-spacing" /><div className="stat-label">Quality Score</div><div className="stat-value">84%</div><div className="stat-change">Healthy persistency outlook</div></div></div>
      </div>

      <div className="glass-card" style={{ marginBottom: 18 }}>
        <div className="card-pad">
          <div className="panel-title" style={{ marginBottom: 16 }}>Report Rings</div>
          <div className="ring-grid">
            <ProgressRingCard label="Close Rate" value={71} subtext="Team conversion strength" />
            <ProgressRingCard label="Case Progression" value={79} subtext="Pipeline is moving well" />
            <ProgressRingCard label="Retention Outlook" value={83} subtext="Business quality appears solid" />
            <ProgressRingCard label="Recruit Output" value={62} subtext="Growth is building" />
          </div>
        </div>
      </div>

      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="card-pad">
          <div className="panel-title">Agent Production</div>

          <div className="pipeline-list section-spacing">
            {agentProduction.map((agent) => (
              <div key={agent.id} className="pipeline-item">
                <div className="pipeline-top">
                  <div>
                    <div className="pipeline-name">{agent.agent}</div>
                    <div className="pipeline-meta">
                      {agent.issuedPolicies} issued • {agent.pendingPolicies} pending • ${agent.monthlyPremium.toLocaleString()} monthly premium
                    </div>
                  </div>
                  <span className="tag green">{agent.closeRate}% close</span>
                </div>

                <div className="progress-wrap">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${agent.closeRate}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}