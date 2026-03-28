import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { carriers } from "../data/crmData";

export default function EditLeadModal({ open, onClose, lead, onSave }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    product: "",
    carrier: carriers[0],
    stage: "New Lead",
    premium: "",
    agent: "",
    followUp: "",
  });

  useEffect(() => {
    if (lead) {
      setForm({
        name: lead.name || "",
        phone: lead.phone || "",
        product: lead.product || "",
        carrier: lead.carrier || carriers[0],
        stage: lead.stage || "New Lead",
        premium: (lead.premium || "").replace("$", "").replace("/mo", ""),
        agent: lead.agent || "",
        followUp: lead.followUp || "",
      });
    }
  }, [lead]);

  if (!open || !lead) return null;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    onSave({
      ...lead,
      ...form,
      premium: form.premium ? `$${form.premium}/mo` : "$0/mo",
    });

    onClose();
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card glass-card">
        <div className="card-pad">
          <div className="modal-header">
            <div>
              <div className="panel-title">Edit Lead</div>
              <div className="pipeline-meta">Update client information and workflow details.</div>
            </div>

            <button className="icon-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          <form className="modal-form" onSubmit={handleSubmit}>
            <input name="name" placeholder="Client name" value={form.name} onChange={handleChange} required />
            <input name="phone" placeholder="Phone number" value={form.phone} onChange={handleChange} required />
            <input name="product" placeholder="Product" value={form.product} onChange={handleChange} required />

            <select name="carrier" value={form.carrier} onChange={handleChange}>
              {carriers.map((carrier) => (
                <option key={carrier} value={carrier}>
                  {carrier}
                </option>
              ))}
            </select>

            <select name="stage" value={form.stage} onChange={handleChange}>
              <option>New Lead</option>
              <option>Quoted</option>
              <option>Application</option>
              <option>Underwriting</option>
              <option>Follow Up</option>
              <option>Illustration Review</option>
            </select>

            <input name="premium" placeholder="Monthly premium" value={form.premium} onChange={handleChange} />
            <input name="agent" placeholder="Assigned agent" value={form.agent} onChange={handleChange} />
            <input name="followUp" placeholder="Follow up time" value={form.followUp} onChange={handleChange} />

            <div className="modal-actions">
              <button type="button" className="small-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="primary-btn">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}