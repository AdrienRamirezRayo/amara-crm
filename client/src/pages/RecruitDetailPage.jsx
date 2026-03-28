import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  recruitingLeads,
  recruitActivity,
  recruitNotes,
  recruitChecklist,
} from "../data/crmData";
import {
  ArrowLeft,
  Mail,
  Phone,
  Instagram,
  ShieldCheck,
  Activity,
  CheckSquare,
  UserRound,
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

export default function RecruitDetailPage({ currentUser }) {
  const { id } = useParams();
  const originalRecruit = recruitingLeads.find(
    (item) => String(item.id) === String(id)
  );

  const [recruit, setRecruit] = useState(originalRecruit || null);
  const [activityList, setActivityList] = useState(recruitActivity);
  const [notesList, setNotesList] = useState(recruitNotes);
  const [checklist, setChecklist] = useState(recruitChecklist);
  const [newNote, setNewNote] = useState("");

  const canReviewPipeline =
    currentUser?.role === "Admin" || currentUser?.role === "Manager";

  if (!recruit) {
    return (
      <div className="glass-card">
        <div className="card-pad">
          <div className="panel-title">Recruit not found</div>
          <div className="section-spacing">
            <Link
              to="/recruiting"
              className="small-btn"
              style={{ display: "inline-block", textAlign: "center" }}
            >
              Back to Recruiting
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const relatedActivity = useMemo(
    () => activityList.filter((item) => item.recruit === recruit.fullName),
    [activityList, recruit.fullName]
  );

  const relatedNotes = useMemo(
    () => notesList.filter((item) => item.recruit === recruit.fullName),
    [notesList, recruit.fullName]
  );

  const relatedChecklist = useMemo(
    () => checklist.filter((item) => item.recruit === recruit.fullName),
    [checklist, recruit.fullName]
  );

  function addActivity(actionText) {
    const newActivity = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      recruit: recruit.fullName,
      action: actionText,
      actor: currentUser?.name || "Unknown",
      time: "Just now",
    };

    setActivityList((prev) => [newActivity, ...prev]);
  }

  function moveToStage(stage) {
    if (!canReviewPipeline) return;
    if (stage === recruit.status) return;

    const oldStage = recruit.status;

    setRecruit((prev) => ({
      ...prev,
      status: stage,
    }));

    addActivity(`Status changed from ${oldStage} to ${stage}`);
  }

  function toggleChecklist(id) {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );

    const item = relatedChecklist.find((entry) => entry.id === id);
    if (item) {
      addActivity(
        item.completed
          ? `Checklist item reopened: ${item.item}`
          : `Checklist item completed: ${item.item}`
      );
    }
  }

  function handleAddNote(e) {
    e.preventDefault();
    const text = newNote.trim();
    if (!text) return;

    const note = {
      id: Date.now(),
      recruit: recruit.fullName,
      text,
    };

    setNotesList((prev) => [note, ...prev]);
    setNewNote("");
    addActivity("New recruiting note added");
  }

  return (
    <div>
      <div className="section-spacing" style={{ marginTop: 0, marginBottom: 18 }}>
        <Link
          to="/recruiting"
          className="small-btn"
          style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
        >
          <ArrowLeft size={16} />
          Back to Recruiting
        </Link>
      </div>

      <div className="grid-cards" style={{ marginBottom: "18px" }}>
        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">Recruit Name</div>
            <div className="stat-value" style={{ fontSize: "1.4rem" }}>
              {recruit.fullName}
            </div>
            <div className="stat-change">{recruit.type}</div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">Current Stage</div>
            <div className="stat-value" style={{ fontSize: "1.4rem" }}>
              {recruit.status}
            </div>
            <div className="stat-change">Recruiting pipeline status</div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">Submitted By</div>
            <div className="stat-value" style={{ fontSize: "1.2rem" }}>
              {recruit.submittedBy}
            </div>
            <div className="stat-change">{recruit.submitterRole}</div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">Checklist Progress</div>
            <div className="stat-value">
              {relatedChecklist.filter((item) => item.completed).length}/
              {relatedChecklist.length}
            </div>
            <div className="stat-change">Completed recruiting steps</div>
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
            <div className="panel-title">Recruit Profile</div>

            <div className="pipeline-item">
              <div className="pipeline-name">{recruit.fullName}</div>
              <div className="pipeline-meta">
                {recruit.type} • {recruit.status}
              </div>
            </div>

            <div className="section-spacing" style={{ display: "grid", gap: 10 }}>
              {recruit.npn ? (
                <div className="drawer-info-card">
                  <div className="carrier-meta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <ShieldCheck size={15} />
                    NPN #: {recruit.npn}
                  </div>
                </div>
              ) : null}

              <div className="drawer-info-card">
                <div className="carrier-meta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Mail size={15} />
                  {recruit.email}
                </div>
              </div>

              <div className="drawer-info-card">
                <div className="carrier-meta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Phone size={15} />
                  {recruit.phone}
                </div>
              </div>

              {recruit.instagram ? (
                <div className="drawer-info-card">
                  <div className="carrier-meta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Instagram size={15} />
                    {recruit.instagram}
                  </div>
                </div>
              ) : null}

              <div className="drawer-info-card">
                <div className="carrier-meta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <UserRound size={15} />
                  Submitted by {recruit.submittedBy} ({recruit.submitterRole})
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="glass-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.05 }}
        >
          <div className="card-pad">
            <div className="panel-title">Recruit Status Control</div>

            <div className="stage-action-grid">
              {recruitingStages.map((stage) => (
                <button
                  key={stage}
                  className={`small-btn ${recruit.status === stage ? "coach-active" : ""}`}
                  onClick={() => moveToStage(stage)}
                  disabled={!canReviewPipeline}
                >
                  {stage}
                </button>
              ))}
            </div>

            {!canReviewPipeline && (
              <div className="section-spacing">
                <div className="coach-card">
                  <div className="coach-label">Agent View</div>
                  <div className="carrier-meta">
                    Only management can move candidates through the recruiting pipeline.
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <div className="section-spacing" />

      <div className="content-grid">
        <motion.div
          className="glass-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.1 }}
        >
          <div className="card-pad">
            <div className="panel-title">Recruiting Checklist</div>

            <div className="pipeline-list">
              {relatedChecklist.length > 0 ? (
                relatedChecklist.map((item) => (
                  <div key={item.id} className="pipeline-item">
                    <div className="pipeline-top">
                      <div>
                        <div className="pipeline-name">{item.item}</div>
                        <div className="pipeline-meta">
                          Recruiting requirement tracking
                        </div>
                      </div>

                      <button
                        className={`small-btn ${item.completed ? "coach-active" : ""}`}
                        onClick={() => toggleChecklist(item.id)}
                      >
                        {item.completed ? "Completed" : "Mark Done"}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="pipeline-item">
                  <div className="pipeline-meta">No checklist items yet.</div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="glass-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.15 }}
        >
          <div className="card-pad">
            <div className="panel-title">Recruit Notes</div>

            <form onSubmit={handleAddNote} className="section-spacing" style={{ marginTop: 0 }}>
              <div className="note-form">
                <input
                  placeholder="Add recruiting note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
                <button type="submit" className="primary-btn">
                  Save Note
                </button>
              </div>
            </form>

            <div className="notes-list">
              {relatedNotes.length > 0 ? (
                relatedNotes.map((note) => (
                  <div key={note.id} className="note-card">
                    <div className="carrier-meta">{note.text}</div>
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
      </div>

      <div className="section-spacing" />

      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, delay: 0.2 }}
      >
        <div className="card-pad">
          <div className="panel-title">Recruit Activity</div>

          <div className="activity-list">
            {relatedActivity.length > 0 ? (
              relatedActivity.map((item) => (
                <div key={item.id} className="activity-item">
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="stat-icon" style={{ width: 42, height: 42 }}>
                      <Activity size={18} />
                    </div>
                    <div>
                      <div className="pipeline-name">{item.action}</div>
                      <div className="activity-meta">
                        {item.actor} • {item.time}
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

          <div className="carrier-card-actions">
            <button className="small-btn">
              <BadgeCheck size={15} />
              Review
            </button>
            <button className="small-btn">Schedule Call</button>
            <button className="small-btn">Assign Owner</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}