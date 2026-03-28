import { motion } from "framer-motion";
import {
  Users,
  DollarSign,
  CalendarDays,
  TrendingUp,
  PhoneCall,
  FileCheck,
} from "lucide-react";

const stats = [
  {
    title: "Active Leads",
    value: "148",
    change: "+18.2% this week",
    icon: Users,
  },
  {
    title: "Monthly Premium",
    value: "$42,680",
    change: "+9.4% growth",
    icon: DollarSign,
  },
  {
    title: "Appointments",
    value: "26",
    change: "8 scheduled today",
    icon: CalendarDays,
  },
  {
    title: "Placed Business",
    value: "34",
    change: "+12 issued",
    icon: TrendingUp,
  },
];

const pipeline = [
  {
    name: "Marcus Hill",
    product: "IUL • Mutual of Omaha",
    stage: "Application",
    percent: 72,
  },
  {
    name: "Sandra Lopez",
    product: "Annuity • Corebridge",
    stage: "Illustration Review",
    percent: 54,
  },
  {
    name: "David Brooks",
    product: "Mortgage Protection • Americo",
    stage: "Underwriting",
    percent: 88,
  },
  {
    name: "Tiana Carter",
    product: "Term • Transamerica",
    stage: "Follow Up",
    percent: 41,
  },
];

const activity = [
  {
    title: "Outbound call sequence completed",
    meta: "18 leads contacted in the last 2 hours",
    icon: PhoneCall,
  },
  {
    title: "Carrier case submitted",
    meta: "2 new apps sent to Mutual of Omaha",
    icon: FileCheck,
  },
  {
    title: "Production spike detected",
    meta: "Agency premium up 9.4% from prior week",
    icon: TrendingUp,
  },
];

export default function DashboardPage() {
  return (
    <div>
      <div className="grid-cards">
        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.title}
              className="glass-card"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
            >
              <div className="card-pad">
                <div className="stat-row">
                  <div>
                    <div className="stat-label">{item.title}</div>
                    <div className="stat-value">{item.value}</div>
                  </div>

                  <div className="stat-icon">
                    <Icon size={22} />
                  </div>
                </div>

                <div className="stat-change">{item.change}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="content-grid">
        <motion.div
          className="glass-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.22 }}
        >
          <div className="card-pad">
            <div className="panel-title">Pipeline Intelligence</div>

            <div className="pipeline-list">
              {pipeline.map((lead) => (
                <div key={lead.name} className="pipeline-item">
                  <div className="pipeline-top">
                    <div>
                      <div className="pipeline-name">{lead.name}</div>
                      <div className="pipeline-meta">{lead.product}</div>
                    </div>

                    <span className="tag">{lead.stage}</span>
                  </div>

                  <div className="progress-wrap">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${lead.percent}%` }}
                      />
                    </div>
                    <div className="pipeline-meta" style={{ marginTop: 8 }}>
                      Conversion progress: {lead.percent}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="glass-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.3 }}
        >
          <div className="card-pad">
            <div className="panel-title">Live Activity Feed</div>

            <div className="activity-list">
              {activity.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="activity-item">
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div className="stat-icon" style={{ width: 42, height: 42 }}>
                        <Icon size={18} />
                      </div>

                      <div>
                        <div className="pipeline-name">{item.title}</div>
                        <div className="activity-meta">{item.meta}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="section-spacing">
              <div className="panel-title" style={{ marginBottom: 12 }}>
                Agency Snapshot
              </div>

              <div className="pipeline-item">
                <div className="pipeline-name">Top Focus</div>
                <div className="pipeline-meta">
                  Increase app-to-issued conversion and build a stronger carrier workflow.
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}