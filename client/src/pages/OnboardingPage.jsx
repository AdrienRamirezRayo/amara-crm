import { motion } from "framer-motion";
import {
  ShieldCheck,
  Rocket,
  Brain,
  UsersRound,
  Sparkles,
  CheckSquare,
  BadgeCheck,
} from "lucide-react";
import StatRing from "../components/ProgressRingCard";

const onboardingSteps = [
  {
    id: 1,
    title: "Agency Structure Setup",
    description: "Define admin, manager, and agent access flows.",
    completed: true,
  },
  {
    id: 2,
    title: "Recruiting Workflow",
    description: "Organize recruit capture, review, contracting, and activation.",
    completed: true,
  },
  {
    id: 3,
    title: "Sales Workflow",
    description: "Build lead, pipeline, appointments, illustrations, and commissions flow.",
    completed: true,
  },
  {
    id: 4,
    title: "AI Coaching Layer",
    description: "Add live guidance, objection handling, translation UI, and scripting support.",
    completed: true,
  },
  {
    id: 5,
    title: "Persistence / Deployment",
    description: "Connect database, auth, hosting, and production environment.",
    completed: false,
  },
];

export default function OnboardingPage() {
  const completedCount = onboardingSteps.filter((step) => step.completed).length;
  const readiness = Math.round((completedCount / onboardingSteps.length) * 100);

  return (
    <div>
      <div className="dashboard-hero-grid" style={{ marginBottom: 18 }}>
        <div className="glass-card neon-card">
          <div className="card-pad dashboard-ring-card">
            <StatRing
              value={readiness}
              label="Build Progress"
              sublabel={`${completedCount}/${onboardingSteps.length} complete`}
            />
            <div className="dashboard-ring-side">
              <div className="panel-title">Onboarding Command Layer</div>
              <div className="carrier-meta">
                This page should make it obvious where AMARA is already strong and what still needs to be activated.
              </div>
              <div className="soft-stat-row">
                <span className="soft-badge">Core Build Active</span>
                <span className="soft-badge">Deployment Pending</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card neon-card">
          <div className="card-pad">
            <div className="panel-title">Build Philosophy</div>

            <div className="dashboard-signal-list" style={{ marginTop: 14 }}>
              <div className="dashboard-signal-card">
                <div className="dashboard-signal-icon">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <div className="pipeline-name">Legal / Clean Structure</div>
                  <div className="carrier-meta">
                    AMARA should feel structured, role-aware, and operationally clean.
                  </div>
                </div>
              </div>

              <div className="dashboard-signal-card">
                <div className="dashboard-signal-icon">
                  <Sparkles size={18} />
                </div>
                <div>
                  <div className="pipeline-name">Premium Design</div>
                  <div className="carrier-meta">
                    Advanced does not mean messy. It should still feel simple and sharp.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="leaderboard-list">
        {onboardingSteps.map((step, index) => (
          <motion.div
            key={step.id}
            className="glass-card neon-card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: index * 0.04 }}
          >
            <div className="card-pad">
              <div className="task-row">
                <div>
                  <div className="carrier-name">{step.title}</div>
                  <div className="carrier-meta">{step.description}</div>
                </div>

                <div className="task-badges">
                  <span className={`tag ${step.completed ? "status-completed" : "priority-medium"}`}>
                    {step.completed ? "Complete" : "Pending"}
                  </span>
                </div>
              </div>

              <div className="section-spacing">
                <div className="dashboard-signal-list">
                  <div className="dashboard-signal-card">
                    <div className="dashboard-signal-icon">
                      {step.id === 1 ? (
                        <UsersRound size={18} />
                      ) : step.id === 2 ? (
                        <Rocket size={18} />
                      ) : step.id === 3 ? (
                        <CheckSquare size={18} />
                      ) : step.id === 4 ? (
                        <Brain size={18} />
                      ) : (
                        <ShieldCheck size={18} />
                      )}
                    </div>
                    <div>
                      <div className="pipeline-name">Step Status</div>
                      <div className="carrier-meta">
                        {step.completed
                          ? "This layer is already part of the active AMARA workspace."
                          : "This layer should be completed after visual/system polish is finished."}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="carrier-card-actions">
                <button className="small-btn">
                  <BadgeCheck size={15} />
                  Review
                </button>
                <button className="small-btn">Open Plan</button>
                <button className="small-btn">Track Progress</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}