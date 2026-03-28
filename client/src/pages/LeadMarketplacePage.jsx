import { motion } from "framer-motion";
import { leadMarketplace } from "../data/crmData";
import {
  ShoppingCart,
  Bone,
  Sparkles,
  ShieldCheck,
  BadgeDollarSign,
  Package,
} from "lucide-react";
import StatRing from "../components/StatRing";

function getQualityClass(quality) {
  if (quality >= 80) return "status-open";
  if (quality >= 65) return "priority-medium";
  return "priority-low";
}

export default function LeadMarketplacePage({ balance, onSpendDogBones }) {
  function buyWithBones(pack) {
    onSpendDogBones(
      pack.priceBones,
      `Lead Pack Purchase: ${pack.title}`,
      `Bought ${pack.quantity} ${pack.category} leads`
    );
  }

  return (
    <div>
      <div className="dashboard-hero-grid" style={{ marginBottom: 18 }}>
        <motion.div
          className="glass-card neon-card game-hero-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="card-pad dashboard-ring-card">
            <StatRing
              value={Math.min(Math.round((balance / 1500) * 100), 100)}
              label="Buying Power"
              sublabel={`${balance} Dog Bones`}
            />
            <div className="dashboard-ring-side">
              <div className="panel-title">Lead Marketplace</div>
              <div className="carrier-meta">
                Buy leads using Dog Bones or dollars and create a real in-platform reward economy.
              </div>
              <div className="soft-stat-row">
                <span className="soft-badge">Wallet: {balance}</span>
                <span className="soft-badge">{leadMarketplace.length} Packs</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="glass-card neon-card pulse-game-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="card-pad">
            <div className="panel-title">Marketplace Rules</div>

            <div className="dashboard-signal-list" style={{ marginTop: 14 }}>
              <div className="dashboard-signal-card">
                <div className="dashboard-signal-icon">
                  <Bone size={18} />
                </div>
                <div>
                  <div className="pipeline-name">Dog Bones Accepted</div>
                  <div className="carrier-meta">
                    Use in-game currency earned through production and contests.
                  </div>
                </div>
              </div>

              <div className="dashboard-signal-card">
                <div className="dashboard-signal-icon">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <div className="pipeline-name">Lead Value</div>
                  <div className="carrier-meta">
                    Fresh, warm, aged, and review leads can be priced differently.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="carrier-grid marketplace-grid">
        {leadMarketplace.map((pack, index) => (
          <motion.div
            key={pack.id}
            className="glass-card neon-card marketplace-card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: index * 0.04 }}
            whileHover={{ y: -6 }}
          >
            <div className="card-pad">
              <div className="dashboard-ring-card">
                <StatRing
                  value={pack.quality}
                  size={78}
                  stroke={8}
                  label="Lead Quality"
                  sublabel={pack.type}
                />

                <div className="dashboard-ring-side">
                  <div className="task-row">
                    <div>
                      <div className="carrier-name">{pack.title}</div>
                      <div className="carrier-meta">
                        {pack.category} • {pack.quantity} leads
                      </div>
                    </div>

                    <div className="task-badges">
                      <span className={`tag ${getQualityClass(pack.quality)}`}>{pack.quality}%</span>
                      <span className="tag">{pack.exclusive ? "Exclusive" : "Shared"}</span>
                    </div>
                  </div>

                  <div className="grid-cards marketplace-mini-grid" style={{ marginTop: 16 }}>
                    <div className="glass-card inner-glow-card">
                      <div className="card-pad">
                        <div className="stat-label">USD</div>
                        <div className="stat-value" style={{ fontSize: "1.1rem" }}>
                          ${pack.priceUsd}
                        </div>
                      </div>
                    </div>

                    <div className="glass-card inner-glow-card">
                      <div className="card-pad">
                        <div className="stat-label">Dog Bones</div>
                        <div className="stat-value" style={{ fontSize: "1.1rem" }}>
                          {pack.priceBones}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="section-spacing">
                    <div className="dashboard-signal-list">
                      <div className="dashboard-signal-card">
                        <div className="dashboard-signal-icon">
                          <Package size={18} />
                        </div>
                        <div>
                          <div className="pipeline-name">Lead Pack Type</div>
                          <div className="carrier-meta">
                            {pack.type} pack for agents looking for {pack.category.toLowerCase()} business.
                          </div>
                        </div>
                      </div>

                      <div className="dashboard-signal-card">
                        <div className="dashboard-signal-icon">
                          <BadgeDollarSign size={18} />
                        </div>
                        <div>
                          <div className="pipeline-name">Buy Logic</div>
                          <div className="carrier-meta">
                            Agents can buy leads with cash or redeem Dog Bones earned through performance.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="carrier-card-actions">
                    <button
                      className="primary-btn primary-btn-purple"
                      onClick={() => buyWithBones(pack)}
                      disabled={balance < pack.priceBones}
                    >
                      <ShoppingCart size={15} />
                      Buy With Dog Bones
                    </button>
                    <button className="small-btn">Buy With USD</button>
                    <button className="small-btn">
                      <Sparkles size={15} />
                      Preview Pack
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}