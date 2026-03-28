export default function ProgressRingCard({
  label,
  value,
  max = 100,
  suffix = "%",
  subtext = "",
}) {
  const percent = Math.max(0, Math.min((value / max) * 100, 100));
  const degrees = Math.round((percent / 100) * 360);

  return (
    <div className="progress-ring-card">
      <div
        className="progress-ring"
        style={{ "--progress": degrees }}
      >
        <div className="progress-ring-value">
          {Math.round(percent)}
          {suffix}
        </div>
      </div>

      <div className="progress-ring-label">{label}</div>
      <div className="progress-ring-sub">{subtext}</div>
    </div>
  );
}