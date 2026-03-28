import { motion } from "framer-motion";
import { notifications } from "../data/crmData";
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Brain,
  UserPlus,
} from "lucide-react";

function getIcon(type) {
  if (type === "Lead Update") return AlertTriangle;
  if (type === "Task Completed") return CheckCircle2;
  if (type === "Production") return TrendingUp;
  if (type === "Coach Activity") return Brain;
  if (type === "New Lead") return UserPlus;
  return Bell;
}

function getPriorityClass(priority) {
  const value = priority.toLowerCase();
  if (value === "high") return "priority-high";
  if (value === "medium") return "priority-medium";
  if (value === "low") return "priority-low";
  return "priority-default";
}

export default function NotificationsPage() {
  const highCount = notifications.filter((item) => item.priority === "High").length;
  const mediumCount = notifications.filter((item) => item.priority === "Medium").length;
  const lowCount = notifications.filter((item) => item.priority === "Low").length;

  return (
    <div>
      <div className="grid-cards" style={{ marginBottom: "18px" }}>
        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">Total Alerts</div>
            <div className="stat-value">{notifications.length}</div>
            <div className="stat-change">Live system activity</div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">High Priority</div>
            <div className="stat-value">{highCount}</div>
            <div className="stat-change">Needs attention first</div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">Medium Priority</div>
            <div className="stat-value">{mediumCount}</div>
            <div className="stat-change">Operational updates</div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">Low Priority</div>
            <div className="stat-value">{lowCount}</div>
            <div className="stat-change">Background activity</div>
          </div>
        </div>
      </div>

      <div className="leaderboard-list">
        {notifications.map((item, index) => {
          const Icon = getIcon(item.type);

          return (
            <motion.div
              key={item.id}
              className="glass-card"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: index * 0.05 }}
            >
              <div className="card-pad">
                <div className="notification-row">
                  <div className="notification-left">
                    <div className="stat-icon" style={{ width: 46, height: 46 }}>
                      <Icon size={20} />
                    </div>

                    <div>
                      <div className="carrier-name">{item.title}</div>
                      <div className="carrier-meta">
                        {item.type} • Agent: {item.agent}
                      </div>
                    </div>
                  </div>

                  <div className="task-badges">
                    <span className={`tag ${getPriorityClass(item.priority)}`}>
                      {item.priority}
                    </span>
                    <span className="tag">{item.time}</span>
                  </div>
                </div>

                <div className="section-spacing">
                  <div className="carrier-meta">{item.detail}</div>
                </div>

                <div className="carrier-card-actions">
                  <button className="small-btn">Open</button>
                  <button className="small-btn">Assign</button>
                  <button className="small-btn">Archive</button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}