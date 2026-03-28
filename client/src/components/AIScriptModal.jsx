import { useMemo, useState } from "react";

function buildScript(lead, mode) {
  if (!lead) return "";

  if (mode === "note_summary") {
    return `Summary for ${lead.name}: ${lead.product} with ${lead.carrier}. Current stage is ${lead.stage}. Monthly premium is ${lead.premium}. Best next step is to clarify the client's main objection, confirm urgency, and move them toward the next decision point.`;
  }

  if (mode === "follow_up_text") {
    return `Hey ${lead.name}, I wanted to follow up because usually when people pause here it means one part still needs to feel right. Is it the budget, the amount of coverage, or the timing?`;
  }

  return `Hey ${lead.name}, I wanted to circle back because usually when someone pauses here, it is not that they do not want protection — it is that one part still needs to feel clear. Is it the budget, the amount of coverage, or just the timing?`;
}

export default function AIScriptModal({ open, onClose, lead }) {
  const [mode, setMode] = useState("call_script");
  const script = useMemo(() => buildScript(lead, mode), [lead, mode]);
  const [copied, setCopied] = useState(false);

  if (!open || !lead) return null;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(script);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="amara-modal-overlay" onClick={onClose}>
      <div className="amara-modal glass-card neon-card" onClick={(e) => e.stopPropagation()}>
        <div className="card-pad">
          <div className="panel-title">AI Assistant</div>

          <div className="stage-action-grid" style={{ marginTop: 16 }}>
            <button
              className={`small-btn ${mode === "call_script" ? "coach-active" : ""}`}
              onClick={() => setMode("call_script")}
            >
              Call Script
            </button>
            <button
              className={`small-btn ${mode === "follow_up_text" ? "coach-active" : ""}`}
              onClick={() => setMode("follow_up_text")}
            >
              Follow-Up Text
            </button>
            <button
              className={`small-btn ${mode === "note_summary" ? "coach-active" : ""}`}
              onClick={() => setMode("note_summary")}
            >
              Note Summary
            </button>
          </div>

          <div className="coach-card" style={{ marginTop: 16 }}>
            <div className="coach-label">Generated Output</div>
            <div className="carrier-meta" style={{ marginTop: 10 }}>
              {script}
            </div>
          </div>

          <div className="section-spacing">
            <div className="dashboard-signal-card">
              <div>
                <div className="pipeline-name">Lead Context</div>
                <div className="carrier-meta">
                  {lead.product} • {lead.carrier} • {lead.stage} • {lead.premium}
                </div>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="small-btn" onClick={onClose}>
              Close
            </button>
            <button type="button" className="primary-btn primary-btn-purple" onClick={handleCopy}>
              {copied ? "Copied" : "Copy Output"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}