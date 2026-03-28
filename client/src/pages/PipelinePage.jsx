import { motion } from "framer-motion";
import ProgressRingCard from "../components/ProgressRingCard";

export default function PipelinePage({ leads, onStageChange }) {
  const stages = [
    "New Lead",
    "Follow Up",
    "Quoted",
    "Application",
    "Underwriting",
  ];

  const getLeadsByStage = (stage) =>
    leads.filter((lead) => lead.stage === stage);

  return (
    <div>
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Pipeline Matrix</h1>
          <p className="page-subtitle">
            Move deals through each stage and track conversion flow.
          </p>
        </div>
      </div>

      {/* RINGS 🔥 */}
      <div className="glass-card" style={{ marginBottom: 18 }}>
        <div className="card-pad">
          <div className="panel-title" style={{ marginBottom: 16 }}>
            Pipeline Health
          </div>

          <div className="ring-grid">
            <ProgressRingCard
              label="New Leads"
              value={getLeadsByStage("New Lead").length}
              max={leads.length}
              subtext="Fresh opportunities"
            />
            <ProgressRingCard
              label="Follow Ups"
              value={getLeadsByStage("Follow Up").length}
              max={leads.length}
              subtext="Needs action"
            />
            <ProgressRingCard
              label="Quoted"
              value={getLeadsByStage("Quoted").length}
              max={leads.length}
              subtext="Warm deals"
            />
            <ProgressRingCard
              label="Closing"
              value={
                getLeadsByStage("Application").length +
                getLeadsByStage("Underwriting").length
              }
              max={leads.length}
              subtext="Near submission"
            />
          </div>
        </div>
      </div>

      {/* PIPELINE BOARD 🔥 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${stages.length}, minmax(240px, 1fr))`,
          gap: 16,
          overflowX: "auto",
        }}
      >
        {stages.map((stage, index) => {
          const stageLeads = getLeadsByStage(stage);

          return (
            <motion.div
              key={stage}
              className="glass-card"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="card-pad">
                {/* STAGE HEADER */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 12,
                  }}
                >
                  <div className="pipeline-name">{stage}</div>
                  <span className="tag">{stageLeads.length}</span>
                </div>

                {/* LEADS */}
                <div style={{ display: "grid", gap: 10 }}>
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="pipeline-item"
                      style={{ cursor: "pointer" }}
                    >
                      <div className="pipeline-name">{lead.name}</div>

                      <div className="pipeline-meta">
                        {lead.product} • {lead.carrier}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: 8,
                          alignItems: "center",
                        }}
                      >
                        <span className="pipeline-meta">
                          {lead.premium}
                        </span>

                        {/* MOVE BUTTON */}
                        <select
                          value={lead.stage}
                          onChange={(e) =>
                            onStageChange(lead.id, e.target.value)
                          }
                          style={{
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "white",
                            borderRadius: 8,
                            padding: "4px 6px",
                          }}
                        >
                          {stages.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}

                  {stageLeads.length === 0 && (
                    <div className="pipeline-meta">No leads</div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}