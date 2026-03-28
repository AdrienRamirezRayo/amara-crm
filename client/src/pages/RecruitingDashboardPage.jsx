import { motion } from "framer-motion";
import { recruitingLeads, agents } from "../data/crmData";
import {
  UsersRound,
  Rocket,
  Funnel,
  Trophy,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import StatRing from "../components/StatRing";

const recruitingStages = [
  "New",
  "Contacted",
  "Screening",
  "Interview",
  "Contracting",
  "Activated",
];

export default function RecruitingDashboardPage() {
  const totalRecruits = recruitingLeads.length;
  const activatedCount = recruitingLeads.filter((item) => item.status === "Activated").length;
  const contractingCount = recruitingLeads.filter((item) => item.status === "Contracting").length;
  const interviewCount = recruitingLeads.filter((item) => item.status === "Interview").length;

  const stageCounts = recruitingStages.map((stage) => ({
    stage,
    count: recruitingLeads.filter((item) => item.status === stage).length,
  }));

  const topRecruiters = agents
    .map((agent) => {
      const submitted = recruitingLeads.filter(
        (entry) => entry.submittedBy === agent.name
      ).length;

      return {
        name: agent.name,
        role: agent.role,
        submitted,
      };
    })
    .sort((a, b) => b.submitted - a.submitted);

  const activationRate = totalRecruits
    ? Math.round((activatedCount / totalRecruits) * 100)
    : 0;

  return (
    <div>
      <div className="dashboard-hero-grid" style={{ marginBottom: 18 }}>
        <div className="glass-card neon-card">
          <div className="card-pad dashboard-ring-card">
            <StatRing value={activationRate} label="Activation Rate" sublabel={`${activatedCount}/${totalRecruits} activated`} />
            <div className="dashboard-ring-side">
              <div className="panel-title">Recruiting Efficiency</div>
              <div className="carrier-meta">
                Recruiting only matters if people become active producers.
              </div>
              <div className="soft-stat-row">
                <span className="soft-badge">Interview: {interviewCount}</span>
                <span className="soft-badge">Contracting: {contractingCount}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card neon-card">
          <div className="card-pad dashboard-ring-card">
            <StatRing value={Math.min(totalRecruits * 10, 100)} label="Recruiting Volume" sublabel={`${totalRecruits} total entries`} />
            <div className="dashboard-ring-side">
              <div className="panel-title">Growth Pipeline</div>
              <div className="carrier-meta">
                Keep pipeline movement sharp so volume does not turn into clutter.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-cards" style={{ marginBottom: 18 }}>
        <div className="glass-card neon-card">
          <div className="card-pad">
            <div className="stat-row">
              <div>
                <div className="stat-label">Total Recruiting Pipeline</div>
                <div className="stat-value">{totalRecruits}</div>
              </div>
              <div className="stat-icon pulse-ring">
                <UsersRound size={22} />
              </div>
            </div>
            <div className="stat-change">All active recruiting entries</div>
          </div>
        </div>

        <div className="glass-card neon-card">
          <div className="card-pad">
            <div className="stat-row">
              <div>
                <div className="stat-label">Activated</div>
                <div className="stat-value">{activatedCount}</div>
              </div>
              <div className="stat-icon pulse-ring">
                <Rocket size={22} />
              </div>
            </div>
            <div className="stat-change">Moved fully into production</div>
          </div>
        </div>

        <div className="glass-card neon-card">
          <div className="card-pad">
            <div className="stat-row">
              <div>
                <div className="stat-label">Contracting</div>
                <div className="stat-value">{contractingCount}</div>
              </div>
              <div className="stat-icon pulse-ring">
                <ShieldCheck size={22} />
              </div>
            </div>
            <div className="stat-change">Paperwork / activation pressure</div>
          </div>
        </div>

        <div className="glass-card neon-card">
          <div className="card-pad">
            <div className="stat-row">
              <div>
                <div className="stat-label">Interview Queue</div>
                <div className="stat-value">{interviewCount}</div>
              </div>
              <div className="stat-icon pulse-ring">
                <Funnel size={22} />
              </div>
            </div>
            <div className="stat-change">Candidates waiting on movement</div>
          </div>
        </div>
      </div>

      <div className="content-grid">
        <motion.div className="glass-card neon-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card-pad">
            <div className="panel-title">Recruiting Flow Matrix</div>

            <div className="leaderboard-list">
              {stageCounts.map((item) => (
                <div key={item.stage} className="glass-card inner-glow-card">
                  <div className="card-pad dashboard-ring-card">
                    <StatRing
                      value={totalRecruits ? Math.round((item.count / totalRecruits) * 100) : 0}
                      size={78}
                      stroke={8}
                      label={item.stage}
                      sublabel={`${item.count} in stage`}
                    />
                    <div className="dashboard-ring-side">
                      <div className="pipeline-name">{item.stage}</div>
                      <div className="carrier-meta">
                        Current count in this recruiting stage.
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div className="glass-card neon-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
          <div className="card-pad">
            <div className="panel-title">Top Recruiting Agents</div>

            <div className="leaderboard-list">
              {topRecruiters.map((recruiter, index) => (
                <div key={recruiter.name} className="glass-card inner-glow-card">
                  <div className="card-pad">
                    <div className="leaderboard-row">
                      <div className="leaderboard-left">
                        <div className="leaderboard-rank">#{index + 1}</div>
                        <div>
                          <div className="carrier-name">{recruiter.name}</div>
                          <div className="carrier-meta">{recruiter.role}</div>
                        </div>
                      </div>

                      <span className="tag">
                        <Trophy size={14} style={{ marginRight: 6 }} />
                        {recruiter.submitted} Submitted
                      </span>
                    </div>

                    <div style={{ marginTop: 14 }}>
                      <StatRing
                        value={Math.min(recruiter.submitted * 25, 100)}
                        size={72}
                        stroke={8}
                        label="Recruiting Push"
                        sublabel={`${recruiter.submitted} entries`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="section-spacing">
              <div className="coach-card">
                <div className="coach-label">Executive Read</div>
                <div className="carrier-meta">
                  The growth unlock is reducing stall time between interview, contracting, and activation.
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}