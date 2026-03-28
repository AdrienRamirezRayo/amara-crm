import { motion } from "framer-motion";
import {
  recruitProducerMetrics,
  recruitingLeads,
} from "../data/crmData";
import {
  Rocket,
  CalendarCheck2,
  FileCheck,
  DollarSign,
  Brain,
  Trophy,
} from "lucide-react";

export default function RecruitProducerDashboardPage() {
  const trainingDone = recruitProducerMetrics.filter(
    (item) => item.firstTrainingCompleted
  ).length;

  const appointmentsBooked = recruitProducerMetrics.filter(
    (item) => item.firstAppointmentBooked
  ).length;

  const appsSubmitted = recruitProducerMetrics.filter(
    (item) => item.firstAppSubmitted
  ).length;

  const premiumsSubmitted = recruitProducerMetrics.filter(
    (item) => item.firstPremiumSubmitted
  ).length;

  const ranked = [...recruitProducerMetrics].sort(
    (a, b) => b.readinessScore - a.readinessScore
  );

  function getRecruitStatus(name) {
    return recruitingLeads.find((item) => item.fullName === name)?.status || "Unknown";
  }

  function getProgressCount(item) {
    let count = 0;
    if (item.firstTrainingCompleted) count += 1;
    if (item.firstAppointmentBooked) count += 1;
    if (item.firstAppSubmitted) count += 1;
    if (item.firstPremiumSubmitted) count += 1;
    return count;
  }

  return (
    <div>
      <div className="grid-cards recruiting-hero-grid" style={{ marginBottom: "18px" }}>
        <div className="glass-card neon-card">
          <div className="card-pad">
            <div className="stat-row">
              <div>
                <div className="stat-label">Training Done</div>
                <div className="stat-value">{trainingDone}</div>
              </div>
              <div className="stat-icon pulse-ring">
                <Brain size={22} />
              </div>
            </div>
            <div className="stat-change">Recruits who completed first training</div>
          </div>
        </div>

        <div className="glass-card neon-card">
          <div className="card-pad">
            <div className="stat-row">
              <div>
                <div className="stat-label">Appointments Booked</div>
                <div className="stat-value">{appointmentsBooked}</div>
              </div>
              <div className="stat-icon pulse-ring">
                <CalendarCheck2 size={22} />
              </div>
            </div>
            <div className="stat-change">Moved into real activity</div>
          </div>
        </div>

        <div className="glass-card neon-card">
          <div className="card-pad">
            <div className="stat-row">
              <div>
                <div className="stat-label">Apps Submitted</div>
                <div className="stat-value">{appsSubmitted}</div>
              </div>
              <div className="stat-icon pulse-ring">
                <FileCheck size={22} />
              </div>
            </div>
            <div className="stat-change">First application milestone</div>
          </div>
        </div>

        <div className="glass-card neon-card">
          <div className="card-pad">
            <div className="stat-row">
              <div>
                <div className="stat-label">Premium Submitted</div>
                <div className="stat-value">{premiumsSubmitted}</div>
              </div>
              <div className="stat-icon pulse-ring">
                <DollarSign size={22} />
              </div>
            </div>
            <div className="stat-change">Production activation milestone</div>
          </div>
        </div>
      </div>

      <motion.div
        className="glass-card neon-card"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
      >
        <div className="card-pad">
          <div className="panel-title">Recruit-to-Producer Ranking</div>

          <div className="leaderboard-list">
            {ranked.map((item, index) => {
              const progress = getProgressCount(item);
              const stageStatus = getRecruitStatus(item.recruit);

              return (
                <div key={item.id} className="glass-card inner-glow-card">
                  <div className="card-pad">
                    <div className="leaderboard-row">
                      <div className="leaderboard-left">
                        <div className="leaderboard-rank">#{index + 1}</div>
                        <div>
                          <div className="carrier-name">{item.recruit}</div>
                          <div className="carrier-meta">
                            Recruiting Stage: {stageStatus}
                          </div>
                        </div>
                      </div>

                      <span className="tag">
                        <Trophy size={14} style={{ marginRight: 6 }} />
                        {item.readinessScore} Readiness
                      </span>
                    </div>

                    <div className="section-spacing" style={{ display: "grid", gap: 10 }}>
                      <div className="carrier-meta">
                        First Training: {item.firstTrainingCompleted ? "Done" : "Pending"}
                      </div>
                      <div className="carrier-meta">
                        First Appointment: {item.firstAppointmentBooked ? "Booked" : "Pending"}
                      </div>
                      <div className="carrier-meta">
                        First App: {item.firstAppSubmitted ? "Submitted" : "Pending"}
                      </div>
                      <div className="carrier-meta">
                        First Premium: {item.firstPremiumSubmitted ? "Submitted" : "Pending"}
                      </div>
                    </div>

                    <div className="progress-wrap" style={{ marginTop: 14 }}>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${item.readinessScore}%` }}
                        />
                      </div>
                      <div className="pipeline-meta" style={{ marginTop: 8 }}>
                        Milestone completion: {progress}/4
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      <div className="section-spacing" />

      <motion.div
        className="glass-card neon-card"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, delay: 0.06 }}
      >
        <div className="card-pad">
          <div className="panel-title">Executive Read</div>

          <div className="activity-list">
            <div className="activity-item">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="stat-icon" style={{ width: 42, height: 42 }}>
                  <Rocket size={18} />
                </div>
                <div>
                  <div className="pipeline-name">Main Goal</div>
                  <div className="activity-meta">
                    Move recruits from activated to first submitted premium as fast as possible.
                  </div>
                </div>
              </div>
            </div>

            <div className="activity-item">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="stat-icon" style={{ width: 42, height: 42 }}>
                  <Brain size={18} />
                </div>
                <div>
                  <div className="pipeline-name">Best Lever</div>
                  <div className="activity-meta">
                    Tighten training plus appointment booking speed to raise readiness scores.
                  </div>
                </div>
              </div>
            </div>

            <div className="activity-item">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="stat-icon" style={{ width: 42, height: 42 }}>
                  <DollarSign size={18} />
                </div>
                <div>
                  <div className="pipeline-name">Revenue Link</div>
                  <div className="activity-meta">
                    The real win is not just recruiting volume — it is producer activation speed.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}