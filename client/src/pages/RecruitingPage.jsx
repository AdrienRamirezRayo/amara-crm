import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { recruitingLeads as initialRecruitingLeads } from "../data/crmData";
import {
  UserPlus,
  Search,
  ShieldCheck,
  Phone,
  Mail,
  Instagram,
  BadgeCheck,
} from "lucide-react";

const recruitingStages = [
  "New",
  "Contacted",
  "Screening",
  "Interview",
  "Contracting",
  "Activated",
];

export default function RecruitingPage({ currentUser }) {
  const [entries, setEntries] = useState(initialRecruitingLeads);
  const [query, setQuery] = useState("");
  const [candidateType, setCandidateType] = useState("New Recruit");
  const [form, setForm] = useState({
    fullName: "",
    npn: "",
    email: "",
    phone: "",
    instagram: "",
  });

  const canReviewPipeline =
    currentUser?.role === "Admin" || currentUser?.role === "Manager";

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const newEntry = {
      id: Date.now(),
      submittedBy: currentUser?.name || "Unknown",
      submitterRole: currentUser?.role || "Agent",
      type: candidateType,
      fullName: form.fullName,
      npn: candidateType === "Agent" ? form.npn : "",
      email: form.email,
      phone: form.phone,
      instagram: form.instagram,
      status: "New",
    };

    setEntries((prev) => [newEntry, ...prev]);

    setForm({
      fullName: "",
      npn: "",
      email: "",
      phone: "",
      instagram: "",
    });
  }

  function advanceStatus(id) {
    if (!canReviewPipeline) return;

    setEntries((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const currentIndex = recruitingStages.indexOf(item.status);
        const nextIndex =
          currentIndex < recruitingStages.length - 1
            ? currentIndex + 1
            : currentIndex;

        return {
          ...item,
          status: recruitingStages[nextIndex],
        };
      })
    );
  }

  function moveToStage(id, stage) {
    if (!canReviewPipeline) return;

    setEntries((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: stage } : item
      )
    );
  }

  function getStatusClass(status) {
    const value = (status || "").toLowerCase();

    if (value === "new") return "priority-low";
    if (value === "contacted") return "stage-new";
    if (value === "screening") return "priority-medium";
    if (value === "interview") return "stage-application";
    if (value === "contracting") return "stage-underwriting";
    if (value === "activated") return "status-open";
    return "priority-default";
  }

  const filteredEntries = useMemo(() => {
    return entries.filter((item) => {
      const text = `${item.fullName} ${item.type} ${item.email} ${item.phone} ${item.instagram} ${item.submittedBy} ${item.status}`.toLowerCase();
      return text.includes(query.toLowerCase());
    });
  }, [entries, query]);

  const newCount = entries.filter((item) => item.status === "New").length;
  const agentCount = entries.filter((item) => item.type === "Agent").length;
  const recruitCount = entries.filter((item) => item.type === "New Recruit").length;

  const pipelineCounts = recruitingStages.reduce((acc, stage) => {
    acc[stage] = entries.filter((item) => item.status === stage).length;
    return acc;
  }, {});

  return (
    <div>
      <div className="grid-cards" style={{ marginBottom: "18px" }}>
        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">Recruiting Entries</div>
            <div className="stat-value">{entries.length}</div>
            <div className="stat-change">Submitted into recruiting center</div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">New Entries</div>
            <div className="stat-value">{newCount}</div>
            <div className="stat-change">Fresh submissions to review</div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">Licensed Agents</div>
            <div className="stat-value">{agentCount}</div>
            <div className="stat-change">Submitted with agent info</div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">New Recruits</div>
            <div className="stat-value">{recruitCount}</div>
            <div className="stat-change">Submitted as prospects</div>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: "18px" }}>
        <div className="card-pad">
          <div className="panel-title">Recruiting Pipeline</div>

          <div className="recruiting-stage-grid">
            {recruitingStages.map((stage) => (
              <div key={stage} className="pipeline-item">
                <div className="pipeline-top">
                  <div className="pipeline-name">{stage}</div>
                  <span className={`tag ${getStatusClass(stage)}`}>
                    {pipelineCounts[stage] || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="content-grid">
        <motion.div
          className="glass-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
        >
          <div className="card-pad">
            <div className="panel-title">Add To Recruiting Pipeline</div>
            <div className="pipeline-meta">
              {currentUser?.role === "Agent"
                ? "Agents can submit recruiting info for review."
                : "Admins and managers can submit and review recruiting entries."}
            </div>

            <div className="section-spacing">
              <div className="coach-mode-grid">
                <button
                  className={`small-btn ${candidateType === "New Recruit" ? "coach-active" : ""}`}
                  onClick={() => setCandidateType("New Recruit")}
                  type="button"
                >
                  New Recruit
                </button>
                <button
                  className={`small-btn ${candidateType === "Agent" ? "coach-active" : ""}`}
                  onClick={() => setCandidateType("Agent")}
                  type="button"
                >
                  Agent
                </button>
              </div>
            </div>

            <form className="modal-form" onSubmit={handleSubmit}>
              <input
                name="fullName"
                placeholder={candidateType === "Agent" ? "Agent full name" : "Recruit full name"}
                value={form.fullName}
                onChange={handleChange}
                required
              />

              {candidateType === "Agent" ? (
                <input
                  name="npn"
                  placeholder="NPN #"
                  value={form.npn}
                  onChange={handleChange}
                  required
                />
              ) : (
                <input
                  name="instagram"
                  placeholder="Instagram handle"
                  value={form.instagram}
                  onChange={handleChange}
                />
              )}

              <input
                name="email"
                placeholder="Personal email"
                type="email"
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

              {candidateType === "Agent" && (
                <input
                  name="instagram"
                  placeholder="Instagram handle if applicable"
                  value={form.instagram}
                  onChange={handleChange}
                />
              )}

              <div className="modal-actions">
                <button type="submit" className="primary-btn">
                  Submit Entry
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        <motion.div
          className="glass-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.06 }}
        >
          <div className="card-pad">
            <div className="panel-title">Recruiting Rules</div>

            <div className="activity-list">
              <div className="activity-item">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="stat-icon" style={{ width: 42, height: 42 }}>
                    <UserPlus size={18} />
                  </div>
                  <div>
                    <div className="pipeline-name">Agent Access</div>
                    <div className="activity-meta">
                      Agents can submit recruiting entries but do not control approval.
                    </div>
                  </div>
                </div>
              </div>

              <div className="activity-item">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="stat-icon" style={{ width: 42, height: 42 }}>
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <div className="pipeline-name">Review Access</div>
                    <div className="activity-meta">
                      Managers and admins can oversee the recruiting pipeline.
                    </div>
                  </div>
                </div>
              </div>

              <div className="activity-item">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="stat-icon" style={{ width: 42, height: 42 }}>
                    <Mail size={18} />
                  </div>
                  <div>
                    <div className="pipeline-name">Business-Relevant Data</div>
                    <div className="activity-meta">
                      Keep submissions limited to recruiting and onboarding information.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {!canReviewPipeline && (
              <div className="section-spacing">
                <div className="coach-card">
                  <div className="coach-label">Agent View</div>
                  <div className="carrier-meta">
                    You can submit recruiting information here. Review and pipeline movement stay with management.
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <div className="section-spacing" />

      <div className="search-bar glass-card">
        <Search size={18} color="#8dffe5" />
        <input
          type="text"
          placeholder="Search recruiting entries..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="leaderboard-list">
        {filteredEntries.map((item, index) => (
          <motion.div
            key={item.id}
            className="glass-card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: index * 0.04 }}
          >
            <div className="card-pad">
              <div className="task-row">
                <div>
                  <div className="carrier-name">{item.fullName}</div>
                  <div className="carrier-meta">
                    {item.type} • Submitted by {item.submittedBy} ({item.submitterRole})
                  </div>
                </div>

                <div className="task-badges">
                  <span className="tag">{item.type}</span>
                  <span className={`tag ${getStatusClass(item.status)}`}>{item.status}</span>
                </div>
              </div>

              <div className="section-spacing" style={{ display: "grid", gap: 10 }}>
                {item.npn ? <div className="carrier-meta">NPN #: {item.npn}</div> : null}

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

              {canReviewPipeline && (
                <div className="section-spacing">
                  <div className="coach-label">Move Through Pipeline</div>
                  <div className="stage-action-grid">
                    {recruitingStages.map((stage) => (
                      <button
                        key={stage}
                        className={`small-btn ${item.status === stage ? "coach-active" : ""}`}
                        onClick={() => moveToStage(item.id, stage)}
                      >
                        {stage}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="carrier-card-actions">
                {canReviewPipeline ? (
                  <>
                    <Link
                      to={`/recruiting/${item.id}`}
                      className="small-btn"
                      style={{
                        textAlign: "center",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                      }}
                    >
                      <BadgeCheck size={15} />
                      Review
                    </Link>
                    <button className="small-btn" onClick={() => advanceStatus(item.id)}>
                      Advance
                    </button>
                    <button className="small-btn">Assign</button>
                  </>
                ) : (
                  <>
                    <Link
                      to={`/recruiting/${item.id}`}
                      className="small-btn"
                      style={{
                        textAlign: "center",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      View
                    </Link>
                    <button className="small-btn">Update</button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}