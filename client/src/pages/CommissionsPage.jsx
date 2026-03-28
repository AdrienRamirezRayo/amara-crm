import { motion } from "framer-motion";
import { commissions } from "../data/crmData";
import { DollarSign, UserRound, Building2 } from "lucide-react";

export default function CommissionsPage() {
  return (
    <div>
      <div className="grid-cards" style={{ marginBottom: "18px" }}>
        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">Paid This Month</div>
            <div className="stat-value">$6,240</div>
            <div className="stat-change">+11% from last month</div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">Pending</div>
            <div className="stat-value">$1,710</div>
            <div className="stat-change">Awaiting release</div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">Top Agent</div>
            <div className="stat-value">Adrien</div>
            <div className="stat-change">Highest current production</div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-label">Cases Paid</div>
            <div className="stat-value">18</div>
            <div className="stat-change">This cycle</div>
          </div>
        </div>
      </div>

      <div className="carrier-grid">
        {commissions.map((item, index) => (
          <motion.div
            key={item.id}
            className="glass-card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div className="card-pad">
              <div className="carrier-top">
                <div>
                  <div className="carrier-name">{item.client}</div>
                  <div className="carrier-meta">{item.amount}</div>
                </div>
                <span className="tag">{item.status}</span>
              </div>

              <div className="section-spacing" style={{ display: "grid", gap: 10 }}>
                <div className="carrier-meta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <UserRound size={15} />
                  Agent: {item.agent}
                </div>
                <div className="carrier-meta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Building2 size={15} />
                  Carrier: {item.carrier}
                </div>
                <div className="carrier-meta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <DollarSign size={15} />
                  Commission tracked
                </div>
              </div>

              <div className="carrier-card-actions">
                <button className="small-btn">Details</button>
                <button className="small-btn">Mark Paid</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}