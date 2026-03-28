import { motion } from "framer-motion";
import { auditLogs } from "../data/crmData";
import { Shield, Clock3, User, FileSearch } from "lucide-react";
import ProgressRingCard from "../components/ProgressRingCard";

export default function AuditCenterPage() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Audit Center</h1>
          <p className="page-subtitle">
            Review system activity, operational changes, and important user actions across the CRM.
          </p>
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: 18 }}>
        <div className="card-pad">
          <div className="panel-title" style={{ marginBottom: 16 }}>Control Rings</div>
          <div className="ring-grid">
            <ProgressRingCard label="Log Coverage" value={91} subtext="Strong visibility across activity" />
            <ProgressRingCard label="Risk Watch" value={38} subtext="Lower is better here" />
            <ProgressRingCard label="System Stability" value={86} subtext="Most actions are clean" />
            <ProgressRingCard label="Review Completion" value={73} subtext="Recent entries mostly checked" />
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
          <div className="panel-title">Activity Log</div>

          <div className="activity-list section-spacing">
            {auditLogs.map((log) => (
              <div key={log.id} className="activity-item">
                <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", gap: 12 }}>
                    <div className="stat-icon" style={{ width: 42, height: 42 }}>
                      <Shield size={18} />
                    </div>

                    <div>
                      <div className="pipeline-name">{log.action}</div>

                      <div className="carrier-meta" style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 6, flexWrap: "wrap" }}>
                        <User size={14} />
                        <span>{log.actor}</span>
                      </div>

                      <div className="carrier-meta" style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 6, flexWrap: "wrap" }}>
                        <FileSearch size={14} />
                        <span>{log.category} • {log.target}</span>
                      </div>

                      <div className="activity-meta" style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 6 }}>
                        <Clock3 size={14} />
                        <span>{log.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  <span className={`tag ${log.severity === "Warning" ? "yellow" : log.severity === "Success" ? "green" : ""}`}>
                    {log.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}