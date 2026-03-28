import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, ShieldCheck, UserCog } from "lucide-react";

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "Admin",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const roleName =
      form.role === "Admin"
        ? "Adrien"
        : form.role === "Manager"
        ? "Jasmine"
        : "Malik";

    onLogin({
      name: roleName,
      email: form.email || `${roleName.toLowerCase()}@amara.crm`,
      role: form.role,
    });

    navigate("/");
  }

  return (
    <div className="auth-shell">
      <div className="auth-card glass-card">
        <div className="card-pad">
          <div className="auth-header">
            <div className="brand-title">AMARA CRM</div>
            <div className="brand-subtitle">Neural Sales Operating System</div>
          </div>

          <div className="section-spacing">
            <div className="panel-title">Role Login</div>
            <div className="pipeline-meta">
              Enter as Admin, Manager, or Agent to test role-based access.
            </div>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-input">
              <Mail size={16} />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-input">
              <Lock size={16} />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-input">
              <UserCog size={16} />
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#eafcff",
                }}
              >
                <option value="Admin" style={{ color: "black" }}>Admin</option>
                <option value="Manager" style={{ color: "black" }}>Manager</option>
                <option value="Agent" style={{ color: "black" }}>Agent</option>
              </select>
            </div>

            <button type="submit" className="primary-btn auth-btn">
              Enter AMARA
            </button>
          </form>

          <div className="section-spacing">
            <div className="coach-card">
              <div className="coach-label" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ShieldCheck size={15} />
                Role Access
              </div>
              <div className="carrier-meta">
                Admin sees everything. Manager sees team and reporting tools. Agent sees the sales workspace.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}