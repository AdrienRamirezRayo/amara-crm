import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bone,
  Rocket,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { boosterFairness } from "../data/crmData";

function randomCrashPoint() {
  const r = Math.random();

  if (r < 0.35) return 1.05 + Math.random() * 0.35;
  if (r < 0.62) return 1.4 + Math.random() * 0.6;
  if (r < 0.84) return 2.0 + Math.random() * 1.5;
  if (r < 0.95) return 3.5 + Math.random() * 3.5;
  return 7 + Math.random() * 13;
}

function formatMultiplier(value) {
  return `${value.toFixed(2)}x`;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function BoneBoosterPage({
  balance,
  onEarnDogBones,
  onSpendDogBones,
}) {
  const [bet, setBet] = useState(100);
  const [multiplier, setMultiplier] = useState(1.0);
  const [running, setRunning] = useState(false);
  const [crashed, setCrashed] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [showExplosion, setShowExplosion] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function resetRoundState() {
    setMultiplier(1.0);
    setRunning(false);
    setCrashed(false);
    setCashedOut(false);
    setLastResult(null);
    setShowExplosion(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function startRound() {
    if (running) return;
    if (bet < boosterFairness.minBet || bet > boosterFairness.maxBet) return;
    if (bet > balance) return;

    const success = onSpendDogBones(
      bet,
      "Bone Booster Bet",
      "Started Bone Booster round"
    );

    if (!success) return;

    const roundCrash = randomCrashPoint();

    setMultiplier(1.0);
    setRunning(true);
    setCrashed(false);
    setCashedOut(false);
    setLastResult(null);
    setShowExplosion(false);

    timerRef.current = setInterval(() => {
      setMultiplier((prev) => {
        const next = prev + Math.max(0.02, prev * 0.018);

        if (next >= roundCrash) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          setRunning(false);
          setCrashed(true);
          setShowExplosion(true);

          setTimeout(() => {
            setShowExplosion(false);
          }, 900);

          setLastResult({
            type: "crash",
            bet,
            crashAt: roundCrash,
          });

          setHistory((prevHistory) =>
            [
              {
                id: Date.now(),
                type: "Crash",
                bet,
                result: `- ${bet} bones`,
                crashAt: roundCrash,
              },
              ...prevHistory,
            ].slice(0, 10)
          );

          return roundCrash;
        }

        return next;
      });
    }, 90);
  }

  function cashOut() {
    if (!running || cashedOut) return;

    clearInterval(timerRef.current);
    timerRef.current = null;

    const winnings = Math.round(bet * multiplier);

    setRunning(false);
    setCashedOut(true);

    onEarnDogBones(
      winnings,
      "Bone Booster Cash Out",
      `Cashed out at ${multiplier.toFixed(2)}x`
    );

    setLastResult({
      type: "cashout",
      bet,
      payout: winnings,
      at: multiplier,
    });

    setHistory((prevHistory) =>
      [
        {
          id: Date.now(),
          type: "Cash Out",
          bet,
          result: `+ ${winnings} bones`,
          crashAt: multiplier,
        },
        ...prevHistory,
      ].slice(0, 10)
    );
  }

  function quickBet(amount) {
    if (running) return;
    setBet(amount);
  }

  const pressure = Math.min(Math.round((multiplier / 5) * 100), 100);
  const rocketX = clamp((multiplier - 1) * 18, 0, 78);
  const rocketY = clamp((multiplier - 1) * 14, 0, 62);

  return (
    <div>
      <div className="dashboard-hero-grid bonebooster-top-grid" style={{ marginBottom: 18 }}>
        <motion.div
          className="glass-card neon-card crazy-gradient-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="card-pad">
            <div className="panel-title">Bone Booster</div>
            <div className="carrier-meta">
              Fair crash-style Dog Bones game. One cash-out. No hidden rigging.
            </div>

            <div
              className={`booster-flight-zone ${running ? "live" : ""} ${crashed ? "crashed" : ""} ${
                cashedOut ? "cashed" : ""
              }`}
            >
              <div className="booster-grid-lines" />

              <div className="booster-stars">
                <span className="star s1" />
                <span className="star s2" />
                <span className="star s3" />
                <span className="star s4" />
                <span className="star s5" />
              </div>

              <div className="booster-curve">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="booster-svg">
                  <defs>
                    <linearGradient id="boosterLine" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(139,92,246,0.18)" />
                      <stop offset="50%" stopColor="rgba(34,197,94,0.7)" />
                      <stop offset="100%" stopColor="rgba(96,165,250,0.9)" />
                    </linearGradient>
                  </defs>

                  <path
                    d="M 4 92 Q 28 88 42 74 T 70 42 T 96 8"
                    className="booster-path"
                  />
                </svg>
              </div>

              <motion.div
                className={`rocket-marker ${running ? "live" : ""} ${crashed ? "crash" : ""} ${
                  cashedOut ? "cashed" : ""
                }`}
                animate={{
                  left: `${rocketX}%`,
                  bottom: `${rocketY}%`,
                  rotate: crashed ? -38 : -12,
                  scale: crashed ? 0.92 : cashedOut ? 1.06 : 1,
                }}
                transition={{ type: "spring", stiffness: 90, damping: 18 }}
              >
                <div className="rocket-glow" />
                {running && <div className="rocket-flame flame-main" />}
                {running && <div className="rocket-flame flame-small" />}
                <Rocket size={36} />
              </motion.div>

              <AnimatePresence>
                {showExplosion && (
                  <motion.div
                    className="crash-burst"
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1.2 }}
                    exit={{ opacity: 0, scale: 1.8 }}
                    transition={{ duration: 0.55 }}
                    style={{
                      left: `${rocketX}%`,
                      bottom: `${rocketY}%`,
                    }}
                  >
                    <span className="burst-ring" />
                    <span className="burst-core" />
                    <span className="burst-particle p1" />
                    <span className="burst-particle p2" />
                    <span className="burst-particle p3" />
                    <span className="burst-particle p4" />
                    <span className="burst-particle p5" />
                    <span className="burst-particle p6" />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="booster-multiplier-wrap">
                <div
                  className={`booster-multiplier ${running ? "live" : ""} ${crashed ? "crash" : ""} ${
                    cashedOut ? "cashout" : ""
                  }`}
                >
                  {formatMultiplier(multiplier)}
                </div>
                <div className="carrier-meta">
                  {running
                    ? "Rocket is live"
                    : crashed
                    ? `Crashed at ${formatMultiplier(multiplier)}`
                    : cashedOut
                    ? `Cashed out at ${formatMultiplier(multiplier)}`
                    : "Ready for next launch"}
                </div>
              </div>
            </div>

            <div className="soft-stat-row" style={{ marginTop: 14 }}>
              <span className="soft-badge">Min Bet: {boosterFairness.minBet}</span>
              <span className="soft-badge">Max Bet: {boosterFairness.maxBet}</span>
              <span className="soft-badge">Balance: {balance}</span>
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
            <div className="panel-title">Round Controls</div>

            <div className="modal-form">
              <input
                type="number"
                min={boosterFairness.minBet}
                max={Math.min(boosterFairness.maxBet, balance)}
                value={bet}
                onChange={(e) => setBet(Number(e.target.value || 0))}
                disabled={running}
              />
            </div>

            <div className="stage-action-grid" style={{ marginTop: 16 }}>
              {[25, 50, 100, 250, 500].map((amount) => (
                <button
                  key={amount}
                  className={`small-btn ${bet === amount ? "coach-active" : ""}`}
                  onClick={() => quickBet(amount)}
                  disabled={running || amount > balance}
                >
                  {amount}
                </button>
              ))}
            </div>

            <div className="carrier-card-actions" style={{ marginTop: 18 }}>
              <button
                className="primary-btn primary-btn-purple"
                onClick={startRound}
                disabled={running || bet < boosterFairness.minBet || bet > balance}
              >
                <Bone size={15} />
                Start Round
              </button>

              <button
                className="small-btn"
                onClick={cashOut}
                disabled={!running || cashedOut}
              >
                <TrendingUp size={15} />
                Cash Out
              </button>

              <button className="small-btn" onClick={resetRoundState} disabled={running}>
                Reset
              </button>
            </div>

            <div className="grid-cards bonebooster-mini-grid" style={{ marginTop: 18 }}>
              <div className="glass-card inner-glow-card">
                <div className="card-pad">
                  <div className="stat-label">Balance</div>
                  <div className="stat-value" style={{ fontSize: "1.2rem" }}>{balance}</div>
                </div>
              </div>

              <div className="glass-card inner-glow-card">
                <div className="card-pad">
                  <div className="stat-label">Current Bet</div>
                  <div className="stat-value" style={{ fontSize: "1.2rem" }}>{bet}</div>
                </div>
              </div>

              <div className="glass-card inner-glow-card">
                <div className="card-pad">
                  <div className="stat-label">Pressure</div>
                  <div className="stat-value" style={{ fontSize: "1.2rem" }}>{pressure}%</div>
                </div>
              </div>

              <div className="glass-card inner-glow-card">
                <div className="card-pad">
                  <div className="stat-label">Last Result</div>
                  <div className="stat-value" style={{ fontSize: "1rem" }}>
                    {lastResult?.type === "cashout"
                      ? `+${lastResult.payout}`
                      : lastResult?.type === "crash"
                      ? `-${lastResult.bet}`
                      : "—"}
                  </div>
                </div>
              </div>
            </div>

            <div className="section-spacing">
              <div className="dashboard-signal-list">
                <div className="dashboard-signal-card">
                  <div className="dashboard-signal-icon">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <div className="pipeline-name">Transparent Odds</div>
                    <div className="carrier-meta">
                      Crash point is randomly generated. No hidden house rigging.
                    </div>
                  </div>
                </div>

                <div className="dashboard-signal-card">
                  <div className="dashboard-signal-icon">
                    <AlertTriangle size={18} />
                  </div>
                  <div>
                    <div className="pipeline-name">Risk</div>
                    <div className="carrier-meta">
                      Waiting longer can pay more, but crash risk rises fast.
                    </div>
                  </div>
                </div>

                <div className="dashboard-signal-card">
                  <div className="dashboard-signal-icon">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <div className="pipeline-name">Fairness Note</div>
                    <div className="carrier-meta">{boosterFairness.note}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="glass-card neon-card"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
      >
        <div className="card-pad">
          <div className="panel-title">Recent Rounds</div>

          <div className="leaderboard-list">
            {history.length > 0 ? (
              history.map((item) => (
                <div key={item.id} className="glass-card inner-glow-card">
                  <div className="card-pad">
                    <div className="task-row">
                      <div>
                        <div className="carrier-name">{item.type}</div>
                        <div className="carrier-meta">
                          Bet: {item.bet} • Exit / Crash: {formatMultiplier(item.crashAt)}
                        </div>
                      </div>

                      <div className="task-badges">
                        <span className={`tag ${item.type === "Cash Out" ? "status-open" : "priority-high"}`}>
                          {item.result}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="glass-card inner-glow-card">
                <div className="card-pad">
                  <div className="carrier-meta">No rounds played yet.</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}