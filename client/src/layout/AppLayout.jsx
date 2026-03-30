import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  DollarSign,
  Columns,
  Brain,
  Trophy,
  CheckSquare,
  UserCircle2,
  Bell,
  BarChart3,
  PlugZap,
  Settings2,
  UserPlus,
  LogOut,
  UsersRound,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import AmaraLogo from "../components/AmaraLogo";
import AddLeadModal from "../components/AddLeadModal";
import LeadDetailsDrawer from "../components/LeadDetailsDrawer";
import EditLeadModal from "../components/EditLeadModal";

export default function AppLayout({
  currentUser,
  onLogout,
  onOpenLeadModal,
  isLeadModalOpen,
  setIsLeadModalOpen,
  onAddLead,
  selectedLead,
  setSelectedLead,
  onDeleteLead,
  onEditLead,
  onStageChange,
  onAddNote,
  isEditModalOpen,
  setIsEditModalOpen,
  onSaveLead,
  dogBones,
  performanceStats,
}) {
  const location = useLocation();
  const role = (currentUser?.role || "agent").toLowerCase();

  const roleLabel =
  role === "admin"
    ? "Admin"
    : role === "manager"
    ? "Manager"
    : "Agent";

  const pageTitles = {
    "/": {
      title: "Command Center",
      subtitle: "Track production, monitor agents, and move deals faster.",
    },
    "/recruiting": {
      title: "Recruiting Center",
      subtitle:
        "Submit agent and recruit info, track pipeline entries, and grow the team.",
    },
    "/onboarding": {
      title: "Onboarding Center",
      subtitle: "Set up your agency structure, AI tools, and growth system.",
    },
    "/team-invite": {
      title: "Team Invites",
      subtitle: "Add agents, assign roles, and build your organization.",
    },
    "/audit": {
      title: "Audit Center",
      subtitle:
        "Track actions, review events, and maintain operational visibility.",
    },
    "/reports": {
      title: "Reports Center",
      subtitle:
        "View production metrics, conversion insights, and export-ready summaries.",
    },
    "/integrations": {
      title: "Integrations Hub",
      subtitle:
        "Manage platform connections, deployment targets, and future AI modules.",
    },
    "/settings": {
      title: "Agency Settings",
      subtitle:
        "Control branding, workflow rules, compliance settings, and system behavior.",
    },
    "/notifications": {
      title: "Notifications Center",
      subtitle: "Track live CRM activity, priority alerts, and team updates.",
    },
    "/agents": {
      title: "Agent Profiles",
      subtitle: "View agent performance, assignments, and production snapshots.",
    },
    "/manager": {
      title: "Manager Dashboard",
      subtitle:
        "Monitor agency performance, agent rankings, and operational priorities.",
    },
    "/tasks": {
      title: "Task Center",
      subtitle:
        "Track follow-ups, priorities, and daily execution for every agent.",
    },
    "/sales-coach": {
      title: "AI Sales Coach",
      subtitle:
        "Live prompting, transcription, translation, and guided sales scripting.",
    },
    "/leaderboard": {
      title: "Agency Leaderboard",
      subtitle: "Track agent production, rankings, and performance.",
    },
    "/leads": {
      title: "Lead Engine",
      subtitle: "Manage prospects, stages, follow-ups, and premium flow.",
    },
    "/appointments": {
      title: "Appointments Grid",
      subtitle: "Track your calls, reviews, meetings, and follow-up schedule.",
    },
    "/commissions": {
      title: "Commission Vault",
      subtitle: "Track payouts, pending revenue, and agent production.",
    },
    "/pipeline": {
      title: "Pipeline Matrix",
      subtitle: "Move deals through each stage of the sales system.",
    },
  };

  const current =
    pageTitles[location.pathname] ||
    (location.pathname.startsWith("/agents/")
      ? {
          title: "Agent Detail",
          subtitle:
            "Monitor individual agent performance, leads, and tasks.",
        }
      : location.pathname.startsWith("/leads/")
      ? {
          title: "Lead Profile",
          subtitle:
            "View full client details, notes, related tasks, and activity.",
        }
      : location.pathname.startsWith("/recruiting/")
      ? {
          title: "Recruit Detail",
          subtitle:
            "View recruiting profile, notes, checklist progress, and pipeline status.",
        }
      : {
          title: "AMARA CRM",
          subtitle: "Agency operating system",
        });

  return (
    <div className="crm-shell">
      <aside className="sidebar">
        <motion.div
          className="brand-box"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="brand-row">
            <AmaraLogo size={62} />
            <div>
              <div className="brand-title">AMARA CRM</div>
              <div className="brand-subtitle">
                Neural Sales Operating System
              </div>
            </div>
          </div>
        </motion.div>

        <div className="nav-section">
          <div className="nav-label">Sales</div>
          <div className="nav-list">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/pipeline"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <Columns size={18} />
              <span>Pipeline</span>
            </NavLink>

            <NavLink
              to="/sales-coach"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <Brain size={18} />
              <span>Sales Coach</span>
            </NavLink>

            <NavLink
              to="/leads"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <Users size={18} />
              <span>Leads</span>
            </NavLink>

            <NavLink
              to="/appointments"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <CalendarDays size={18} />
              <span>Appointments</span>
            </NavLink>

            <NavLink
              to="/tasks"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <CheckSquare size={18} />
              <span>Tasks</span>
            </NavLink>

            <NavLink
              to="/commissions"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <DollarSign size={18} />
              <span>Commissions</span>
            </NavLink>
          </div>
        </div>

        <div className="nav-section">
          <div className="nav-label">Recruiting</div>
          <div className="nav-list">
            <NavLink
              to="/recruiting"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <UsersRound size={18} />
              <span>Recruiting</span>
            </NavLink>

            {(role === "admin" || role === "manager") && (
              <NavLink
                to="/team-invite"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <UserPlus size={18} />
                <span>Team Invite</span>
              </NavLink>
            )}
          </div>
        </div>

        {(role === "admin" || role === "manager") && (
          <div className="nav-section">
            <div className="nav-label">Management</div>
            <div className="nav-list">
              <NavLink
                to="/manager"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <Trophy size={18} />
                <span>Manager Dashboard</span>
              </NavLink>

              <NavLink
                to="/leaderboard"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <Trophy size={18} />
                <span>Leaderboard</span>
              </NavLink>

              <NavLink
                to="/agents"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <UserCircle2 size={18} />
                <span>Agents</span>
              </NavLink>

              <NavLink
                to="/reports"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <BarChart3 size={18} />
                <span>Reports</span>
              </NavLink>
            </div>
          </div>
        )}

        {role === "admin" && (
          <div className="nav-section">
            <div className="nav-label">System</div>
            <div className="nav-list">
              <NavLink
                to="/notifications"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <Bell size={18} />
                <span>Notifications</span>
              </NavLink>

              <NavLink
                to="/integrations"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <PlugZap size={18} />
                <span>Integrations</span>
              </NavLink>

              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <Settings2 size={18} />
                <span>Settings</span>
              </NavLink>
            </div>
          </div>
        )}

        <div className="nav-section">
          <div className="nav-label">System Status</div>
          <div className="glass-card">
            <div className="card-pad">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <ShieldCheck size={18} color="#86efac" />
                <strong style={{ color: "#f5f3ff" }}>Network Online</strong>
              </div>

              <div className="pipeline-meta" style={{ marginTop: 12 }}>
                Lead engine active. Conversion stack synced. Performance economy
                live.
              </div>

              <div className="section-spacing">
                <span className="tag green">{roleLabel} Mode</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-panel">
        <div className="topbar">
          <div>
            <div className="topbar-title">{current.title}</div>
            <div className="topbar-subtitle">{current.subtitle}</div>
          </div>

          <div className="topbar-right">
            <div
              className="glass-card"
              style={{
                display: "flex",
                gap: 16,
                padding: "8px 14px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <div>
                <div className="stat-label">Production</div>
                <div className="stat-value">
                  ${performanceStats?.production?.toLocaleString() || 0}
                </div>
              </div>

              <div>
                <div className="stat-label">Close %</div>
                <div className="stat-value">
                  {performanceStats?.closeRate || 0}%
                </div>
              </div>

              <div>
                <div className="stat-label">Activity</div>
                <div className="stat-value">
                  {performanceStats?.callsToday || 0}
                </div>
              </div>
            </div>

            <div className="glow-pill">
              🦴 {dogBones?.toLocaleString() || 0} Bones
            </div>

            <div className="glow-pill">
              {currentUser?.name || "User"} • {roleLabel}
            </div>

            <button className="primary-btn" onClick={onOpenLeadModal}>
              + New Lead
            </button>

            <button className="small-btn" onClick={onLogout}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  justifyContent: "center",
                }}
              >
                <LogOut size={15} />
                Logout
              </div>
            </button>
          </div>
        </div>

        <Outlet />

        <AddLeadModal
          open={isLeadModalOpen}
          onClose={() => setIsLeadModalOpen(false)}
          onAddLead={onAddLead}
        />

        <LeadDetailsDrawer
          open={!!selectedLead && !isEditModalOpen}
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onDelete={onDeleteLead}
          onEdit={onEditLead}
          onStageChange={onStageChange}
          onAddNote={onAddNote}
        />

        <EditLeadModal
          open={isEditModalOpen}
          lead={selectedLead}
          onClose={() => setIsEditModalOpen(false)}
          onSave={onSaveLead}
        />
      </main>
    </div>
  );
}