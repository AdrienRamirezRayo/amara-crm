import { motion } from "framer-motion";
import {
  Activity,
  DollarSign,
  CalendarDays,
  Target,
  TrendingUp,
  CircleCheckBig,
} from "lucide-react";
import ProgressRingCard from "../components/ProgressRingCard";
import { initialLeads, appointments, commissions, tasks } from "../data/crmData";

export default function DashboardPage() {
  const totalLeads = initialLeads.length;
  const activeAppointments = appointments.length;
  const pendingCommissions = commissions.filter((item) => item.status === "Pending").length;
  const openTasks = tasks.filter((item) => item.status === "Open").length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            See your agency health, momentum, team movement, and production at a glance.
          </p>
        </div>

        <button className="small-btn">View Weekly Focus</button>
      </div>

      <div className="grid-cards" style={{ marginBottom: 18 }}>
        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-icon"><Activity size={18} /></div>
            <div className="section-spacing" />
            <div className="stat-label">Total Leads</div>
            <div className="stat-value">{totalLeads}</div>
            <div className="stat-change">Live opportunities in your pipeline</div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-icon"><CalendarDays size={18} /></div>
            <div className="section-spacing" />
            <div className="stat-label">Appointments</div>
            <div className="stat-value">{activeAppointments}</div>
            <div className="stat-change">Upcoming booked conversations</div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-icon"><DollarSign size={18} /></div>
            <div className="section-spacing" />
            <div className="stat-label">Pending Commissions</div>
            <div className="stat-value">{pendingCommissions}</div>
            <div className="stat-change">Cases waiting to pay out</div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-icon"><Target size={18} /></div>
            <div className="section-spacing" />
            <div className="stat-label">Open Tasks</div>
            <div className="stat-value">{openTasks}</div>
            <div className="stat-change">Action items still in motion</div>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: 18 }}>
        <div className="card-pad">
          <div className="panel-title" style={{ marginBottom: 16 }}>Performance Rings</div>

          <div className="ring-grid">
            <ProgressRingCard
              label="Lead Conversion"
              value={68}
              subtext="Strong recent close momentum"
            />
            <ProgressRingCard
              label="Appointment Show Rate"
              value={81}
              subtext="Booked calls are holding well"
            />
            <ProgressRingCard
              label="Task Completion"
              value={74}
              subtext="Most daily actions are moving"
            />
            <ProgressRingCard
              label="Pipeline Health"
              value={77}
              subtext="Flow is active across stages"
            />
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
            <div className="panel-title">Agency Focus</div>
            <div className="notes-list section-spacing">
              <div className="note-card">
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <TrendingUp size={16} />
                  <div className="carrier-meta">
                    Prioritize leads already in Illustration Review, Quoted, and Application.
                  </div>
                </div>
              </div>

              <div className="note-card">
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <CircleCheckBig size={16} />
                  <div className="carrier-meta">
                    Clear overdue follow-ups first so warm leads do not go cold.
                  </div>
                </div>
              </div>
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
            <div className="panel-title">Quick Snapshot</div>

            <div className="pipeline-list section-spacing">
              {initialLeads.slice(0, 4).map((lead) => (
                <div key={lead.id} className="pipeline-item">
                  <div className="pipeline-top">
                    <div>
                      <div className="pipeline-name">{lead.name}</div>
                      <div className="pipeline-meta">
                        {lead.product} • {lead.carrier}
                      </div>
                    </div>
                    <span className="tag green">{lead.stage}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}