import { motion } from "framer-motion";
import { integrations } from "../data/crmData";
import {
  PlugZap,
  CalendarDays,
  CreditCard,
  FolderOpen,
  Users,
  Workflow,
  ShieldCheck,
  BellRing,
} from "lucide-react";

function getStatusClass(status) {
  if (status === "Connected") return "connected";
  if (status === "Coming Soon") return "soon";
  return "not-connected";
}

function getCategoryIcon(category) {
  switch (category) {
    case "Scheduling":
      return <CalendarDays size={18} />;
    case "Payments":
      return <CreditCard size={18} />;
    case "Storage":
      return <FolderOpen size={18} />;
    case "Automation":
      return <Workflow size={18} />;
    case "Contacts":
    case "Team Communication":
    case "CRM Sync":
      return <Users size={18} />;
    default:
      return <PlugZap size={18} />;
  }
}

export default function IntegrationsPage() {
  const connectedCount = integrations.filter(
    (item) => item.status === "Connected"
  ).length;

  const notConnectedCount = integrations.filter(
    (item) => item.status === "Not Connected"
  ).length;

  const comingSoonCount = integrations.filter(
    (item) => item.status === "Coming Soon"
  ).length;

  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <h1 className="panel-title" style={{ marginBottom: 6 }}>
          Integrations Hub
        </h1>
        <div className="carrier-meta">
          Connect the tools that power scheduling, documents, payments,
          automation, and operations across your CRM.
        </div>
      </div>

      <div
        className="grid-cards"
        style={{
          marginBottom: 18,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        }}
      >
        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">Connected</div>
            <div className="stat-value">{connectedCount}</div>
            <div className="stat-change">Active integrations</div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">Available</div>
            <div className="stat-value">{notConnectedCount}</div>
            <div className="stat-change">Ready to connect</div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">Coming Soon</div>
            <div className="stat-value">{comingSoonCount}</div>
            <div className="stat-change">Future tools</div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">Compliance Note</div>
            <div className="stat-value" style={{ fontSize: "1.1rem" }}>
              Messaging Delayed
            </div>
            <div className="stat-change">
              Texting tools can be added later after your business setup is ready
            </div>
          </div>
        </div>
      </div>

      <div
        className="content-grid"
        style={{ alignItems: "start", marginBottom: 18 }}
      >
        <motion.div
          className="glass-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="card-pad">
            <div className="panel-title">Integration Marketplace</div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 16,
                marginTop: 16,
              }}
            >
              {integrations.map((item) => (
                <div
                  key={item.id}
                  className="drawer-info-card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                    minHeight: 210,
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        alignItems: "flex-start",
                        marginBottom: 12,
                      }}
                    >
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <div className="stat-icon" style={{ width: 40, height: 40 }}>
                          {getCategoryIcon(item.category)}
                        </div>
                        <div>
                          <div className="pipeline-name">{item.name}</div>
                          <div className="pipeline-meta">{item.category}</div>
                        </div>
                      </div>

                      <span className={`integration-badge ${getStatusClass(item.status)}`}>
                        {item.status}
                      </span>
                    </div>

                    <div className="carrier-meta" style={{ lineHeight: 1.6 }}>
                      {item.description}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <div className="carrier-meta">
                      CRM-ready integration
                    </div>

                    <button className="small-btn">
                      {item.actionLabel}
                    </button>
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
            <div className="panel-title">Operations Notes</div>

            <div className="notes-list" style={{ marginTop: 16 }}>
              <div className="note-card">
                <div
                  className="carrier-meta"
                  style={{ display: "flex", gap: 10, alignItems: "center" }}
                >
                  <ShieldCheck size={16} />
                  Keep regulated messaging tools on hold until your business setup
                  is fully ready.
                </div>
              </div>

              <div className="note-card">
                <div
                  className="carrier-meta"
                  style={{ display: "flex", gap: 10, alignItems: "center" }}
                >
                  <BellRing size={16} />
                  Start with calendar, storage, contacts, and documents first.
                </div>
              </div>

              <div className="note-card">
                <div
                  className="carrier-meta"
                  style={{ display: "flex", gap: 10, alignItems: "center" }}
                >
                  <PlugZap size={16} />
                  Build the CRM foundation now, then add advanced communication
                  tools later.
                </div>
              </div>
            </div>

            <div className="section-spacing" />

            <div className="coach-card">
              <div className="coach-label">Recommended Setup Order</div>
              <div className="pipeline-list" style={{ marginTop: 12 }}>
                <div className="pipeline-item">
                  <div className="pipeline-name">1. Google Calendar</div>
                  <div className="pipeline-meta">Scheduling and appointment flow</div>
                </div>

                <div className="pipeline-item">
                  <div className="pipeline-name">2. Google Drive</div>
                  <div className="pipeline-meta">Document storage and training assets</div>
                </div>

                <div className="pipeline-item">
                  <div className="pipeline-name">3. Google Contacts</div>
                  <div className="pipeline-meta">Lead and client organization</div>
                </div>

                <div className="pipeline-item">
                  <div className="pipeline-name">4. Zapier</div>
                  <div className="pipeline-meta">Workflow automation once core systems are stable</div>
                </div>

                <div className="pipeline-item">
                  <div className="pipeline-name">5. Payments / e-sign tools</div>
                  <div className="pipeline-meta">Layer in later as operations expand</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}