import { motion } from "framer-motion";
import { illustrations } from "../data/crmData";
import { FileText, DollarSign } from "lucide-react";

export default function IllustrationsPage() {
  return (
    <div className="carrier-grid">
      {illustrations.map((item, index) => (
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
                <div className="carrier-meta">
                  {item.product} • {item.carrier}
                </div>
              </div>
              <span className="tag">{item.status}</span>
            </div>

            <div className="section-spacing" style={{ display: "grid", gap: 10 }}>
              <div className="carrier-meta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FileText size={15} />
                Illustration packet ready
              </div>
              <div className="carrier-meta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <DollarSign size={15} />
                Premium: {item.premium}
              </div>
            </div>

            <div className="carrier-card-actions">
              <button className="small-btn">Open</button>
              <button className="small-btn">Send</button>
              <button className="small-btn">Revise</button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}