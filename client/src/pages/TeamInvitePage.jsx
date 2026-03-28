import { motion } from "framer-motion";
import { useState } from "react";
import {
  UserPlus,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Mail,
  Phone,
  Instagram,
  BadgeCheck,
} from "lucide-react";
import StatRing from "../components/ProgressRingCard";

const starterInvites = [
  {
    id: 1,
    name: "Jordan Miles",
    role: "Agent Prospect",
    email: "jordan@email.com",
    phone: "(312) 555-3301",
    instagram: "@jordansales",
    status: "Sent",
  },
  {
    id: 2,
    name: "Alyssa Dean",
    role: "Recruit",
    email: "alyssa@email.com",
    phone: "(312) 555-3302",
    instagram: "@alyssadean",
    status: "Pending",
  },
];

function getInviteScore(item) {
  let score = 35;
  if (item.status === "Sent") score += 25;
  if (item.status === "Pending") score += 15;
  if (item.instagram) score += 10;
  if (item.phone) score += 10;
  if (item.email) score += 10;
  return Math.max(0, Math.min(score, 100));
}

function getStatusClass(status = "") {
  const value = status.toLowerCase();
  if (value === "sent") return "status-completed";
  if (value === "pending") return "priority-medium";
  return "priority-default";
}

export default function TeamInvitePage() {
  const [invites, setInvites] = useState(starterInvites);
  const [form, setForm] = useState({
    name: "",
    role: "Recruit",
    email: "",
    phone: "",
    instagram: "",
  });

  const avgScore = invites.length
    ? Math.round(invites.reduce((sum, item) => sum + getInviteScore(item), 0) / invites.length)
    : 0;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const newInvite = {
      id: Date.now(),
      name: form.name,
      role: form.role,
      email: form.email,
      phone: form.phone,
      instagram: form.instagram,
      status: "Sent",
    };

    setInvites((prev) => [newInvite, ...prev]);

    setForm({
      name: "",
      role: "Recruit",
      email: "",
      phone: "",
      instagram: "",
    });
  }

  return (
    <div>
      <div className="dashboard-hero-grid" style={{ marginBottom: 18 }}>
        <div className="glass-card neon-card">
          <div className="card-pad dashboard-ring-card">
            <StatRing
              value={avgScore}
              label="Invite Strength"
              sublabel={`${invites.length} tracked invites`}
            />
            <div className="dashboard-ring-side">
              <div className="panel-title">Team Invite Center</div>
              <div className="carrier-meta">
                Keep invite flow simple, structured, and clean so recruiting support feels premium.
              </div>
              <div className="soft-stat-row">
                <span className="soft-badge">Recruiting Support</span>
                <span className="soft-badge">Team Growth</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card neon-card">
          <div className="card-pad">
            <div className="panel-title">Invite Guidance</div>

            <div className="dashboard-signal-list" style={{ marginTop: 14 }}>
              <div className="dashboard-signal-card">
                <div className="dashboard-signal-icon">
                  <UsersRound size={18} />
                </div>
                <div>
                  <div className="pipeline-name">Purpose</div>
                  <div className="carrier-meta">
                    Make it easy for agents, managers, and admins to bring people into the system cleanly.
                  </div>
                </div>
              </div>

              <div className="dashboard-signal-card">
                <div className="dashboard-signal-icon">
                  <Sparkles size={18} />
                </div>
                <div>
                  <div className="pipeline-name">Design Rule</div>
                  <div className="carrier-meta">
                    Inviting people should feel simple and premium, not like a messy form dump.
                  </div>
                </div>
              </div>
            </div>
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
            <div className="panel-title">Send Team Invite</div>

            <form className="modal-form" onSubmit={handleSubmit}>
              <input
                name="name"
                placeholder="Full name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <select name="role" value={form.role} onChange={handleChange}>
                <option>Recruit</option>
                <option>Agent Prospect</option>
                <option>Agent</option>
              </select>

              <input
                name="email"
                type="email"
                placeholder="Personal email"
                value={form.email}
                onChange={handleChange}
                required
              />

              <input
                name="phone"
                placeholder="Phone number"
                value={form.phone}
                onChange={handleChange}
                required
              />

              <input
                name="instagram"
                placeholder="Instagram handle"
                value={form.instagram}
                onChange={handleChange}
              />

              <div className="modal-actions">
                <button type="submit" className="primary-btn primary-btn-purple">
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <UserPlus size={15} />
                    Send Invite
                  </div>
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        <motion.div
          className="glass-card neon-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
        >
          <div className="card-pad">
            <div className="panel-title">Invite Standards</div>

            <div className="dashboard-signal-list">
              <div className="dashboard-signal-card">
                <div className="dashboard-signal-icon">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <div className="pipeline-name">Clean Data</div>
                  <div className="carrier-meta">
                    Keep invites limited to recruiting-relevant fields so the flow stays clean.
                  </div>
                </div>
              </div>

              <div className="dashboard-signal-card">
                <div className="dashboard-signal-icon">
                  <BadgeCheck size={18} />
                </div>
                <div>
                  <div className="pipeline-name">Growth Logic</div>
                  <div className="carrier-meta">
                    Invite support should make recruiting faster without turning the system into clutter.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="section-spacing" />

      <div className="leaderboard-list">
        {invites.map((item, index) => (
          <motion.div
            key={item.id}
            className="glass-card neon-card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: index * 0.03 }}
          >
            <div className="card-pad">
              <div className="dashboard-ring-card">
                <StatRing
                  value={getInviteScore(item)}
                  size={78}
                  stroke={8}
                  label="Invite Score"
                  sublabel={item.status}
                />

                <div className="dashboard-ring-side">
                  <div className="task-row">
                    <div>
                      <div className="carrier-name">{item.name}</div>
                      <div className="carrier-meta">{item.role}</div>
                    </div>

                    <div className="task-badges">
                      <span className="tag">{item.role}</span>
                      <span className={`tag ${getStatusClass(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>

                  <div className="section-spacing" style={{ display: "grid", gap: 10 }}>
                    <div className="carrier-meta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Mail size={15} />
                      {item.email}
                    </div>

                    <div className="carrier-meta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Phone size={15} />
                      {item.phone}
                    </div>

                    {item.instagram ? (
                      <div className="carrier-meta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Instagram size={15} />
                        {item.instagram}
                      </div>
                    ) : null}
                  </div>

                  <div className="carrier-card-actions">
                    <button className="small-btn">
                      <BadgeCheck size={15} />
                      Open
                    </button>
                    <button className="small-btn">Resend</button>
                    <button className="small-btn">Assign</button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}