import { X, Phone, DollarSign, UserRound, CalendarClock, FileText, Trash2, Pencil } from "lucide-react";

function getStageClass(stage) {
  const normalized = stage.toLowerCase();

  if (normalized.includes("new")) return "stage-new";
  if (normalized.includes("quote")) return "stage-quoted";
  if (normalized.includes("application")) return "stage-application";
  if (normalized.includes("underwriting")) return "stage-underwriting";
  if (normalized.includes("follow")) return "stage-followup";
  return "stage-default";
}

export default function LeadDetailsDrawer({
  lead,
  open,
  onClose,
  onDelete,
  onEdit,
  onStageChange,
  onAddNote,
}) {
  if (!open || !lead) return null;

  return (
    <div className="drawer-overlay">
      <div className="drawer-panel glass-card">
        <div className="card-pad">
          <div className="drawer-header">
            <div>
              <div className="panel-title" style={{ marginBottom: 6 }}>
                {lead.name}
              </div>
              <div className="carrier-meta">
                {lead.product} • {lead.carrier}
              </div>
            </div>

            <button className="icon-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          <div className="section-spacing" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <span className={`tag ${getStageClass(lead.stage)}`}>{lead.stage}</span>
          </div>

          <div className="drawer-info-grid section-spacing">
            <div className="drawer-info-card">
              <div className="carrier-meta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Phone size={15} />
                {lead.phone}
              </div>
            </div>

            <div className="drawer-info-card">
              <div className="carrier-meta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <DollarSign size={15} />
                {lead.premium}
              </div>
            </div>

            <div className="drawer-info-card">
              <div className="carrier-meta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <UserRound size={15} />
                Agent: {lead.agent}
              </div>
            </div>

            <div className="drawer-info-card">
              <div className="carrier-meta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CalendarClock size={15} />
                Follow up: {lead.followUp}
              </div>
            </div>
          </div>

          <div className="section-spacing">
            <div className="panel-title" style={{ marginBottom: 10 }}>Update Stage</div>
            <div className="drawer-stage-actions">
              {["New Lead", "Quoted", "Application", "Underwriting", "Follow Up", "Illustration Review"].map((stage) => (
                <button
                  key={stage}
                  className="small-btn"
                  onClick={() => onStageChange(lead.id, stage)}
                >
                  {stage}
                </button>
              ))}
            </div>
          </div>

          <div className="section-spacing">
            <div className="panel-title" style={{ marginBottom: 10 }}>Notes</div>

            <div className="notes-list">
              {lead.notes && lead.notes.length > 0 ? (
                lead.notes.map((note, index) => (
                  <div key={index} className="note-card">
                    <div className="carrier-meta">{note}</div>
                  </div>
                ))
              ) : (
                <div className="note-card">
                  <div className="carrier-meta">No notes yet.</div>
                </div>
              )}
            </div>

            <AddNoteForm onAdd={(text) => onAddNote(lead.id, text)} />
          </div>

          <div className="drawer-footer">
            <button className="small-btn" onClick={() => onEdit(lead)}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                <Pencil size={15} />
                Edit
              </div>
            </button>

            <button className="small-btn danger-btn" onClick={() => onDelete(lead.id)}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                <Trash2 size={15} />
                Delete
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddNoteForm({ onAdd }) {
  function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const note = form.get("note")?.toString().trim();

    if (!note) return;

    onAdd(note);
    e.target.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="section-spacing">
      <div className="note-form">
        <input name="note" placeholder="Add a note..." />
        <button type="submit" className="primary-btn">Save Note</button>
      </div>
    </form>
  );
}