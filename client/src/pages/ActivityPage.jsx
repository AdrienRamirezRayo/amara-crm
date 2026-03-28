import { useEffect, useState } from "react";
import { fetchLeadActivity } from "../services/activity";

export default function ActivityPage() {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivity();
  }, []);

  async function loadActivity() {
    setLoading(true);
    const { data, error } = await fetchLeadActivity();

    if (!error && Array.isArray(data)) {
      setActivity(data);
    }

    setLoading(false);
  }

  if (loading) {
    return <div>Loading activity...</div>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Lead Activity</h2>

      <div style={{ display: "grid", gap: 12 }}>
        {activity.map((item) => (
          <div
            key={item.id}
            style={{
              padding: 14,
              borderRadius: 12,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div style={{ fontWeight: 800 }}>{item.action}</div>
            <div style={{ opacity: 0.85, marginTop: 6 }}>{item.detail}</div>
            <div style={{ opacity: 0.6, marginTop: 8, fontSize: 13 }}>
              {new Date(item.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}