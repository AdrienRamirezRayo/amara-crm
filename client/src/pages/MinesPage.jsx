import React, { useEffect, useMemo, useState } from "react";
import { useGameEconomy } from "../context/GameEconomyContext.jsx";

const TOTAL_TILES = 25;

function shuffle(array) {
  const cloned = [...array];
  for (let i = cloned.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }
  return cloned;
}

function getMultiplier(revealedCount, minesCount) {
  if (revealedCount <= 0) return 1;
  const difficultyBase = 1 + minesCount * 0.12;
  const progressBase = 1 + revealedCount * 0.18;
  return Number((difficultyBase * progressBase).toFixed(2));
}

function getLeaderboardPoints(minesCount) {
  const map = {
    1: 10,
    2: 12,
    3: 15,
    4: 18,
    5: 22,
    6: 28,
    7: 34,
    8: 40,
    9: 48,
    10: 56,
  };
  return map[minesCount] || 12;
}

function TechCard({ children, className = "" }) {
  return (
    <div
      className={`crm-panel crm-hover-lift rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

export default function MinesPage() {
  const { currentAgent, rewardWin, recordLoss } = useGameEconomy();

  const [bet, setBet] = useState(50);
  const [minesCount, setMinesCount] = useState(3);
  const [minePositions, setMinePositions] = useState([]);
  const [revealed, setRevealed] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [roundActive, setRoundActive] = useState(false);
  const [message, setMessage] = useState("");

  const multiplier = useMemo(
    () => getMultiplier(revealed.length, minesCount),
    [revealed.length, minesCount]
  );

  const startNewRound = () => {
    const safeBet = Number(bet);
    const safeMines = Number(minesCount);

    if (!safeBet || safeBet <= 0) {
      setMessage("Enter a valid Dog Bones bet.");
      return;
    }

    if (safeBet > currentAgent.dogBones) {
      setMessage("Not enough Dog Bones.");
      return;
    }

    if (!safeMines || safeMines < 1 || safeMines > 10) {
      setMessage("Choose between 1 and 10 mines.");
      return;
    }

    const positions = shuffle([...Array(TOTAL_TILES).keys()]).slice(0, safeMines);

    setMinePositions(positions);
    setRevealed([]);
    setGameOver(false);
    setRoundActive(true);
    setMessage("Round started. Pick safe tiles or cash out.");
  };

  const handleTileClick = (index) => {
    if (!roundActive || gameOver) return;
    if (revealed.includes(index)) return;

    if (minePositions.includes(index)) {
      const penalty = Math.max(4, Math.floor(minesCount / 2));

      setRevealed((prev) => [...prev, index]);
      setGameOver(true);
      setRoundActive(false);

      recordLoss({
        game: "mines",
        bonesLost: Number(bet),
        leaderboardPenalty: penalty,
        note: `Lost Mines with ${minesCount} mines`,
      });

      setMessage(`Boom. You lost ${bet} Dog Bones and -${penalty} score.`);
      return;
    }

    setRevealed((prev) => [...prev, index]);
  };

  const handleCashOut = () => {
    if (!roundActive || gameOver || revealed.length === 0) {
      setMessage("Reveal at least one safe tile before cashing out.");
      return;
    }

    const bonesWon = Math.floor(Number(bet) * multiplier);
    const leaderboardPoints = getLeaderboardPoints(minesCount);

    rewardWin({
      game: "mines",
      bonesWon,
      leaderboardPoints,
      note: `Won Mines with ${minesCount} mines at ${multiplier}x`,
    });

    setGameOver(true);
    setRoundActive(false);
    setMessage(`Cashout successful: +${bonesWon} Dog Bones and +${leaderboardPoints} score.`);
  };

  useEffect(() => {
    if (!roundActive && !gameOver) {
      setMessage("Set your bet and mine count, then start a round.");
    }
  }, [roundActive, gameOver]);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[10px] uppercase tracking-[0.32em] text-zinc-500">Games</div>
        <h1 className="mt-1 bg-gradient-to-r from-white via-violet-200 to-emerald-200 bg-clip-text text-4xl font-black tracking-tight text-transparent">
          Mines
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          High-risk board game with cleaner layout and premium competition style.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[420px_1fr]">
        <TechCard className="crm-glow-purple">
          <div className="crm-orb-purple right-[-60px] top-[-70px]" />
          <div className="relative z-10">
            <div className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
              Round Setup
            </div>
            <h2 className="mt-2 text-3xl font-black text-white">Risk Controls</h2>

            <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-5">
              <div className="text-sm text-zinc-500">Current Dog Bones</div>
              <div className="mt-2 text-4xl font-black text-emerald-300">
                {currentAgent.dogBones}
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-300">Bet</label>
                <input
                  type="number"
                  min="1"
                  value={bet}
                  onChange={(e) => setBet(Number(e.target.value))}
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-white outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-300">
                  Number of Mines
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={minesCount}
                  onChange={(e) => setMinesCount(Number(e.target.value))}
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-white outline-none"
                />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                  Multiplier
                </div>
                <div className="mt-2 text-2xl font-black text-violet-200">{multiplier}x</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                  Score Reward
                </div>
                <div className="mt-2 text-2xl font-black text-emerald-300">
                  {getLeaderboardPoints(minesCount)}
                </div>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={startNewRound}
                className="flex-1 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-4 font-black text-white"
              >
                Start Round
              </button>

              <button
                type="button"
                onClick={handleCashOut}
                className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 px-4 py-4 font-black text-black"
              >
                Cash Out
              </button>
            </div>
          </div>
        </TechCard>

        <TechCard className="crm-glow-green">
          <div className="crm-orb-green bottom-[-50px] left-[-40px]" />
          <div className="relative z-10">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                  Live Board
                </div>
                <h2 className="mt-2 text-3xl font-black text-white">Mines Grid</h2>
              </div>

              <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-emerald-300">
                Active
              </div>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {[...Array(TOTAL_TILES)].map((_, index) => {
                const isRevealed = revealed.includes(index);
                const isMine = minePositions.includes(index);

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleTileClick(index)}
                    disabled={!roundActive || isRevealed || gameOver}
                    className={`aspect-square rounded-2xl border text-xl font-bold transition ${
                      isRevealed && isMine
                        ? "border-red-500 bg-red-500/20 text-red-300"
                        : isRevealed
                        ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                        : "border-white/10 bg-black/20 hover:border-violet-500 hover:bg-violet-500/10"
                    }`}
                  >
                    {isRevealed ? (isMine ? "💣" : "🐾") : "?"}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-300">
              {message}
            </div>
          </div>
        </TechCard>
      </div>
    </div>
  );
}