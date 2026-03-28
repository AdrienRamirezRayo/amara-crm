import { useState } from "react";
import { X } from "lucide-react";
import { carriers } from "../data/crmData";

export const appointments = [
  {
    id: 1,
    client: "Marcus Hill",
    agent: "Adrien",
    time: "9:00 AM",
    date: "Today",
    type: "Discovery Call",
    status: "Confirmed",
  },
  {
    id: 2,
    client: "Sandra Lopez",
    agent: "Adrien",
    time: "11:30 AM",
    date: "Today",
    type: "Illustration Review",
    status: "Confirmed",
  },
  {
    id: 3,
    client: "David Brooks",
    agent: "Jasmine",
    time: "2:00 PM",
    date: "Tomorrow",
    type: "Application Call",
    status: "Pending",
  },
  {
    id: 4,
    client: "Renee Carter",
    agent: "Adrien",
    time: "5:15 PM",
    date: "Tomorrow",
    type: "Follow Up",
    status: "Confirmed",
  },
];

export default function AddLeadModal({ open, onClose, onAddLead }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    product: "",
    carrier: carriers[0],
    stage: "New Lead",
    premium: "",
    agent: "Adrien",
    followUp: "",
  });

  if (!open) return null;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const newLead = {
  id: Date.now(),
  name: form.name,
  phone: form.phone,
  product: form.product,
  carrier: form.carrier,
  stage: form.stage,
  premium: form.premium ? `$${form.premium}/mo` : "$0/mo",
  agent: form.agent,
  followUp: form.followUp || "Not set",
  notes: [],
};

    onAddLead(newLead);

    setForm({
      name: "",
      phone: "",
      product: "",
      carrier: carriers[0],
      stage: "New Lead",
      premium: "",
      agent: "Adrien",
      followUp: "",
    });

    onClose();
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card glass-card">
        <div className="card-pad">
          <div className="modal-header">
            <div>
              <div className="panel-title">Create New Lead</div>
              <div className="pipeline-meta">Add a new prospect into the lead engine.</div>
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
                Save Lead
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}