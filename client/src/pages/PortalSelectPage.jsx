import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Briefcase, User } from "lucide-react";

export default function PortalSelectPage() {
  const navigate = useNavigate();

  const portals = [
    {
      title: "Admin Portal",
      subtitle: "Agency owner and admin access",
      icon: <ShieldCheck size={18} />,
      path: "/login/admin",
    },
    {
      title: "Manager Portal",
      subtitle: "Team leader and manager access",
      icon: <Briefcase size={18} />,
      path: "/login/manager",
    },
    {
      title: "Agent Portal",
      subtitle: "Agent workspace access",
      icon: <User size={18} />,
      path: "/login/agent",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{ width: "100%", maxWidth: 720 }}
      >
        <div className="card-pad">
          <div style={{ display: "grid", gap: 10, marginBottom: 22 }}>
            <div className="glow-pill" style={{ width: "fit-content" }}>
              <ShieldCheck size={16} />
              Portal Access
            </div>

            <h1 className="page-title" style={{ margin: 0 }}>
              Choose Your AMARA CRM Portal
            </h1>

            <p className="page-subtitle" style={{ margin: 0 }}>
              Select the correct portal for your account type.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gap: 14,
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            }}
          >
            {portals.map((portal) => (
              <button
                key={portal.path}
                type="button"
                className="glass-card"
                onClick={() => navigate(portal.path)}
                style={{
                  textAlign: "left",
                  padding: 18,
                  border: "1px solid rgba(255,255,255,0.08)",
                  cursor: "pointer",
                  display: "grid",
                  gap: 10,
                }}
              >
                <div className="glow-pill" style={{ width: "fit-content" }}>
                  {portal.icon}
                  {portal.title}
                </div>

                <div className="page-subtitle" style={{ margin: 0 }}>
                  {portal.subtitle}
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}