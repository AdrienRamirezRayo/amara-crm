import { useState } from "react";

export default function CreateTaskModal({
  open,
  onClose,
  leadName,
  defaultAgent,
  onCreateTask,
}) {
  const [form, setForm] = useState({
    title: "",
    due: "Today",
    priority: "Medium",
  });

  if (!open) return null;

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    onCreateTask({
      id: Date.now(),
      title: form.title,
      lead: leadName,
      agent: defaultAgent,
      due: form.due,
      priority: form.priority,
      status: "Open",
    });

    setForm({
      title: "",
      due: "Today",
      priority: "Medium",
    });

    onClose();
  }

  return (
    <div className="amara-modal-overlay" onClick={onClose}>
      <div className="amara-modal glass-card neon-card" onClick={(e) => e.stopPropagation()}>
        <div className="card-pad">
          <div className="panel-title">Create Task</div>

          <form className="modal-form" onSubmit={handleSubmit}>
            <input
              name="title"
              placeholder="Task title"
              value={form.title}
              onChange={handleChange}
              required
            />

            <select name="due" value={form.due} onChange={handleChange}>
              <option>Today</option>
              <option>Tomorrow</option>
              <option>This Week</option>
              <option>Overdue</option>
            </select>

            <select name="priority" value={form.priority} onChange={handleChange}>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>

            <div className="modal-actions">
              <button type="button" className="small-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="primary-btn primary-btn-purple">
                Create Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}