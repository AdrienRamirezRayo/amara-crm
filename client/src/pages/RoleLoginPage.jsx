import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LockKeyhole, Mail, ShieldCheck, ArrowLeft } from "lucide-react";
import { supabase } from "../lib/supabase";

function getPortalTitle(requiredRole) {
  if (requiredRole === "admin") return "Admin Login";
  if (requiredRole === "manager") return "Manager Login";
  return "Agent Login";
}

function getPortalSubtitle(requiredRole) {
  if (requiredRole === "admin") {
    return "Sign in with an admin account.";
  }
  if (requiredRole === "manager") {
    return "Sign in with a manager account.";
  }
  return "Sign in with an agent account.";
}

export default function RoleLoginPage({ requiredRole }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorText("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      console.log("ROLE LOGIN SIGN IN RESULT:", { data, error });

      if (error) {
        setErrorText(error.message || "Login failed.");
        setLoading(false);
        return;
      }

      if (!data?.session?.user) {
        setErrorText("No session returned. Try again.");
        setLoading(false);
        return;
      }

      const user = data.session.user;

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, email, full_name, role, manager_id")
        .eq("id", user.id)
        .maybeSingle();

      console.log("ROLE LOGIN PROFILE RESULT:", { profile, profileError });

      if (profileError) {
        setErrorText(
          profileError.message ||
            "Could not load your profile. Please contact admin."
        );
        setLoading(false);
        return;
      }

      if (!profile) {
        setErrorText("No profile row found for this account.");
        setLoading(false);
        return;
      }

      const actualRole = String(profile.role || "").toLowerCase();

      if (actualRole !== requiredRole) {
        await supabase.auth.signOut();
        setErrorText(
          `This account is ${actualRole || "not assigned"}, not ${requiredRole}.`
        );
        setLoading(false);
        return;
      }

      navigate("/", { replace: true });
    } catch (err) {
      console.error("ROLE LOGIN ERROR:", err);
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
            <Link
              to="/login"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                textDecoration: "none",
              }}
            >
              <ArrowLeft size={15} />
              Back to portal selection
            </Link>

            <div className="glow-pill" style={{ width: "fit-content" }}>
              <ShieldCheck size={16} />
              {getPortalTitle(requiredRole)}
            </div>

            <h1 className="page-title" style={{ margin: 0 }}>
              AMARA CRM
            </h1>

            <p className="page-subtitle" style={{ margin: 0 }}>
              {getPortalSubtitle(requiredRole)}
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
              {loading ? "Signing in..." : getPortalTitle(requiredRole)}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}