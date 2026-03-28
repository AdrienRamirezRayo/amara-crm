import React, { useState } from "react";
import { useGameEconomy } from "../context/GameEconomyContext.jsx";

function TechCard({ children, className = "" }) {
  return (
    <div
      className={`crm-panel crm-hover-lift rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

export default function CoinFlipPage() {
  const { currentAgent, rewardWin, recordLoss } = useGameEconomy();
  const [bet, setBet] = useState(50);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");

  const handlePlay = () => {
    const safeBet = Number(bet);

    if (!safeBet || safeBet <= 0) {
      setMessage("Enter a valid Dog Bones amount.");
      return;
    }

    if (safeBet > currentAgent.dogBones) {
      setMessage("Not enough Dog Bones.");
      return;
    }

    const won = Math.random() < 0.5;

    if (won) {
      const bonesWon = safeBet;
      const leaderboardPoints = 10;

      rewardWin({
        game: "coin_flip",
        bonesWon,
        leaderboardPoints,
        note: `Won Coin Flip for ${bonesWon} Dog Bones`,
      });

      setResult("WIN");
      setMessage(`You won +${bonesWon} Dog Bones and +${leaderboardPoints} score.`);
    } else {
      const bonesLost = safeBet;
      const leaderboardPenalty = 5;

      recordLoss({
        game: "coin_flip",
        bonesLost,
        leaderboardPenalty,
        note: `Lost Coin Flip and lost ${bonesLost} Dog Bones`,
      });

      setResult("LOSS");
      setMessage(`You lost ${bonesLost} Dog Bones and -${leaderboardPenalty} score.`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[10px] uppercase tracking-[0.32em] text-zinc-500">Games</div>
        <h1 className="mt-1 bg-gradient-to-r from-white via-violet-200 to-emerald-200 bg-clip-text text-4xl font-black tracking-tight text-transparent">
          Coin Flip
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Clean game view with stronger competition styling.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <TechCard className="crm-glow-purple">
          <div className="crm-orb-purple right-[-70px] top-[-60px]" />
          <div className="relative z-10">
            <div className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">50 / 50</div>
            <h2 className="mt-2 text-3xl font-black text-white">Risk the Bones</h2>

            <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-6 text-center">
              <div className="text-sm text-zinc-500">Current Dog Bones</div>
              <div className="mt-2 text-5xl font-black text-emerald-300">
                {currentAgent.dogBones}
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-zinc-300">
                Enter Bet
              </label>
              <input
                type="number"
                min="1"
                value={bet}
                onChange={(e) => setBet(Number(e.target.value))}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-lg text-white outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handlePlay}
              className="mt-5 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-4 text-lg font-black text-white shadow-[0_12px_30px_rgba(0,0,0,0.24)] transition hover:scale-[1.01]"
            >
              Flip Now
            </button>
          </div>
        </TechCard>

        <TechCard className="crm-glow-green">
          <div className="crm-orb-green bottom-[-60px] left-[-50px]" />
          <div className="relative z-10">
            <div className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">Outcome</div>
            <h2 className="mt-2 text-3xl font-black text-white">Round Status</h2>

            <div
              className={`mt-6 rounded-3xl p-8 text-center ${
                result === "WIN"
                  ? "bg-emerald-500/10"
                  : result === "LOSS"
                  ? "bg-red-500/10"
                  : "bg-black/20"
              }`}
            >
              <div className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                Result
              </div>
              <div
                className={`mt-3 text-5xl font-black ${
                  result === "WIN"
                    ? "text-emerald-300"
                    : result === "LOSS"
                    ? "text-red-300"
                    : "text-zinc-600"
                }`}
              >
                {result || "READY"}
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-300">
              {message || "Place your bet and flip."}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                  Score Reward
                </div>
                <div className="mt-2 text-2xl font-black text-violet-200">+10</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                  Risk Level
                </div>
                <div className="mt-2 text-2xl font-black text-emerald-300">50 / 50</div>
              </div>
            </div>
          </div>
        </TechCard>
      </div>
    </div>
  );
}