import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Bone,
  Bomb,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Grid3X3,
} from "lucide-react";
import { minesGameConfig } from "../data/crmData";

function createBoard(mineCount) {
  const total = minesGameConfig.boardSize;
  const mineIndexes = new Set();

  while (mineIndexes.size < mineCount) {
    mineIndexes.add(Math.floor(Math.random() * total));
  }

  return Array.from({ length: total }, (_, index) => ({
    id: index,
    revealed: false,
    isMine: mineIndexes.has(index),
  }));
}

function calcMultiplier(safePicks, mineCount) {
  const riskFactor = 1 + mineCount / 12;
  const growth = Math.pow(1.12 + mineCount * 0.01, safePicks);
  return Math.max(1, Number((growth * riskFactor).toFixed(2)));
}

export default function BoneMinesPage({
  balance,
  onEarnDogBones,
  onSpendDogBones,
}) {
  const [bet, setBet] = useState(100);
  const [mineCount, setMineCount] = useState(5);
  const [board, setBoard] = useState([]);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [safePicks, setSafePicks] = useState(0);
  const [history, setHistory] = useState([]);

  const multiplier = useMemo(
    () => calcMultiplier(safePicks, mineCount),
    [safePicks, mineCount]
  );

  function startGame() {
    if (running) return;
    if (bet < minesGameConfig.minBet || bet > minesGameConfig.maxBet) return;
    if (bet > balance) return;

    const success = onSpendDogBones(
      bet,
      "Bone Mines Bet",
      "Started Bone Mines round"
    );

    if (!success) return;

    setBoard(createBoard(mineCount));
    setRunning(true);
    setGameOver(false);
    setWon(false);
    setSafePicks(0);
  }

  function revealTile(id) {
    if (!running || gameOver) return;

    const target = board.find((tile) => tile.id === id);
    if (!target || target.revealed) return;

    const updated = board.map((tile) =>
      tile.id === id ? { ...tile, revealed: true } : tile
    );

    setBoard(updated);

    if (target.isMine) {
      const fullyRevealed = updated.map((tile) => ({ ...tile, revealed: true }));
      setBoard(fullyRevealed);
      setRunning(false);
      setGameOver(true);
      setWon(false);

      setHistory((prev) =>
        [
          {
            id: Date.now(),
            type: "Loss",
            result: `-${bet} bones`,
            safePicks,
            mineCount,
          },
          ...prev,
        ].slice(0, 10)
      );

      return;
    }

    const nextSafePicks = safePicks + 1;
    setSafePicks(nextSafePicks);

    const totalSafeTiles = minesGameConfig.boardSize - mineCount;
    if (nextSafePicks >= totalSafeTiles) {
      const payout = Math.round(bet * calcMultiplier(nextSafePicks, mineCount));

      onEarnDogBones(
        payout,
        "Bone Mines Perfect Clear",
        `Cleared the board with ${mineCount} mines`
      );

      setRunning(false);
      setGameOver(true);
      setWon(true);

      setHistory((prev) =>
        [
          {
            id: Date.now(),
            type: "Perfect Clear",
            result: `+${payout} bones`,
            safePicks: nextSafePicks,
            mineCount,
          },
          ...prev,
        ].slice(0, 10)
      );
    }
  }

  function cashOut() {
    if (!running || safePicks === 0) return;

    const payout = Math.round(bet * multiplier);

    onEarnDogBones(
      payout,
      "Bone Mines Cash Out",
      `Cashed out after ${safePicks} safe picks`
    );

    setRunning(false);
    setGameOver(true);
    setWon(true);

    const fullyRevealed = board.map((tile) => ({
      ...tile,
      revealed: tile.revealed || !tile.isMine,
    }));
    setBoard(fullyRevealed);

    setHistory((prev) =>
      [
        {
          id: Date.now(),
          type: "Cash Out",
          result: `+${payout} bones`,
          safePicks,
          mineCount,
        },
        ...prev,
      ].slice(0, 10)
    );
  }

  function resetGame() {
    setBoard([]);
    setRunning(false);
    setGameOver(false);
    setWon(false);
    setSafePicks(0);
  }

  return (
    <div className="bone-mines-page">
      <div className="content-grid bone-mines-layout">
        <motion.div
          className="glass-card neon-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="card-pad">
            <div className="panel-title">Bone Mines</div>
            <div className="carrier-meta">
              Reveal safe tiles, avoid mines, and cash out before you blow up.
            </div>

            <div className="soft-stat-row" style={{ marginTop: 16 }}>
              <span className="soft-badge">Balance: {balance}</span>
              <span className="soft-badge">Mines: {mineCount}</span>
              <span className="soft-badge">Safe Picks: {safePicks}</span>
              <span className="soft-badge">Multiplier: {multiplier.toFixed(2)}x</span>
            </div>

            <div className="section-spacing">
              <div className="mines-grid compact">
                {Array.isArray(board) && board.length > 0 ? (
                  board.map((tile) => (
                    <button
                      key={tile.id}
                      type="button"
                      className={`mines-tile ${tile.revealed ? "revealed" : ""} ${
                        tile.revealed && tile.isMine ? "mine" : ""
                      } ${tile.revealed && !tile.isMine ? "safe" : ""}`}
                      onClick={() => revealTile(tile.id)}
                      disabled={!running || tile.revealed}
                    >
                      {tile.revealed ? (
                        tile.isMine ? <Bomb size={18} /> : <Bone size={18} />
                      ) : (
                        <span className="mines-hidden-dot" />
                      )}
                    </button>
                  ))
                ) : (
                  Array.from({ length: 25 }).map((_, index) => (
                    <div key={index} className="mines-tile placeholder">
                      <span className="mines-hidden-dot" />
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="section-spacing">
              <div className="coach-card">
                <div className="coach-label">
                  {gameOver
                    ? won
                      ? "Round won"
                      : "Round lost"
                    : running
                    ? "Round live"
                    : "Ready"}
                </div>
                <div className="carrier-meta">
                  {gameOver
                    ? won
                      ? `You secured a payout at ${multiplier.toFixed(2)}x or better.`
                      : "You hit a mine and lost the wager."
                    : running
                    ? "Pick safe tiles and cash out before you hit a mine."
                    : minesGameConfig.note}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="glass-card neon-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="card-pad">
            <div className="panel-title">Game Controls</div>

            <div className="modal-form">
              <input
                type="number"
                min={minesGameConfig.minBet}
                max={Math.min(minesGameConfig.maxBet, balance)}
                value={bet}
                onChange={(e) => setBet(Number(e.target.value || 0))}
                disabled={running}
              />

              <input
                type="number"
                min={minesGameConfig.minMines}
                max={minesGameConfig.maxMines}
                value={mineCount}
                onChange={(e) =>
                  setMineCount(
                    Math.max(
                      minesGameConfig.minMines,
                      Math.min(minesGameConfig.maxMines, Number(e.target.value || 1))
                    )
                  )
                }
                disabled={running}
              />
            </div>

            <div className="carrier-card-actions" style={{ marginTop: 18 }}>
              <button
                className="primary-btn primary-btn-purple"
                onClick={startGame}
                disabled={running || bet < minesGameConfig.minBet || bet > balance}
              >
                <Bone size={15} />
                Start Game
              </button>

              <button
                className="small-btn"
                onClick={cashOut}
                disabled={!running || safePicks === 0}
              >
                <TrendingUp size={15} />
                Cash Out
              </button>

              <button className="small-btn" onClick={resetGame}>
                Reset
              </button>
            </div>

            <div className="reward-burst-row" style={{ marginTop: 16 }}>
              <div className="reward-burst-card">
                <Grid3X3 size={18} />
                <span>25 Tiles</span>
              </div>
              <div className="reward-burst-card">
                <Bomb size={18} />
                <span>{mineCount} Mines</span>
              </div>
              <div className="reward-burst-card">
                <Bone size={18} />
                <span>{multiplier.toFixed(2)}x</span>
              </div>
            </div>

            <div className="section-spacing">
              <div className="dashboard-signal-list">
                <div className="dashboard-signal-card">
                  <div className="dashboard-signal-icon">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <div className="pipeline-name">Fair Board</div>
                    <div className="carrier-meta">
                      Mines are randomly placed when the round starts.
                    </div>
                  </div>
                </div>

                <div className="dashboard-signal-card">
                  <div className="dashboard-signal-icon">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <div className="pipeline-name">Risk Scaling</div>
                    <div className="carrier-meta">
                      More mines means bigger multiplier growth and more danger.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="section-spacing">
              <div className="panel-title" style={{ fontSize: "1rem" }}>Recent Rounds</div>

              <div className="leaderboard-list" style={{ marginTop: 12 }}>
                {history.length > 0 ? (
                  history.map((item) => (
                    <div key={item.id} className="glass-card inner-glow-card">
                      <div className="card-pad">
                        <div className="task-row">
                          <div>
                            <div className="carrier-name">{item.type}</div>
                            <div className="carrier-meta">
                              Mines: {item.mineCount} • Safe Picks: {item.safePicks}
                            </div>
                          </div>

                          <div className="task-badges">
                            <span
                              className={`tag ${
                                item.type === "Loss" ? "priority-high" : "status-open"
                              }`}
                            >
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
          </div>
        </motion.div>
      </div>
    </div>
  );
}
export const auditLogs = [
  {
    id: 1,
    actor: "Adrien",
    action: "Updated lead stage",
    target: "Marcus Hill",
    category: "Lead",
    timestamp: "2026-03-27 9:12 AM",
    severity: "Info",
  },
  {
    id: 2,
    actor: "Jasmine",
    action: "Created task",
    target: "David Brooks",
    category: "Task",
    timestamp: "2026-03-27 10:04 AM",
    severity: "Info",
  },
  {
    id: 3,
    actor: "System",
    action: "Commission status changed to Paid",
    target: "Sandra Lopez",
    category: "Commission",
    timestamp: "2026-03-27 11:18 AM",
    severity: "Success",
  },
  {
    id: 4,
    actor: "Malik",
    action: "Edited appointment",
    target: "Renee Carter",
    category: "Appointment",
    timestamp: "2026-03-27 12:02 PM",
    severity: "Warning",
  },
  {
    id: 5,
    actor: "System",
    action: "New recruit added to pipeline",
    target: "Tori Benson",
    category: "Recruiting",
    timestamp: "2026-03-27 1:26 PM",
    severity: "Info",
  },
];