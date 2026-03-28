import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search,
  Phone,
  DollarSign,
  UserRound,
  CalendarClock,
  BadgeCheck,
  TrendingUp,
} from "lucide-react";

import ProgressRingCard from "../components/ProgressRingCard";

function getStageClass(stage) {
  const normalized = stage.toLowerCase();

  if (normalized.includes("new")) return "stage-new";
  if (normalized.includes("quote")) return "stage-quoted";
  if (normalized.includes("application")) return "stage-application";
  if (normalized.includes("underwriting")) return "stage-underwriting";
  if (normalized.includes("follow")) return "stage-followup";
  return "stage-default";
}

export default function LeadsPage({ leads, onOpenLead }) {
  const [query, setQuery] = useState("");

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const text =
        `${lead.name} ${lead.phone} ${lead.product} ${lead.carrier} ${lead.stage} ${lead.agent}`.toLowerCase();

      return text.includes(query.toLowerCase());
    });
  }, [query, leads]);

  const followUps = leads.filter((l) => l.stage === "Follow Up").length;
  const quoted = leads.filter((l) => l.stage === "Quoted").length;
  const closing = leads.filter(
    (l) => l.stage === "Application" || l.stage === "Underwriting"
  ).length;

  return (
    <div>
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Lead Engine</h1>
          <p className="page-subtitle">
            Manage prospects, track movement, and push deals through your pipeline.
          </p>
        </div>
      </div>

      {/* SEARCH */}
      <div className="glass-card" style={{ marginBottom: 18 }}>
        <div className="card-pad">
          <div className="search-bar" style={{ display: "flex", gap: 10 }}>
            <Search size={18} />
            <input
              type="text"
              placeholder="Search leads..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "white",
                width: "100%",
              }}
            />
          </div>
        </div>
      </div>

      {/* RINGS (NEW 🔥) */}
      <div className="glass-card" style={{ marginBottom: 18 }}>
        <div className="card-pad">
          <div className="panel-title" style={{ marginBottom: 16 }}>
            Lead Performance
          </div>

          <div className="ring-grid">
            <ProgressRingCard
              label="Follow Ups"
              value={followUps}
              max={leads.length}
              subtext="Leads needing action"
            />
            <ProgressRingCard
              label="Quoted"
              value={quoted}
              max={leads.length}
              subtext="Warm opportunities"
            />
            <ProgressRingCard
              label="Closing Stage"
              value={closing}
              max={leads.length}
              subtext="Near conversion"
            />
            <ProgressRingCard
              label="Pipeline Size"
              value={leads.length}
              max={50}
              subtext="Total active leads"
            />
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid-cards" style={{ marginBottom: 18 }}>
        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">Visible Leads</div>
            <div className="stat-value">{leads.length}</div>
            <div className="stat-change">Role-filtered lead count</div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">Pending Follow Ups</div>
            <div className="stat-value">{followUps}</div>
            <div className="stat-change">Needs immediate action</div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">Quoted Cases</div>
            <div className="stat-value">{quoted}</div>
            <div className="stat-change">Warm pipeline</div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">Closing Deals</div>
            <div className="stat-value">{closing}</div>
            <div className="stat-change">Near submission</div>
          </div>
        </div>
      </div>

      {/* LEAD CARDS */}
      <div className="grid-cards">
        {filteredLeads.map((lead, index) => (
          <motion.div
            key={lead.id}
            className="glass-card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.04 }}
          >
            <div className="card-pad">
              <div className="pipeline-top">
                <div>
                  <div className="pipeline-name">{lead.name}</div>
                  <div className="pipeline-meta">
                    {lead.product} • {lead.carrier}
                  </div>
                </div>

                <span className={`tag ${getStageClass(lead.stage)}`}>
                  {lead.stage}
                </span>
              </div>

              <div className="section-spacing" style={{ display: "grid", gap: 10 }}>
                <div className="carrier-meta" style={{ display: "flex", gap: 8 }}>
                  <Phone size={15} />
                  {lead.phone}
                </div>

                <div className="carrier-meta" style={{ display: "flex", gap: 8 }}>
                  <DollarSign size={15} />
                  {lead.premium}
                </div>

                <div className="carrier-meta" style={{ display: "flex", gap: 8 }}>
                  <UserRound size={15} />
                  {lead.agent}
                </div>

                <div className="carrier-meta" style={{ display: "flex", gap: 8 }}>
                  <CalendarClock size={15} />
                  {lead.followUp}
                </div>
              </div>

              <div className="section-spacing" style={{ display: "flex", gap: 10 }}>
                <Link to={`/leads/${lead.id}`} className="small-btn">
                  <BadgeCheck size={16} />
                  Open
                </Link>

                <button className="small-btn" onClick={() => onOpenLead(lead)}>
                  Quick View
                </button>

                <button className="small-btn">
                  <TrendingUp size={16} />
                  Notes
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}