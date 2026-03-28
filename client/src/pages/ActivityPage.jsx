import { motion } from "framer-motion";
import {
  Bell,
  UserPlus,
  CheckCircle2,
  TrendingUp,
  Brain,
  GitBranch,
} from "lucide-react";
import { activityFeed, notifications } from "../data/crmData";

function getActivityIcon(type) {
  if (type === "lead") return UserPlus;
  if (type === "task") return CheckCircle2;
  if (type === "production") return TrendingUp;
  if (type === "coach") return Brain;
  return GitBranch;
}

function getPriorityClass(priority) {
  const value = priority.toLowerCase();

  if (value === "high") return "priority-high";
  if (value === "medium") return "priority-medium";
  if (value === "low") return "priority-low";
  return "priority-default";
}

export default function ActivityPage() {
  return (
    <div>
      <div className="grid-cards" style={{ marginBottom: "18px" }}>
        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">Recent Events</div>
            <div className="stat-value">{activityFeed.length}</div>
            <div className="stat-change">Tracked activity items</div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">Notifications</div>
            <div className="stat-value">{notifications.length}</div>
            <div className="stat-change">Live alerts in the system</div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">Urgent Alerts</div>
            <div className="stat-value">
              {notifications.filter((item) => item.status === "Urgent").length}
            </div>
            <div className="stat-change">Needs immediate attention</div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">System Pulse</div>
            <div className="stat-value">Live</div>
            <div className="stat-change">Activity tracking online</div>
          </div>
        </div>
      </div>

      <div className="content-grid">
        <motion.div
          className="glass-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="card-pad">
            <div className="panel-title">Live Activity Feed</div>

            <div className="activity-list">
              {activityFeed.map((item, index) => {
                const Icon = getActivityIcon(item.type);

                return (
                  <motion.div
                    key={item.id}
                    className="activity-item"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.04 }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <div className="stat-icon" style={{ width: 42, height: 42 }}>
                        <Icon size={18} />
                      </div>

                      <div style={{ flex: 1 }}>
                        <div className="pipeline-top">
                          <div className="pipeline-name">{item.title}</div>
                          <span className={`tag ${getPriorityClass(item.priority)}`}>
                            {item.priority}
                          </span>
                        </div>

                        <div className="activity-meta" style={{ marginTop: 6 }}>
                          {item.description}
                        </div>

                        <div className="carrier-meta" style={{ marginTop: 10 }}>
                          {item.time}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="glass-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
        >
          <div className="card-pad">
            <div className="panel-title">Notification Center</div>

            <div className="pipeline-list">
              {notifications.map((item) => (
                <div key={item.id} className="pipeline-item">
                  <div className="pipeline-top">
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Bell size={16} color="#8dffe5" />
                      <div className="pipeline-name">{item.title}</div>
                    </div>
                    <span className="tag">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="section-spacing">
              <div className="panel-title" style={{ marginBottom: 12 }}>
                Manager Focus
              </div>

              <div className="pipeline-item">
                <div className="pipeline-name">Daily Priority</div>
                <div className="pipeline-meta">
                  Clear overdue follow-ups, move quoted leads into submitted apps,
                  and monitor leaderboard changes.
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}