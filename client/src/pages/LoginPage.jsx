import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LockKeyhole, Mail, ShieldCheck, UserPlus, LogIn } from "lucide-react";
import { supabase } from "../lib/supabase";
import { signInWithEmail } from "../services/auth";

export default function LoginPage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorText("");
    setSuccessText("");

    try {
      if (mode === "signin") {
        const { data, error } = await signInWithEmail(email, password);

        console.log("SIGN IN RESULT:", { data, error });

        if (error) {
          setErrorText(error.message || "Login failed.");
          return;
        }

        if (!data?.session) {
          setErrorText("No session was created. Check your email and password.");
          return;
        }

        navigate("/");
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      console.log("SIGN UP RESULT:", { data, error });

      if (error) {
        setErrorText(error.message || "Signup failed.");
        return;
      }

      const user = data?.user;

      if (user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert({
            id: user.id,
            email,
            full_name: fullName || email.split("@")[0],
            role: "agent",
          });

        if (profileError) {
          console.error("Profile create error:", profileError);
        }
      }

      setSuccessText(
        "Account created. If email confirmation is enabled, check your inbox. Then sign in."
      );
      setMode("signin");
      setPassword("");
    } catch (err) {
      console.error("AUTH ERROR:", err);
      setErrorText(err.message || "Unexpected auth error.");
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
              {mode === "signin"
                ? "Sign in to access your live CRM workspace."
                : "Create your account to join the CRM."}
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <button
              type="button"
              className="small-btn"
              onClick={() => {
                setMode("signin");
                setErrorText("");
                setSuccessText("");
              }}
              style={{
                flex: 1,
                border: mode === "signin" ? "1px solid rgba(255,255,255,0.25)" : undefined,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                <LogIn size={15} />
                Sign In
              </div>
            </button>

            <button
              type="button"
              className="small-btn"
              onClick={() => {
                setMode("signup");
                setErrorText("");
                setSuccessText("");
              }}
              style={{
                flex: 1,
                border: mode === "signup" ? "1px solid rgba(255,255,255,0.25)" : undefined,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                <UserPlus size={15} />
                Create Account
              </div>
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
            {mode === "signup" ? (
              <div className="drawer-info-card">
                <div className="coach-label">Full Name</div>
                <div className="search-bar">
                  <UserPlus size={16} />
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={mode === "signup"}
                  />
                </div>
              </div>
            ) : null}

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
                  placeholder={mode === "signin" ? "Enter password" : "Create password"}
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

            {successText ? (
              <div className="note-card">
                <div className="carrier-meta">{successText}</div>
              </div>
            ) : null}

            <button
              className="primary-btn"
              type="submit"
              disabled={loading}
              style={{ width: "100%", justifyContent: "center" }}
            >
              {loading
                ? mode === "signin"
                  ? "Signing in..."
                  : "Creating account..."
                : mode === "signin"
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}