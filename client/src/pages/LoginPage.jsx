import { useState } from "react";
import { motion } from "framer-motion";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { signInWithEmail } from "../services/auth";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorText("");

    try {
      const { data, error } = await signInWithEmail(email, password);

      if (error) {
        setErrorText(error.message || "Login failed.");
        setLoading(false);
        return;
      }

      const user = data?.user;

      if (!user) {
        setErrorText("No user returned from Supabase.");
        setLoading(false);
        return;
      }

      const role =
        user.user_metadata?.role ||
        user.app_metadata?.role ||
        "Agent";

      const fullName =
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "User";

      onLogin({
        id: user.id,
        name: fullName,
        email: user.email,
        role,
      });
    } catch (err) {
      setErrorText(err.message || "Unexpected login error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{ width: "100%", maxWidth: 460 }}
      >
        <div className="card-pad">
          <div style={{ display: "grid", gap: 10, marginBottom: 18 }}>
            <div className="glow-pill" style={{ width: "fit-content" }}>
              <ShieldCheck size={16} />
              Secure Login
            </div>

            <h1 className="page-title" style={{ margin: 0 }}>
              AMARA CRM
            </h1>

            <p className="page-subtitle" style={{ margin: 0 }}>
              Sign in to access your live CRM workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
            <div className="drawer-info-card">
              <div className="coach-label">Email</div>
              <div className="search-bar">
                <Mail size={16} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="drawer-info-card">
              <div className="coach-label">Password</div>
              <div className="search-bar">
                <LockKeyhole size={16} />
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {errorText ? (
              <div className="note-card">
                <div className="carrier-meta">{errorText}</div>
              </div>
            ) : null}

            <button
              className="primary-btn"
              type="submit"
              disabled={loading}
              style={{ width: "100%", justifyContent: "center" }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}