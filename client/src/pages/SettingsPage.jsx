import { motion } from "framer-motion";
import { BellRing, Lock, Palette, Shield, Users } from "lucide-react";
import ProgressRingCard from "../components/ProgressRingCard";

export default function SettingsPage() {
  const settingsCards = [
    {
      title: "Profile & Branding",
      desc: "Manage agency identity, account details, and CRM brand presentation.",
      icon: <Palette size={18} />,
      action: "Manage",
    },
    {
      title: "Permissions",
      desc: "Control what admins, managers, and agents can view or edit.",
      icon: <Users size={18} />,
      action: "Edit Access",
    },
    {
      title: "Security",
      desc: "Strengthen login protection and sensitive workflow access.",
      icon: <Lock size={18} />,
      action: "Review",
    },
    {
      title: "Alerts",
      desc: "Customize reminders, task notifications, and important updates.",
      icon: <BellRing size={18} />,
      action: "Update",
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">
            Configure your CRM foundation, user controls, branding, and operational safeguards.
          </p>
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: 18 }}>
        <div className="card-pad">
          <div className="panel-title" style={{ marginBottom: 16 }}>System Readiness</div>
          <div className="ring-grid">
            <ProgressRingCard label="Brand Setup" value={88} subtext="Theme and structure are strong" />
            <ProgressRingCard label="Access Control" value={72} subtext="Team permissions partly refined" />
            <ProgressRingCard label="Security Layer" value={66} subtext="More hardening can be added" />
            <ProgressRingCard label="Notifications" value={79} subtext="Core reminders are in place" />
          </div>
        </div>
      </div>

      <div className="grid-cards">
        {settingsCards.map((card) => (
          <motion.div
            key={card.title}
            className="glass-card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="card-pad">
              <div className="stat-icon">{card.icon}</div>
              <div className="section-spacing" />
              <div className="pipeline-name">{card.title}</div>
              <div className="carrier-meta" style={{ marginTop: 8, lineHeight: 1.6 }}>
                {card.desc}
              </div>

              <div className="section-spacing" />
              <button className="small-btn">{card.action}</button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="section-spacing" />

      <div className="glass-card">
        <div className="card-pad">
          <div className="panel-title">Admin Note</div>
          <div className="note-card section-spacing">
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Shield size={16} />
              <div className="carrier-meta">
                Keep your CRM simple first: permissions, branding, agent roles, and workflow structure.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}